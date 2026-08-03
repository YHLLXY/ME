/* === js/render.js === */

/* ===== 状态 ===== */
let questions = [];
let answers = {};
let nodePool = [];
let POOL_SIZE = 35; /* 默认值；initRender 按视口高度动态扩容 */
const DOMAIN_HEADER_HEIGHT = 100;

/* 估算高度 — 基于实际 UI 测量（卡片头 ~55px + 输入区 + 跳过按钮 ~30px + padding ~32px） */
const ESTIMATED_HEIGHTS = {
  likert5: 180, likert7: 180, radio: 340, checkbox: 420,
  ranking: 360, slider: 190, shorttext: 180, longtext: 260
};
let questionPositions = [];
let boundRange = { from: -1, to: -1 };  // 节点池实际覆盖的题目范围（≠ 窗口范围，池可能滞后）
let viewportEl = null;
let spacerEl = null;
let ticking = false;

/* ResizeObserver 动态高度校准 */
let measuredHeights = {};       // qi → 真实测量高度（含领域标题）
let resizeObserver = null;
let pendingRecalc = false;
let _suppressScroll = false;    // rebuildPositions 内部设 scrollTop 时抑制 scroll 事件

/* ===== 初始化渲染 ===== */
function initRender(_questions, _answers) {
  questions = _questions;
  answers = _answers;
  viewportEl = document.getElementById('viewport');
  spacerEl = document.getElementById('spacer');

  /* 滚动容器启用 GPU 合成 */
  if (viewportEl.parentElement) {
    viewportEl.parentElement.style.willChange = 'scroll-position';
  }

  /* M3: 按视口高度动态扩容节点池（7 屏缓冲 / 每题估算 180px + 10 余量；1080p ≈ 52） */
  const viewH = viewportEl.parentElement?.clientHeight || 800;
  POOL_SIZE = Math.ceil((7 * viewH) / 180) + 10;

  /* 构建初始位置表（估算）— 必须在节点池创建之后，保证首个 renderVisible 全量绑定 */
  rebuildPositions();

  /* 创建 ResizeObserver — 渲染后自动测量真实高度 */
  resizeObserver = new ResizeObserver(onNodeResize);

  /* 预创建节点池，全部纳入 ResizeObserver 监听 */
  for (let i = 0; i < POOL_SIZE; i++) {
    const div = document.createElement('div');
    div.className = 'question-slot';
    div.style.cssText = 'position:absolute;left:0;right:0;overflow:hidden;';
    div.setAttribute('aria-hidden', 'true');
    div.dataset.qi = '-1';
    spacerEl.appendChild(div);
    nodePool.push({ el: div, qi: -1, transform: null });
    resizeObserver.observe(div);
  }

  /* 滚动监听（RAF 节流，抑制内部 scrollTop 调整触发的伪事件） */
  viewportEl.parentElement.addEventListener('scroll', () => {
    if (_suppressScroll) return;
    if (!ticking) {
      requestAnimationFrame(() => { renderVisible(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  renderVisible();
}

/* ===== 虚拟滚动核心（滑动窗口池） =====
   节点 ↔ 题目的绑定在滚动中保持稳定：范围移动时只有边缘节点重建，
   其余节点仅刷 transform（值未变则零写入）→ 滚动全程无 innerHTML 重建、无动画、无过渡 */
function renderVisible() {
  if (!viewportEl || !spacerEl) return;

  const scrollParent = viewportEl.parentElement;
  /* 统一坐标系：scrollTop 减去 viewport 在瀑布流中的位移 = spacer 内部偏移 */
  const viewportTop = viewportEl.offsetTop;
  const scrollTop = scrollParent.scrollTop - viewportTop;
  const viewH = scrollParent.clientHeight;
  const buffer = viewH * 3; /* 上下各 3 屏缓冲 — 行业推荐值 */

  const renderStart = Math.max(0, scrollTop - buffer);
  const renderEnd = Math.min(scrollTop + viewH + buffer, spacerEl.offsetHeight);

  /* 二分查找下界（第一个进入渲染区的题目） */
  let lo = 0, hi = questions.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (questionPositions[mid] < renderStart) lo = mid + 1;
    else hi = mid;
  }
  let from = Math.max(0, lo - 5);

  /* 二分查找上界（最后一个进入渲染区的题目） */
  lo = from; hi = questions.length - 1;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (questionPositions[mid] > renderEnd) hi = mid - 1;
    else lo = mid;
  }
  let to = Math.min(questions.length - 1, hi + 5);

  if (to < from) {
    for (const slot of nodePool) if (slot.qi !== -1) hideSlot(slot);
    boundRange = { from: -1, to: -1 };
    return;
  }

  /* 池覆盖 ≠ 窗口 → 先回收池中溢出窗口的节点，再补绑窗口内缺绑的题目 */
  if (boundRange.from !== from || boundRange.to !== to) {
    for (const slot of nodePool) {
      /* 溢出范围的在 3 屏缓冲区外，不可见，直接回收（无动画） */
      if (slot.qi !== -1 && (slot.qi < from || slot.qi > to)) hideSlot(slot);
    }
    const bind = (qi) => {
      for (const slot of nodePool) {
        if (slot.qi === -1) {
          slot.qi = qi;
          slot.el.dataset.qi = qi;
          slot.el.style.display = '';
          slot.el.removeAttribute('aria-hidden');
          slot.transform = null; /* 强制写一次位置 */
          setTransform(slot, qi);
          renderQuestion(slot.el, questions[qi], qi);
          return;
        }
      }
    };
    if (boundRange.to < 0) {
      /* 首次渲染（或池完全清空后）：全量绑定 */
      for (let qi = from; qi <= to; qi++) bind(qi);
    } else {
      /* 只补绑窗口内缺绑的题目（钳制在 [from,to] 内，双向都安全） */
      for (let qi = Math.max(boundRange.to + 1, from); qi <= to; qi++) bind(qi);
      for (let qi = Math.min(boundRange.from - 1, to); qi >= from; qi--) bind(qi);
    }
    /* 按实际绑定结果回写覆盖范围 — 池耗尽时缺口会在下一 pass 自愈 */
    let bf = -1, bt = -1;
    for (const slot of nodePool) {
      if (slot.qi !== -1) {
        if (bf < 0 || slot.qi < bf) bf = slot.qi;
        if (slot.qi > bt) bt = slot.qi;
      }
    }
    boundRange = { from: bf, to: bt };
  }

  /* 全量刷位置（高度校准后坐标变化也在这里生效；值相同则零写入） */
  for (const slot of nodePool) {
    if (slot.qi !== -1) setTransform(slot, slot.qi);
  }
}

/* 节点回收：立即隐藏，不参与任何动画 */
function hideSlot(slot) {
  slot.qi = -1;
  slot.el.dataset.qi = '-1';
  slot.el.setAttribute('aria-hidden', 'true');
  slot.el.style.display = 'none';
}

/* GPU 合成层定位 — 值未变不写，避免无谓的样式重算 */
function setTransform(slot, qi) {
  const v = `translateY(${questionPositions[qi]}px)`;
  if (slot.transform !== v) {
    slot.transform = v;
    slot.el.style.transform = v;
  }
}

/* 答题后的定点刷新：只重建答案卡片 + 其领域标题卡片。
   其余卡片 DOM 纹丝不动 → 不再出现整池闪动；输入框持焦点时跳过（V1 保护） */
function rerenderCards(qid) {
  const qi = questions.findIndex(q => q.id === qid);
  if (qi < 0) return;
  const domain = questions[qi].domain;
  let headerQi = qi;
  while (headerQi > 0 && questions[headerQi - 1].domain === domain) headerQi--;
  const targets = qi === headerQi ? new Set([qi]) : new Set([qi, headerQi]);
  for (const slot of nodePool) {
    if (slot.qi !== -1 && targets.has(slot.qi)) {
      const ae = document.activeElement;
      if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA') && slot.el.contains(ae)) continue;
      renderQuestion(slot.el, questions[slot.qi], slot.qi);
    }
  }
}

/* ===== ResizeObserver 回调 ===== */
function onNodeResize(entries) {
  let needsRecalc = false;
  for (const entry of entries) {
    const qi = parseInt(entry.target.dataset.qi);
    if (isNaN(qi) || qi < 0) continue;
    const newH = entry.target.offsetHeight; /* 使用 offsetHeight 获取完整盒模型高度 */
    /* ≤1px 抖动（字体子像素取整导致 189↔190 振荡）忽略，否则会无限触发重排循环 */
    if (newH > 0 && Math.abs((measuredHeights[qi] || 0) - newH) > 1) {
      measuredHeights[qi] = newH;
      needsRecalc = true;
    }
  }
  if (needsRecalc && !pendingRecalc) {
    pendingRecalc = true;
    requestAnimationFrame(() => {
      rebuildPositions();
      renderVisible(); /* 位置表已变 → 全量刷 transform；窗口移动则补绑边缘节点 */
      pendingRecalc = false;
    });
  }
}

/* ===== 重建位置表（实测高度优先，估算兜底） ===== */
function rebuildPositions() {
  if (!viewportEl || !viewportEl.parentElement || !spacerEl) return;

  const scrollParent = viewportEl.parentElement;
  const viewportTop = viewportEl.offsetTop;

  /* 锚点：记录当前视口顶部的题目在 spacer 坐标系内的偏移 */
  let anchorQi = 0;
  if (questionPositions.length > 0) {
    const st = scrollParent.scrollTop - viewportTop; /* 统一到 spacer 坐标系 */
    for (let i = questions.length - 1; i >= 0; i--) {
      if (questionPositions[i] <= st) { anchorQi = i; break; }
    }
  }

  let offset = 0;
  questionPositions = [];
  for (let i = 0; i < questions.length; i++) {
    questionPositions.push(offset);
    if (measuredHeights[i]) {
      /* 实测高度已包含领域标题，直接用 */
      offset += measuredHeights[i];
    } else {
      /* 估算：领域第一题加标题空间 */
      if (i === 0 || questions[i - 1].domain !== questions[i].domain) {
        offset += DOMAIN_HEADER_HEIGHT;
      }
      offset += ESTIMATED_HEIGHTS[questions[i].type] || 140;
    }
  }
  spacerEl.style.height = offset + 'px';
  spacerEl.style.position = 'relative';

  /* 恢复锚点 — 仅当用户已在题目区域时才校准，避免初始加载时跳转 */
  const currentScroll = scrollParent.scrollTop;
  if (currentScroll >= viewportTop) {
    _suppressScroll = true;
    scrollParent.scrollTop = questionPositions[anchorQi] + viewportTop;
    requestAnimationFrame(() => { _suppressScroll = false; });
  }
}

/* ===== 渲染领域分段标题 ===== */
function renderDomainHeader(domain, startIndex, endIndex) {
  const domainInfo = DOMAINS.find(d => d.id === domain);
  if (!domainInfo) return '';

  const answeredInDomain = Object.keys(answers).filter(k => {
    const q = questions.find(qq => qq.id === k);
    return q && q.domain === domain && answers[k] !== '__SKIPPED__';
  }).length;
  const totalInDomain = endIndex - startIndex + 1;

  return `<div class="domain-header" id="domain-${domain}">
    <div class="domain-header-title">${domainInfo.emoji} ${domainInfo.name}</div>
    <div class="domain-header-meta">
      第 ${startIndex + 1}-${endIndex + 1} 题 · 共 ${totalInDomain} 题
      <span class="domain-header-progress">已答 ${answeredInDomain}</span>
    </div>
  </div>`;
}

/* ===== 渲染单个题目 ===== */
function renderQuestion(container, q, index) {
  const val = answers[q.id] ?? null;
  const isSkipped = val === '__SKIPPED__';

  container.innerHTML = '';

  /* 检查领域边界，插入分段标题 */
  if (index === 0 || questions[index - 1].domain !== q.domain) {
    let endIndex = index;
    while (endIndex < questions.length - 1 && questions[endIndex + 1].domain === q.domain) {
      endIndex++;
    }
    container.innerHTML = renderDomainHeader(q.domain, index, endIndex);
  }

  const card = document.createElement('div');
  card.className = `q-card${isSkipped ? ' skipped' : ''}`;
  card.dataset.qid = q.id;

  /* 题号 + meta */
  const header = `<div class="q-header">
    <span class="q-number">Q${index + 1}</span>
    <div>
      <div class="q-meta">${getLayerLabel(q.layer)} · ${getTypeLabel(q.type)}</div>
      <div class="q-text">${q.text}</div>
    </div>
  </div>`;

  /* 根据类型渲染输入区 */
  let inputHTML = '';
  switch (q.type) {
    case 'likert5': inputHTML = renderLikert(q, val, 5); break;
    case 'likert7': inputHTML = renderLikert(q, val, 7); break;
    case 'radio':   inputHTML = renderRadio(q, val); break;
    case 'checkbox':inputHTML = renderCheckbox(q, val); break;
    case 'ranking': inputHTML = renderRanking(q, val); break;
    case 'slider':  inputHTML = renderSlider(q, val); break;
    case 'shorttext': inputHTML = renderShortText(q, val); break;
    case 'longtext': inputHTML = renderLongText(q, val); break;
  }

  const actions = `<div class="q-actions">
    <button class="q-skip-btn" data-action="skip" data-qid="${q.id}">
      ${isSkipped ? '取消跳过' : '稍后回答'}
    </button>
  </div>`;

  card.innerHTML = header + inputHTML + actions;
  container.appendChild(card);
}

/* ===== 题型渲染函数 ===== */
function renderLikert(q, val, levels) {
  const dots = Array.from({ length: levels }, (_, i) => {
    const v = i + 1;
    const sel = val === v ? ' selected' : '';
    return `<button class="likert-dot${sel}" data-action="likert" data-qid="${q.id}" data-value="${v}" aria-label="${v}"></button>`;
  }).join('');
  return `<div class="likert-row">
    <span class="likert-label">${q.options[0]?.label || '低'}</span>
    <div class="likert-dots">${dots}</div>
    <span class="likert-label">${q.options[q.options.length - 1]?.label || '高'}</span>
  </div>`;
}

function renderRadio(q, val) {
  const opts = (q.options || []).map(opt => {
    const sel = val === opt.value ? ' selected' : '';
    return `<div class="radio-option${sel}" data-action="radio" data-qid="${q.id}" data-value="${opt.value}">${opt.label}</div>`;
  }).join('');
  return `<div class="radio-list">${opts}</div>`;
}

function renderCheckbox(q, val) {
  const selected = Array.isArray(val) ? val : [];
  const opts = (q.options || []).map(opt => {
    const checked = selected.includes(opt.value) ? ' checked' : '';
    return `<div class="check-option${checked}" data-action="checkbox" data-qid="${q.id}" data-value="${opt.value}">
      <div class="check-box"></div>${opt.label}
    </div>`;
  }).join('');
  return `<div class="radio-list">${opts}</div>`;
}

function renderRanking(q, val) {
  /* 答案 = 有序 option value 数组；默认按原始选项顺序 */
  const ordered = Array.isArray(val) ? val : (q.options || []).map(o => o.value);
  const items = ordered.map((v, i) => {
    const label = (q.options || []).find(o => o.value === v)?.label || v;
    const first = i === 0;
    const last = i === ordered.length - 1;
    return `<div class="ranking-item" data-qid="${q.id}">
      <span class="ranking-num">${i + 1}.</span> ${label}
      <span class="ranking-moves">
        <button type="button" class="ranking-move" data-action="ranking" data-qid="${q.id}" data-index="${i}" data-dir="up" aria-label="上移"${first ? ' disabled' : ''}>↑</button>
        <button type="button" class="ranking-move" data-action="ranking" data-qid="${q.id}" data-index="${i}" data-dir="down" aria-label="下移"${last ? ' disabled' : ''}>↓</button>
      </span>
    </div>`;
  }).join('');
  return `<div class="ranking-list">${items}</div>`;
}

function renderSlider(q, val) {
  const v = val ?? 50;
  return `<div class="slider-wrap">
    <input type="range" min="0" max="100" value="${v}" class="native-slider" data-action="slider" data-qid="${q.id}" style="width:100%;accent-color:var(--accent);">
    <div class="slider-labels"><span>0</span><span>50</span><span>100</span></div>
  </div>`;
}

function renderShortText(q, val) {
  return `<input type="text" class="text-input-short" data-action="shorttext" data-qid="${q.id}"
    value="${escapeHTML(val || '')}" placeholder="输入你的回答..."
    maxlength="${q.maxLength || 300}">
    <div class="char-count">${(val || '').length}/${q.maxLength || 300}</div>`;
}

function renderLongText(q, val) {
  return `<textarea class="text-input-long" data-action="longtext" data-qid="${q.id}"
    placeholder="写下你的想法...">${escapeHTML(val || '')}</textarea>`;
}

/* ===== 辅助函数 ===== */
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function getLayerLabel(layer) {
  const map = { factual: '事实层', perceptual: '感知层', narrative: '叙事层' };
  return map[layer] || layer;
}
function getTypeLabel(type) {
  const map = { likert5: '量表', likert7: '量表', radio: '单选', checkbox: '多选', ranking: '排序', slider: '滑杆', shorttext: '简答', longtext: '长答' };
  return map[type] || type;
}
