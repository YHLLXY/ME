/* === js/render.js === */

/* ===== 状态 ===== */
let questions = [];
let answers = {};
let nodePool = [];
const POOL_SIZE = 35;
const DOMAIN_HEADER_HEIGHT = 100;

/* 估算高度 — 基于实际 UI 测量（卡片头 ~55px + 输入区 + 跳过按钮 ~30px + padding ~32px） */
const ESTIMATED_HEIGHTS = {
  likert5: 180, likert7: 180, radio: 340, checkbox: 420,
  ranking: 360, slider: 190, shorttext: 180, longtext: 260
};
let questionPositions = [];
let lastRenderRange = { from: -1, to: -1 };
let viewportEl = null;
let spacerEl = null;
let ticking = false;

/* ResizeObserver 动态高度校准 */
let measuredHeights = {};       // qi → 真实测量高度（含领域标题）
let resizeObserver = null;
let pendingRecalc = false;

/* ===== 动画 CSS 注入 ===== */
let _animCSSInjected = false;
function _injectAnimCSS() {
  if (_animCSSInjected) return;
  _animCSSInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    .question-slot {
      transition: opacity 250ms ease-out, transform 200ms ease-out;
      overflow: hidden;
    }
    /* 节点正在"入场"——先从透明+微下移开始，下一帧过渡到正常 */
    .question-slot.entering {
      opacity: 0;
      transform: translateY(6px);
    }
    @media (prefers-reduced-motion: reduce) {
      .question-slot { transition: none; }
      .question-slot.entering { opacity: 1; transform: none; }
    }
  `;
  document.head.appendChild(style);
}

/* ===== 初始化渲染 ===== */
function initRender(_questions, _answers) {
  questions = _questions;
  answers = _answers;
  viewportEl = document.getElementById('viewport');
  spacerEl = document.getElementById('spacer');

  _injectAnimCSS();

  /* 滚动容器启用 GPU 合成 */
  if (viewportEl.parentElement) {
    viewportEl.parentElement.style.willChange = 'scroll-position';
  }

  /* 构建初始位置表（估算） */
  rebuildPositions();

  /* 创建 ResizeObserver — 渲染后自动测量真实高度 */
  resizeObserver = new ResizeObserver(onNodeResize);

  /* 预创建节点池，全部纳入 ResizeObserver 监听 */
  for (let i = 0; i < POOL_SIZE; i++) {
    const div = document.createElement('div');
    div.className = 'question-slot';
    div.style.cssText = 'position:absolute;left:0;right:0;';
    div.setAttribute('aria-hidden', 'true');
    div.dataset.qi = '-1';
    spacerEl.appendChild(div);
    nodePool.push({ el: div, qi: -1 });
    resizeObserver.observe(div);
  }

  /* 滚动监听（RAF 节流） */
  viewportEl.parentElement.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { renderVisible(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  renderVisible();
}

/* ===== 虚拟滚动核心 ===== */
function renderVisible() {
  if (!viewportEl || !spacerEl) return;

  const scrollParent = viewportEl.parentElement;
  const scrollTop = scrollParent.scrollTop;
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

  /* 范围没变 → 跳过（除非强制刷新，如答完题需要更新选中态） */
  if (!arguments[0] && from === lastRenderRange.from && to === lastRenderRange.to) return;
  lastRenderRange = { from, to };

  const count = to - from + 1;

  for (let i = 0; i < POOL_SIZE; i++) {
    const slot = nodePool[i];
    const el = slot.el;

    if (i < count) {
      const qi = from + i;
      const q = questions[qi];

      /* GPU 合成层定位 — 避免 reflow */
      el.style.transform = `translateY(${questionPositions[qi]}px)`;
      el.style.display = '';
      el.removeAttribute('aria-hidden');

      /* 如果节点是复用的（换了题目）→ 入场动画 */
      if (slot.qi !== qi) {
        slot.qi = qi;
        el.dataset.qi = qi;
        el.classList.add('entering');
        renderQuestion(el, q, qi);
        /* 下一帧移除 entering → CSS 过渡自动执行 */
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.classList.remove('entering');
          });
        });
      } else if (arguments[0]) {
        /* 同题目但强制刷新（答题后更新选中态）→ 无动画直接重新渲染 */
        renderQuestion(el, q, qi);
      }
    } else {
      /* 池中多余节点 — 静默隐藏 */
      if (slot.qi !== -1) {
        slot.qi = -1;
        el.dataset.qi = '-1';
        el.classList.add('entering');
        el.setAttribute('aria-hidden', 'true');
        requestAnimationFrame(() => {
          el.style.display = 'none';
          el.classList.remove('entering');
        });
      }
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
    if (newH > 0 && measuredHeights[qi] !== newH) {
      measuredHeights[qi] = newH;
      needsRecalc = true;
    }
  }
  if (needsRecalc && !pendingRecalc) {
    pendingRecalc = true;
    requestAnimationFrame(() => {
      rebuildPositions();
      renderVisible(true);
      pendingRecalc = false;
    });
  }
}

/* ===== 重建位置表（实测高度优先，估算兜底） ===== */
function rebuildPositions() {
  /* 锚点：记录当前视口顶部的题目，防止校准后页面跳动 */
  let anchorQi = 0;
  if (viewportEl && viewportEl.parentElement && questionPositions.length > 0) {
    const st = viewportEl.parentElement.scrollTop;
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
  if (spacerEl) {
    spacerEl.style.height = offset + 'px';
    spacerEl.style.position = 'relative';
  }

  /* 恢复锚点 — 校准前后视口顶部题目不变 */
  if (viewportEl && viewportEl.parentElement) {
    viewportEl.parentElement.scrollTop = questionPositions[anchorQi];
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
  const ordered = Array.isArray(val) ? val : (q.options || []).map(o => o.value);
  const items = ordered.map((v, i) => {
    const label = (q.options || []).find(o => o.value === v)?.label || v;
    return `<div class="ranking-item" draggable="true" data-action="ranking" data-qid="${q.id}" data-value="${v}">
      <span class="ranking-handle">≡</span>
      <span class="ranking-num">${i + 1}.</span> ${label}
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
