/* === js/ui.js === */

/* ===== 进度条 ===== */
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const saveIndicator = document.getElementById('saveIndicator');

let saveIndicatorTimer = null;

function updateProgress(answered, total) {
  const pct = total === 0 ? 0 : Math.round((answered / total) * 100);
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${answered} / ${total}`;
}

function showSaved() {
  saveIndicator.classList.add('visible');
  clearTimeout(saveIndicatorTimer);
  saveIndicatorTimer = setTimeout(() => {
    saveIndicator.classList.remove('visible');
  }, 2000);
}

/* ===== Toast 轻提示 ===== */
let toastTimer = null;
function showToast(msg, ms = 3000) {
  let toast = document.querySelector('.app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'app-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, ms);
}

/* ===== 回到顶部按钮 ===== */
const btnBackTop = document.getElementById('btnBackTop');
const mainEl = document.querySelector('.waterfall');

function setupBackTop() {
  mainEl.addEventListener('scroll', () => {
    if (mainEl.scrollTop > window.innerHeight * 2) {
      btnBackTop.classList.add('visible');
    } else {
      btnBackTop.classList.remove('visible');
    }
  });
  btnBackTop.addEventListener('click', () => {
    mainEl.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== 领域导航 ===== */
function updateDomainNav(completedDomains) {
  document.querySelectorAll('.domain-link').forEach(link => {
    const domain = link.getAttribute('href')?.replace('#domain-', '');
    if (domain && completedDomains.includes(domain)) {
      link.classList.add('completed');
    }
  });
}

/* ===== 确认弹窗 ===== */
function showConfirm(msg) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-card">
        <p class="modal-msg">${msg}</p>
        <div class="modal-btns">
          <button class="btn-cancel">取消</button>
          <button class="btn-confirm">确认</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('.btn-cancel').onclick = () => { overlay.remove(); resolve(false); };
    overlay.querySelector('.btn-confirm').onclick = () => { overlay.remove(); resolve(true); };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) { overlay.remove(); resolve(false); } });
  });
}

// Modal CSS 注入
const modalCSS = document.createElement('style');
modalCSS.textContent = `
.modal-overlay { position:fixed; inset:0; z-index:300; background:rgba(0,0,0,0.6);
  display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); }
.modal-card { background:var(--bg-card); backdrop-filter:blur(20px); border:1px solid var(--border-subtle);
  border-radius:var(--radius-xl); padding:var(--space-lg); max-width:320px; width:90%;
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.04),0 8px 40px rgba(0,0,0,0.5); }
.modal-msg { color:var(--text-primary); font-size:var(--fs-sm); margin-bottom:var(--space-lg); text-align:center; }
.modal-btns { display:flex; gap:var(--space-sm); justify-content:flex-end; }
.modal-btns button { padding:8px 20px; border-radius:var(--radius-sm); font-size:var(--fs-sm); cursor:pointer;
  border:1px solid var(--border-subtle); background:transparent; color:var(--text-secondary);
  transition:all var(--ease-out); }
.modal-btns .btn-confirm { background:var(--accent); color:var(--bg-base); border-color:var(--accent); }
.modal-btns .btn-confirm:hover { box-shadow:0 0 16px var(--accent-glow); }
.modal-btns .btn-cancel:hover { background:var(--bg-hover); color:var(--text-primary); }
`;
document.head.appendChild(modalCSS);

// Toast CSS 注入
const toastCSS = document.createElement('style');
toastCSS.textContent = `
.app-toast { position:fixed; bottom:80px; left:50%; transform:translateX(-50%) translateY(8px);
  background:var(--accent); color:var(--bg-base); padding:12px 24px; border-radius:24px;
  font-size:14px; font-weight:600; z-index:500; max-width:90vw; text-align:center;
  opacity:0; pointer-events:none; transition:opacity 300ms, transform 300ms; }
.app-toast.visible { opacity:1; transform:translateX(-50%) translateY(0); }
`;
document.head.appendChild(toastCSS);

