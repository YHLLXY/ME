/* === js/render.js === */

/* ===== 状态 ===== */
let questions = [];
let answers = {};
let nodePool = [];
const POOL_SIZE = 35;
const ESTIMATED_HEIGHTS = {
  likert5: 110, likert7: 110, radio: 180, checkbox: 200,
  ranking: 160, slider: 120, shorttext: 100, longtext: 160
};
let questionPositions = []; // 每道题的累计 Y 偏移
let lastRenderRange = { from: -1, to: -1 };
let viewportEl = null;
let spacerEl = null;
let ticking = false;

/* ===== 初始化渲染 ===== */
function initRender(_questions, _answers) {
  questions = _questions;
  answers = _answers;
  viewportEl = document.getElementById('viewport');
  spacerEl = document.getElementById('spacer');

  // 计算每题位置（动态高度）
  questionPositions = [];
  let offset = 0;
  for (const q of questions) {
    questionPositions.push(offset);
    offset += ESTIMATED_HEIGHTS[q.type] || 120;
  }
  spacerEl.style.height = `${offset}px`;
  spacerEl.style.position = 'relative';

  // 预创建节点池
  for (let i = 0; i < POOL_SIZE; i++) {
    const div = document.createElement('div');
    div.className = 'question-slot';
    div.style.cssText = 'position:absolute;left:0;right:0;';
    spacerEl.appendChild(div);
    nodePool.push(div);
  }

  // 滚动监听（RAF 节流）
  viewportEl.parentElement.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { renderVisible(); ticking = false; });
      ticking = true;
    }
  });

  renderVisible();
}

/* ===== 虚拟滚动核心 ===== */
function renderVisible() {
  const scrollTop = viewportEl.parentElement.scrollTop;
  const viewH = viewportEl.parentElement.clientHeight;
  const buffer = viewH; // 上下各一屏缓冲

  const renderStart = Math.max(0, scrollTop - buffer);
  const renderEnd = Math.min(scrollTop + viewH + buffer, spacerEl.offsetHeight);

  // 二分查找起始题号
  let from = 0, to = questions.length - 1;
  while (from < to) {
    const mid = Math.floor((from + to) / 2);
    if (questionPositions[mid] < renderStart) from = mid + 1;
    else to = mid;
  }
  from = Math.max(0, from - 3);

  while (to > from && questionPositions[to] > renderEnd) to--;
  to = Math.min(questions.length - 1, to + 3);

  if (from === lastRenderRange.from && to === lastRenderRange.to) return;
  lastRenderRange = { from, to };

  const count = to - from + 1;
  for (let i = 0; i < POOL_SIZE; i++) {
    const node = nodePool[i];
    if (i < count) {
      const qi = from + i;
      const q = questions[qi];
      node.style.top = `${questionPositions[qi]}px`;
      node.style.display = '';
      renderQuestion(node, q, qi);
    } else {
      node.style.display = 'none';
    }
  }
}

/* ===== 渲染单个题目 ===== */
function renderQuestion(container, q, index) {
  const val = answers[q.id] ?? null;
  const isSkipped = val === '__SKIPPED__';

  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = `q-card${isSkipped ? ' skipped' : ''}`;
  card.dataset.qid = q.id;

  // 题号 + meta
  const header = `<div class="q-header">
    <span class="q-number">Q${index + 1}</span>
    <div>
      <div class="q-meta">${getLayerLabel(q.layer)} · ${getTypeLabel(q.type)}</div>
      <div class="q-text">${q.text}</div>
    </div>
  </div>`;

  // 根据类型渲染输入区
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
  const dots = Array.from({length: levels}, (_, i) => {
    const v = i + 1;
    const sel = val === v ? ' selected' : '';
    return `<button class="likert-dot${sel}" data-action="likert" data-qid="${q.id}" data-value="${v}" aria-label="${v}"></button>`;
  }).join('');
  return `<div class="likert-row">
    <span class="likert-label">${q.options[0]?.label || '低'}</span>
    <div class="likert-dots">${dots}</div>
    <span class="likert-label">${q.options[q.options.length-1]?.label || '高'}</span>
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
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function getLayerLabel(layer) {
  const map = { factual:'事实层', perceptual:'感知层', narrative:'叙事层' };
  return map[layer] || layer;
}
function getTypeLabel(type) {
  const map = { likert5:'量表', likert7:'量表', radio:'单选', checkbox:'多选', ranking:'排序', slider:'滑杆', shorttext:'简答', longtext:'长答' };
  return map[type] || type;
}