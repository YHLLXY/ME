/* === js/app.js === */

let currentAnswers = {};
let currentSkipped = new Set();

/* ===== 初始化 ===== */
async function init() {
  // 初始化 IndexedDB
  await openDB();

  // 恢复草稿
  const draft = await restoreDraft();
  currentAnswers = draft.answers || {};
  if (draft.startedAt) {
    document.getElementById('introSection').style.display = 'none';
  }

  // 初始化渲染
  const viewportParent = document.querySelector('.waterfall');
  // 将滚动从 body 移到 waterfall
  viewportParent.style.overflowY = 'auto';
  viewportParent.style.height = '100vh';
  viewportParent.style.height = '100dvh';

  initRender(QUESTIONS, currentAnswers);

  // 初始化进度
  updateProgress(Object.keys(currentAnswers).filter(k => currentAnswers[k] !== '__SKIPPED__').length, QUESTIONS.length);

  // 事件代理
  setupEventDelegation();

  // 保存监听
  subscribe('saved', () => showSaved());

  // UI 组件
  setupBackTop();
  setupTheme();

  // 报告按钮
  const btnReport = document.getElementById('btnReport');
  btnReport.addEventListener('click', async () => {
    await generateReport();
    document.querySelector('.waterfall').style.display = 'none';
    document.getElementById('reportPage').hidden = false;
  });

  // 领域导航链接滚动
  document.querySelectorAll('.domain-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const domainId = link.getAttribute('href').replace('#', '');
      const header = document.getElementById(domainId);
      if (header) {
        header.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 开始按钮
  document.getElementById('btnStart').addEventListener('click', async () => {
    document.getElementById('introSection').style.display = 'none';
    await setMeta('startedAt', Date.now());
    renderVisible();
  });

  // 页面隐藏时立即保存
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) flushPendingSaves();
  });
}

/* ===== 全局事件代理 ===== */
function setupEventDelegation() {
  const viewport = document.getElementById('viewport');

  viewport.addEventListener('click', async (e) => {
    const action = e.target.dataset.action || e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;

    const el = e.target.dataset.action ? e.target : e.target.closest('[data-action]');
    const qid = el.dataset.qid;
    const value = el.dataset.value;

    switch (action) {
      case 'likert':
        await handleAnswer(qid, parseInt(value));
        break;
      case 'radio':
        await handleAnswer(qid, value);
        break;
      case 'checkbox':
        await handleCheckbox(qid, value);
        break;
      case 'skip':
        await handleSkip(qid);
        break;
    }
  });

  viewport.addEventListener('input', debounce(async (e) => {
    const action = e.target.dataset.action;
    if (!action) return;
    const qid = e.target.dataset.qid;

    switch (action) {
      case 'shorttext': await handleAnswer(qid, e.target.value); break;
      case 'longtext': await handleAnswer(qid, e.target.value); break;
      case 'slider': await handleAnswer(qid, parseInt(e.target.value)); break;
    }
  }, 500));
}

/* ===== 答案处理 ===== */
async function handleAnswer(qid, value) {
  currentAnswers[qid] = value;
  currentSkipped.delete(qid);
  scheduleSave(qid, value);
  updateProgress(
    Object.keys(currentAnswers).filter(k => currentAnswers[k] !== '__SKIPPED__').length,
    QUESTIONS.length
  );
  renderVisible(true); // 强制刷新 — 答题后需要更新选中态
  checkReportReady();

  // 检查是否全部完成
  const totalAnswered = Object.keys(currentAnswers).filter(k => currentAnswers[k] !== '__SKIPPED__').length;
  if (totalAnswered >= QUESTIONS.length) {
    setTimeout(() => {
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--accent);color:var(--bg-base);padding:12px 24px;border-radius:24px;font-size:14px;font-weight:600;z-index:500;animation:fadeInUp 300ms ease-out;';
      toast.textContent = '🎉 全部完成！点击右上角查看报告';
      document.body.appendChild(toast);
      setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 300ms'; setTimeout(() => toast.remove(), 300); }, 4000);
    }, 500);
  }
}

function checkReportReady() {
  const btnReport = document.getElementById('btnReport');
  const answered = Object.keys(currentAnswers).filter(k => currentAnswers[k] !== '__SKIPPED__').length;
  btnReport.hidden = answered < 20;
  // 更新领域导航完成状态
  const completedDomains = DOMAINS.filter(d => {
    const domainQuestions = QUESTIONS.filter(q => q.domain === d.id);
    const answered = domainQuestions.filter(q => currentAnswers[q.id] && currentAnswers[q.id] !== '__SKIPPED__').length;
    return answered >= domainQuestions.length * 0.8;
  }).map(d => d.id);
  updateDomainNav(completedDomains);
}

async function handleCheckbox(qid, value) {
  let arr = Array.isArray(currentAnswers[qid]) ? [...currentAnswers[qid]] : [];
  if (arr.includes(value)) arr = arr.filter(v => v !== value);
  else arr.push(value);
  await handleAnswer(qid, arr);
}

async function handleSkip(qid) {
  if (currentSkipped.has(qid)) {
    currentSkipped.delete(qid);
    delete currentAnswers[qid];
  } else {
    currentSkipped.add(qid);
    currentAnswers[qid] = '__SKIPPED__';
  }
  scheduleSave(qid, currentAnswers[qid]);
  renderVisible();
}

/* ===== 工具 ===== */
function debounce(fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

/* ===== 启动 ===== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}