# 自我画像 · Self-Portrait — 实施计划

> **For agentic workers:** 使用 superpowers:subagent-driven-development 或 superpowers:executing-plans 来按任务逐步实施。步骤使用 checkbox (`- [ ]`) 语法跟踪进度。

**Goal:** 构建一个 400 题自我认知问卷 PWA，包含虚拟滚动瀑布流作答界面和结构化个人画像报告。

**Architecture:** 纯前端原生 JS + IndexedDB 存储 + 虚拟滚动渲染 + 11 框架评分引擎。零构建工具，GitHub Pages 部署。

**Tech Stack:** HTML + CSS (CSS 变量 + 质感技法) + Vanilla JS (ES6+ Modules) + anime.js v4.5 + IndexedDB

---

## 文件结构概览

```
E:\homework\个人发展\自我画像\
├── index.html              # 骨架（仅结构，不改样式逻辑）
├── css/
│   └── style.css           # 全部样式
├── js/
│   ├── lib/
│   │   └── anime.umd.min.js  # 从备忘录项目复制
│   ├── app.js              # 入口：初始化 + 模块装配
│   ├── store.js            # IndexedDB 读写 + Pub/Sub
│   ├── render.js           # 虚拟滚动 + DOM 回收池 + 题目组件
│   ├── questions.js        # 400 题数据（JSON 数组）
│   ├── scoring.js          # 评分算法
│   ├── report.js           # 报告页面生成
│   └── ui.js               # 主题 / 进度 / 导航 / 弹窗
├── manifest.json           # PWA 配置
├── sw.js                   # Service Worker
└── README.md
```

---

### Task 1: 项目脚手架 — HTML 骨架 + CSS 变量体系

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `manifest.json`
- Create: `sw.js`
- Copy: `js/lib/anime.umd.min.js`

- [ ] **Step 1: 创建 index.html 骨架**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="theme-color" content="#08080c">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="manifest" href="manifest.json">
  <link rel="stylesheet" href="css/style.css">
  <title>自我画像</title>
</head>
<body>

  <!-- 顶部进度条 -->
  <header class="top-bar" id="topBar">
    <div class="top-bar-left">
      <span class="logo-text">🧬 自我画像</span>
    </div>
    <div class="top-bar-center">
      <div class="progress-wrap">
        <div class="progress-track">
          <div class="progress-fill" id="progressFill" style="width:0%"></div>
        </div>
        <div class="progress-text" id="progressText">0 / 400</div>
      </div>
    </div>
    <div class="top-bar-right">
      <span class="save-indicator" id="saveIndicator">已保存</span>
      <button class="icon-btn" id="themeToggle" aria-label="切换主题">◐</button>
    </div>
  </header>

  <!-- 瀑布流滚动区 -->
  <main class="waterfall" id="waterfall">
    <!-- 介绍区 -->
    <section class="intro-section" id="introSection">
      <div class="intro-card">
        <h1 class="intro-title">认识你自己</h1>
        <p class="intro-desc">400 道题，6 个维度，一份关于你的完整画像。</p>
        <p class="intro-hint">所有数据仅存储在本地浏览器中。</p>
        <button class="btn-start" id="btnStart">开始</button>
      </div>
    </section>

    <!-- 虚拟滚动视口 -->
    <div class="scroll-viewport" id="viewport">
      <div class="scroll-spacer" id="spacer"></div>
    </div>
  </main>

  <!-- 领域导航（桌面端侧边栏） -->
  <nav class="domain-nav" id="domainNav">
    <a href="#domain-identity" class="domain-link">身份</a>
    <a href="#domain-mind" class="domain-link">思维</a>
    <a href="#domain-emotion" class="domain-link">情感</a>
    <a href="#domain-ability" class="domain-link">能力</a>
    <a href="#domain-passion" class="domain-link">热情</a>
    <a href="#domain-history" class="domain-link">成长</a>
  </nav>

  <!-- 回到顶部 -->
  <button class="btn-back-top" id="btnBackTop" aria-label="回到顶部">↑</button>

  <!-- 报告页面（初始隐藏） -->
  <div class="report-page" id="reportPage" hidden>
    <div class="report-content" id="reportContent"></div>
  </div>

  <script src="js/lib/anime.umd.min.js"></script>
  <script src="js/store.js"></script>
  <script src="js/questions.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/render.js"></script>
  <script src="js/scoring.js"></script>
  <script src="js/report.js"></script>
  <script src="js/app.js"></script>

</body>
</html>
```

- [ ] **Step 2: 创建 CSS 变量体系 + 基础样式**

```css
/* === css/style.css === */

/* ===== CSS 变量 ===== */
:root {
  /* 底色体系（亮度层级） */
  --bg-base: #08080c;
  --bg-card: rgba(255, 255, 255, 0.03);
  --bg-hover: rgba(255, 255, 255, 0.06);
  --bg-overlay: rgba(255, 255, 255, 0.09);

  /* 强调色 */
  --accent: #c4a45a;
  --accent-glow: rgba(196, 164, 90, 0.2);
  --accent-dim: rgba(196, 164, 90, 0.08);

  /* 文字（透明度层级） */
  --text-primary: rgba(255, 255, 255, 0.87);
  --text-secondary: rgba(255, 255, 255, 0.50);
  --text-tertiary: rgba(255, 255, 255, 0.30);

  /* 边框 */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-focus: rgba(196, 164, 90, 0.3);

  /* 语义色 */
  --positive: #4ecdc4;
  --warning: #e8734a;
  --chart-purple: #7b68ee;

  /* 字号 */
  --fs-xs: 12px;
  --fs-sm: 14px;
  --fs-md: 16px;
  --fs-lg: 20px;
  --fs-xl: 28px;

  /* 间距 */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;

  /* 圆角 */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* 过渡 */
  --ease-out: 200ms ease-out;
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* 安全区 */
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}

/* ===== 全局重置 ===== */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: var(--fs-md);
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
               "Microsoft YaHei", "Source Han Sans SC", sans-serif;
  background-color: var(--bg-base);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
  min-height: 100dvh;
  /* 栅格点阵纹理 */
  background-image:
    radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 24px 24px;
  -webkit-font-smoothing: antialiased;
}

/* ===== 顶部栏 ===== */
.top-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  background: rgba(8, 8, 12, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-subtle);
  height: 48px;
}

.logo-text { font-size: var(--fs-sm); font-weight: 600; color: var(--text-primary); }

.progress-wrap { display: flex; align-items: center; gap: var(--space-sm); flex: 1; max-width: 320px; margin: 0 var(--space-md); }
.progress-track { flex: 1; height: 2px; background: rgba(255,255,255,0.08); border-radius: 1px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--accent); border-radius: 1px; transition: width 400ms var(--ease-out); }
.progress-text { font-size: var(--fs-xs); color: var(--text-tertiary); white-space: nowrap; min-width: 60px; text-align: right; }

.save-indicator { font-size: 10px; color: var(--positive); opacity: 0; transition: opacity 300ms var(--ease-out); }
.save-indicator.visible { opacity: 1; }

.icon-btn {
  background: none; border: none; color: var(--text-secondary);
  font-size: var(--fs-md); cursor: pointer; padding: var(--space-xs);
  border-radius: var(--radius-sm); width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--ease-out);
}
.icon-btn:hover { color: var(--text-primary); background: var(--bg-hover); }

/* ===== 瀑布流 ===== */
.waterfall {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 var(--space-md) 120px;
}

/* 介绍区 */
.intro-section {
  display: flex; align-items: center; justify-content: center;
  min-height: 60vh; min-height: 60dvh;
}
.intro-card { text-align: center; }
.intro-title {
  font-family: "Noto Serif CJK SC", "Source Han Serif SC", "Songti SC", serif;
  font-size: var(--fs-xl); color: var(--accent); margin-bottom: var(--space-md);
}
.intro-desc { font-size: var(--fs-md); color: var(--text-secondary); margin-bottom: var(--space-sm); }
.intro-hint { font-size: var(--fs-xs); color: var(--text-tertiary); margin-bottom: var(--space-lg); }

.btn-start {
  background: var(--accent); color: var(--bg-base); border: none;
  padding: 12px 40px; border-radius: var(--radius-lg); font-size: var(--fs-md);
  font-weight: 600; cursor: pointer;
  transition: all var(--ease-out);
}
.btn-start:hover { box-shadow: 0 0 24px var(--accent-glow); transform: scale(1.02); }

/* 领域分段标题 */
.domain-header {
  position: sticky; top: 48px; z-index: 50;
  padding: var(--space-lg) 0 var(--space-sm);
  margin: var(--space-xl) 0 var(--space-md);
  border-bottom: 1px solid var(--border-subtle);
}
.domain-header-title { font-size: var(--fs-lg); font-weight: 600; color: var(--text-primary); }
.domain-header-meta { font-size: var(--fs-xs); color: var(--text-tertiary); margin-top: var(--space-xs); }
.domain-header-progress {
  display: inline-block; padding: 2px 8px; border-radius: 10px;
  background: var(--accent-dim); color: var(--accent); font-size: 10px;
  margin-left: var(--space-sm);
}

/* 题目卡片 */
.q-card {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 4px 24px rgba(0, 0, 0, 0.3);
  transition: all var(--ease-out);
  position: relative;
}
.q-card.skipped { opacity: 0.45; }
.q-card.active {
  border-color: transparent;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 0 0 1px var(--accent-glow);
}
.q-card.active::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: linear-gradient(135deg, var(--accent), rgba(196,164,90,0.1));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

.q-header { display: flex; align-items: flex-start; gap: var(--space-sm); }
.q-number {
  font-size: var(--fs-xs); color: var(--accent); font-weight: 600;
  min-width: 36px; padding-top: 2px;
}
.q-meta { font-size: 10px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: var(--space-xs); }
.q-text { font-size: var(--fs-sm); color: var(--text-primary); margin-bottom: var(--space-md); line-height: 1.5; }
.q-actions { display: flex; justify-content: flex-end; gap: var(--space-sm); }
.q-skip-btn {
  background: none; border: none; color: var(--text-tertiary);
  font-size: var(--fs-xs); cursor: pointer; padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm); transition: all var(--ease-out);
}
.q-skip-btn:hover { color: var(--warning); }

/* Likert 量表 */
.likert-row { display: flex; align-items: center; justify-content: space-between; gap: var(--space-xs); }
.likert-label { font-size: 10px; color: var(--text-tertiary); white-space: nowrap; flex-shrink: 0; }
.likert-dots { display: flex; gap: 6px; flex: 1; justify-content: center; }
.likert-dot {
  width: 24px; height: 24px; border-radius: 50%;
  border: 1.5px solid var(--border-subtle);
  background: transparent; cursor: pointer;
  transition: all var(--ease-out);
  position: relative;
}
.likert-dot:hover { border-color: var(--accent); background: var(--accent-dim); }
.likert-dot.selected {
  border-color: var(--accent); background: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow);
  transform: scale(1.15);
}

/* 单选 */
.radio-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.radio-option {
  padding: 10px 14px; border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle); cursor: pointer;
  transition: all var(--ease-out); font-size: var(--fs-sm);
  color: var(--text-secondary);
}
.radio-option:hover { background: var(--bg-hover); color: var(--text-primary); }
.radio-option.selected {
  border-color: var(--accent); color: var(--accent);
  background: var(--accent-dim);
}

/* 多选 */
.check-option { display: flex; align-items: center; gap: 10px; padding: 10px 14px;
  border-radius: var(--radius-md); border: 1px solid var(--border-subtle);
  cursor: pointer; transition: all var(--ease-out); font-size: var(--fs-sm); color: var(--text-secondary);
}
.check-option:hover { background: var(--bg-hover); }
.check-option.checked { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
.check-box {
  width: 18px; height: 18px; border-radius: 4px; border: 1.5px solid var(--border-subtle);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: all var(--ease-out);
}
.check-option.checked .check-box { border-color: var(--accent); background: var(--accent); }
.check-option.checked .check-box::after {
  content: '✓'; color: var(--bg-base); font-size: 11px; font-weight: bold;
}

/* 文本输入 */
.text-input-short {
  width: 100%; background: none; border: none;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-primary); font-size: var(--fs-sm); font-family: inherit;
  padding: var(--space-sm) 0; outline: none;
  transition: border-color var(--ease-out), border-width var(--ease-out);
}
.text-input-short:focus { border-color: var(--accent); border-width: 2px; }
.text-input-short::placeholder { color: var(--text-tertiary); }

.text-input-long {
  width: 100%; min-height: 80px; background: rgba(255,255,255,0.02);
  border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
  color: var(--text-primary); font-size: var(--fs-sm); font-family: inherit;
  padding: var(--space-sm) var(--space-md); outline: none; resize: vertical;
  transition: border-color var(--ease-out);
}
.text-input-long:focus { border-color: var(--accent); }
.char-count { font-size: 10px; color: var(--text-tertiary); text-align: right; margin-top: 4px; }

/* 滑杆 */
.slider-wrap { padding: 0 var(--space-xs); }
.slider-track {
  position: relative; height: 4px; border-radius: 2px;
  background: linear-gradient(90deg, var(--positive), var(--accent), var(--warning));
  margin: var(--space-md) 0;
}
.slider-thumb {
  position: absolute; top: 50%; transform: translate(-50%, -50%);
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--accent); box-shadow: 0 0 8px var(--accent-glow);
  cursor: pointer; transition: left 100ms linear;
}
.slider-labels { display: flex; justify-content: space-between; font-size: 10px; color: var(--text-tertiary); }

/* 排序 */
.ranking-list { display: flex; flex-direction: column; gap: var(--space-xs); }
.ranking-item {
  display: flex; align-items: center; gap: var(--space-sm); padding: 8px 12px;
  border-radius: var(--radius-md); background: var(--bg-hover);
  font-size: var(--fs-sm); color: var(--text-secondary);
  cursor: grab; user-select: none;
  transition: background var(--ease-out);
}
.ranking-item:active { cursor: grabbing; }
.ranking-handle { color: var(--text-tertiary); font-size: 14px; cursor: grab; }
.ranking-num { color: var(--accent); font-weight: bold; min-width: 20px; }

/* 领域导航（桌面端） */
.domain-nav {
  position: fixed; left: max(16px, calc((100vw - 800px) / 2 - 140px));
  top: 50%; transform: translateY(-50%);
  display: none; flex-direction: column; gap: var(--space-xs);
  z-index: 90;
}
@media (min-width: 1024px) { .domain-nav { display: flex; } }
.domain-link {
  color: var(--text-tertiary); text-decoration: none; font-size: var(--fs-xs);
  padding: 6px 12px; border-radius: var(--radius-sm);
  transition: all var(--ease-out); white-space: nowrap;
}
.domain-link:hover { color: var(--text-primary); background: var(--bg-hover); }
.domain-link.completed { color: var(--positive); }

/* 回到顶部 */
.btn-back-top {
  position: fixed; right: var(--space-md); bottom: calc(var(--space-md) + var(--safe-bottom));
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  color: var(--text-secondary); font-size: 18px; cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.3);
  opacity: 0; pointer-events: none; transition: opacity var(--ease-out);
  z-index: 80; display: flex; align-items: center; justify-content: center;
}
.btn-back-top.visible { opacity: 1; pointer-events: auto; }

/* 报告页 */
.report-page {
  position: fixed; inset: 0; z-index: 200;
  background: var(--bg-base); overflow-y: auto; padding-top: 48px;
}
.report-content { max-width: 680px; margin: 0 auto; padding: var(--space-lg) var(--space-md); }

/* 响应式 */
@media (max-width: 640px) {
  .waterfall { padding: 0 var(--space-md) 80px; }
  .top-bar { padding: var(--space-sm) var(--space-sm); }
  .logo-text { font-size: var(--fs-xs); }
}
```

- [ ] **Step 3: 创建 manifest.json**

```json
{
  "name": "自我画像",
  "short_name": "自我画像",
  "description": "一份全面的自我认知问卷，生成结构化个人画像报告",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#08080c",
  "theme_color": "#08080c",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 4: 创建 sw.js（网络优先 + 离线回退）**

```javascript
const CACHE = 'self-portrait-v1';
const ASSETS = [
  '/', '/index.html', '/css/style.css',
  '/js/app.js', '/js/store.js', '/js/questions.js',
  '/js/render.js', '/js/scoring.js', '/js/report.js', '/js/ui.js',
  '/js/lib/anime.umd.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});
```

- [ ] **Step 5: 从备忘录项目复制 anime.js**

```bash
cp "e:\homework\开发\Claudecode\极简工作任务备忘录\js\lib\anime.umd.min.js" "E:\homework\个人发展\自我画像\js\lib\anime.umd.min.js"
```

- [ ] **Step 6: 创建 .gitignore**

```
.superpowers/
```

- [ ] **Step 7: 提交**

```bash
cd "E:\homework\个人发展\自我画像"
git init
git add -A
git commit -m "feat: 项目脚手架 — HTML 骨架 + CSS 变量 + PWA 基础"
```

---

### Task 2: 数据存储模块 — store.js

**Files:**
- Create: `js/store.js`

- [ ] **Step 1: 创建 store.js — IndexedDB 封装 + Pub/Sub + 自动保存**

```javascript
/* === js/store.js === */
const DB_NAME = 'selfPortraitDB';
const DB_VERSION = 1;

let db = null;
const listeners = new Set();

/* ===== IndexedDB 初始化 ===== */
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('answers')) {
        db.createObjectStore('answers', { keyPath: 'questionId' });
      }
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta', { keyPath: 'key' });
      }
    };
    req.onsuccess = (e) => { db = e.target.result; resolve(db); };
    req.onerror = () => reject(req.error);
  });
}

/* ===== 答案读写 ===== */
function saveAnswer(questionId, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('answers', 'readwrite');
    tx.objectStore('answers').put({
      questionId,
      value,
      savedAt: Date.now()
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function getAnswer(questionId) {
  return new Promise((resolve) => {
    const tx = db.transaction('answers', 'readonly');
    const req = tx.objectStore('answers').get(questionId);
    req.onsuccess = () => resolve(req.result || null);
  });
}

function getAllAnswers() {
  return new Promise((resolve) => {
    const tx = db.transaction('answers', 'readonly');
    const req = tx.objectStore('answers').getAll();
    req.onsuccess = () => {
      const map = {};
      req.result.forEach(r => { map[r.questionId] = r.value; });
      resolve(map);
    };
  });
}

/* ===== 元数据读写 ===== */
function getMeta(key) {
  return new Promise((resolve) => {
    const tx = db.transaction('meta', 'readonly');
    const req = tx.objectStore('meta').get(key);
    req.onsuccess = () => resolve(req.result ? req.result.value : null);
  });
}

function setMeta(key, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('meta', 'readwrite');
    tx.objectStore('meta').put({ key, value });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/* ===== Pub/Sub ===== */
function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function publish(event, payload) {
  listeners.forEach(fn => {
    try { fn(event, payload); } catch (e) { console.error('Store listener error:', e); }
  });
}

/* ===== 自动保存（防抖） ===== */
let saveTimer = null;
let pendingSaves = 0;

function scheduleSave(questionId, value) {
  pendingSaves++;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await saveAnswer(questionId, value);
      pendingSaves--;
      publish('saved', { count: pendingSaves });
    } catch (e) {
      console.error('Auto-save failed:', e);
      publish('save-error', { error: e });
    }
  }, 800);
}

/* ===== 立即保存（页面隐藏时） ===== */
function flushPendingSaves() {
  clearTimeout(saveTimer);
  return Promise.resolve();
}

/* ===== 草稿恢复 ===== */
async function restoreDraft() {
  const answers = await getAllAnswers();
  const startedAt = await getMeta('startedAt');
  const lastSavedAt = await getMeta('lastSavedAt');
  return {
    answers,
    startedAt: startedAt || null,
    lastSavedAt: lastSavedAt || null,
    totalAnswered: Object.keys(answers).length
  };
}

/* ===== 清除所有数据 ===== */
function clearAllData() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['answers', 'meta'], 'readwrite');
    tx.objectStore('answers').clear();
    tx.objectStore('meta').clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/* ===== 导出/导入 JSON ===== */
function exportJSON() {
  return Promise.all([getAllAnswers(), getMeta('startedAt')]).then(([answers, startedAt]) => ({
    answers, startedAt, exportedAt: Date.now(), version: 1
  }));
}

async function importJSON(data) {
  if (!data.answers || !data.version) throw new Error('Invalid import data');
  for (const [qid, value] of Object.entries(data.answers)) {
    await saveAnswer(qid, value);
  }
  if (data.startedAt) await setMeta('startedAt', data.startedAt);
}
```

- [ ] **Step 2: 提交**

```bash
cd "E:\homework\个人发展\自我画像"
git add js/store.js
git commit -m "feat: IndexedDB 存储模块 + Pub/Sub + 自动保存"
```

---

### Task 3: UI 工具模块 — ui.js

**Files:**
- Create: `js/ui.js`

- [ ] **Step 1: 创建 ui.js**

```javascript
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

/* ===== 主题切换 ===== */
const themeToggle = document.getElementById('themeToggle');
function setupTheme() {
  const saved = localStorage.getItem('sp-theme') || 'dark';
  themeToggle.addEventListener('click', () => {
    const next = saved === 'dark' ? 'light' : 'dark';
    localStorage.setItem('sp-theme', next);
    location.reload();
  });
}
```

- [ ] **Step 2: 提交**

```bash
cd "E:\homework\个人发展\自我画像"
git add js/ui.js
git commit -m "feat: UI 工具模块 — 进度条 + 导航 + 弹窗 + 主题"
```

---

### Task 4: 题目数据文件 — questions.js（结构 + 框架 + 第一个领域）

**Files:**
- Create: `js/questions.js`

- [ ] **Step 1: 创建 questions.js — 定义数据结构、框架映射和"身份根基"领域（60 题）**

```javascript
/* === js/questions.js === */

/**
 * 单题数据结构
 * @typedef {Object} Question
 * @property {string} id          - 唯一标识：{domain}-{index}
 * @property {string} domain      - 六大领域之一
 * @property {string} layer       - factual | perceptual | narrative
 * @property {string} [framework] - 关联的心理学框架
 * @property {string} [dimension] - 框架内的维度
 * @property {string} type        - likert5|likert7|radio|checkbox|ranking|shorttext|longtext|slider
 * @property {string} text        - 题面
 * @property {Array} [options]    - 选项列表（量表/选择/排序题）
 * @property {boolean} [required] - 是否必答，默认 false
 * @property {number} [maxLength] - 简答题字数上限
 */

/* ===== 领域配置 ===== */
const DOMAINS = [
  { id: 'identity', name: '身份根基', emoji: '🪪', questions: 60 },
  { id: 'mind',     name: '思维心智', emoji: '🧠', questions: 65 },
  { id: 'emotion',  name: '情感关系', emoji: '💙', questions: 62 },
  { id: 'ability',  name: '能力行动', emoji: '🔧', questions: 70 },
  { id: 'passion',  name: '热情驱动', emoji: '🔥', questions: 63 },
  { id: 'history',  name: '成长叙事', emoji: '📖', questions: 80 }
];

/* ===== 全部题目（400 题，按领域分组） ===== */
const QUESTIONS = [

  /* ========================================================
     一、身份根基 (60 题)
     框架引用：TSCS, Schwartz PVQ, HEXACO H因子
     ======================================================== */

  // --- 事实层 12 题 ---
  { id:'identity-001', domain:'identity', layer:'factual', type:'radio',
    text:'你的性别是？', options:[
      {value:'male',label:'男'},{value:'female',label:'女'},{value:'other',label:'其他'},{value:'prefer-not',label:'不愿透露'}], required:true },
  { id:'identity-002', domain:'identity', layer:'factual', type:'radio',
    text:'你目前所处的年龄段是？', options:[
      {value:'under18',label:'18 岁以下'},{value:'18-22',label:'18-22 岁'},{value:'23-30',label:'23-30 岁'},{value:'30plus',label:'30 岁以上'}], required:true },
  { id:'identity-003', domain:'identity', layer:'factual', type:'radio',
    text:'你的成长环境主要属于？', options:[
      {value:'urban',label:'城市'},{value:'town',label:'城镇'},{value:'rural',label:'农村'},{value:'mixed',label:'多次迁徙'}], required:false },
  { id:'identity-004', domain:'identity', layer:'factual', type:'radio',
    text:'你的家庭结构是？', options:[
      {value:'nuclear',label:'核心家庭（父母+子女）'},{value:'extended',label:'大家庭（祖辈同住）'},{value:'single-parent',label:'单亲家庭'},{value:'other',label:'其他'}], required:false },
  { id:'identity-005', domain:'identity', layer:'factual', type:'checkbox',
    text:'你认为以下哪些身份标签最能描述你？（可多选）', options:[
      {value:'student',label:'学生'},{value:'developer',label:'开发者'},{value:'leader',label:'团队负责人'},{value:'mentor',label:'学长/导师'},{value:'creator',label:'创造者'},{value:'learner',label:'终身学习者'},{value:'friend',label:'朋友'},{value:'child',label:'子女'}], required:false },
  { id:'identity-006', domain:'identity', layer:'factual', type:'radio',
    text:'你是否有宗教信仰？', options:[
      {value:'none',label:'无'},{value:'buddhism',label:'佛教'},{value:'christianity',label:'基督教'},{value:'islam',label:'伊斯兰教'},{value:'other',label:'其他'},{value:'spiritual',label:'有灵性信仰但不属特定宗教'}], required:false },
  { id:'identity-007', domain:'identity', layer:'factual', type:'radio',
    text:'你的政治立场倾向于？', options:[
      {value:'left',label:'偏左（强调平等、社会正义）'},{value:'center',label:'中间'},{value:'right',label:'偏右（强调自由、传统）'},{value:'apolitical',label:'不太关心政治'},{value:'uncertain',label:'不确定'}], required:false },
  { id:'identity-008', domain:'identity', layer:'factual', type:'checkbox',
    text:'以下哪些经历你曾有过？（可多选）', options:[
      {value:'lived-alone',label:'独自居住'},{value:'traveled-alone',label:'独自旅行'},{value:'studied-abroad',label:'异地求学'},{value:'job',label:'实习/兼职'},{value:'volunteer',label:'志愿服务'},{value:'competition',label:'大型比赛'}], required:false },
  { id:'identity-009', domain:'identity', layer:'factual', type:'radio',
    text:'你对自己身体的满意程度？', options:[
      {value:1,label:'非常不满意'},{value:2,label:'不太满意'},{value:3,label:'一般'},{value:4,label:'比较满意'},{value:5,label:'非常满意'}], required:false, framework:'tscs', dimension:'physical' },
  { id:'identity-010', domain:'identity', layer:'factual', type:'radio',
    text:'你每天花多少时间独处？', options:[
      {value:'lt1h',label:'少于 1 小时'},{value:'1-3h',label:'1-3 小时'},{value:'3-6h',label:'3-6 小时'},{value:'gt6h',label:'6 小时以上'}], required:false },
  { id:'identity-011', domain:'identity', layer:'factual', type:'radio',
    text:'你觉得自己的道德标准主要来源于？', options:[
      {value:'family',label:'家庭教育'},{value:'education',label:'学校教育'},{value:'experience',label:'个人经历'},{value:'reflection',label:'自己的反思'},{value:'religion',label:'宗教信仰'},{value:'society',label:'社会规范'}], required:false, framework:'tscs', dimension:'moral' },
  { id:'identity-012', domain:'identity', layer:'factual', type:'ranking',
    text:'请按"构成你身份认同的重要性"排列以下方面', options:[
      {value:'family',label:'家庭角色'},{value:'career',label:'学业/职业'},{value:'values',label:'个人价值观'},{value:'community',label:'社群归属'},{value:'hobbies',label:'兴趣爱好'}], required:false },

  // --- 感知层 28 题 ---
  { id:'identity-013', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我清楚知道自己是一个什么样的人', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'identity' },
  { id:'identity-014', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我对自己目前的样子感到满意', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'satisfaction' },
  { id:'identity-015', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我经常思考"人生的意义是什么"这类问题', options:[{value:1,label:'从不'},{value:5,label:'经常'}], required:false, framework:'bigfive', dimension:'openness' },
  { id:'identity-016', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我有一套清晰的价值体系来指导决策', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'schwartz' },
  { id:'identity-017', domain:'identity', layer:'perceptual', type:'likert7',
    text:'诚实对我来说有多重要？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'hexaco', dimension:'honesty' },
  { id:'identity-018', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我有时会为了取悦他人而违背自己的原则', options:[{value:1,label:'从不'},{value:5,label:'经常'}], required:false, framework:'hexaco', dimension:'honesty' },
  { id:'identity-019', domain:'identity', layer:'perceptual', type:'likert5',
    text:'面对道德困境时，我倾向于坚持原则而非灵活处理', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'moral' },
  { id:'identity-020', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"公平"在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'universalism' },
  { id:'identity-021', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"自由"在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'self-direction' },
  { id:'identity-022', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"传统"在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'tradition' },
  { id:'identity-023', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"成就"在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'achievement' },
  { id:'identity-024', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"安全"在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'security' },
  { id:'identity-025', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"仁爱"（关心他人福祉）在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'benevolence' },
  { id:'identity-026', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"权力"（影响和控制）在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'power' },
  { id:'identity-027', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"刺激"（冒险和兴奋）在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'stimulation' },
  { id:'identity-028', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我认为自己是真诚的，不伪装', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'hexaco', dimension:'honesty' },
  { id:'identity-029', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我经常自我怀疑，不确定自己做得对不对', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'bigfive', dimension:'neuroticism' },
  { id:'identity-030', domain:'identity', layer:'perceptual', type:'likert5',
    text:'比起社会认可，我更看重自己内心的标准', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'ikigai' },
  { id:'identity-031', domain:'identity', layer:'perceptual', type:'slider',
    text:'你对自己"是一个好人"的信念程度', options:[{value:0,label:'我经常怀疑'},{value:50,label:''},{value:100,label:'我深信不疑'}], required:false, framework:'tscs', dimension:'moral' },
  { id:'identity-032', domain:'identity', layer:'perceptual', type:'slider',
    text:'你的"理想自我"与"现实自我"的吻合度', options:[{value:0,label:'完全割裂'},{value:50,label:''},{value:100,label:'完全吻合'}], required:false, framework:'tscs' },
  { id:'identity-033', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我清楚自己的弱点，并愿意承认它们', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'self-criticism' },
  { id:'identity-034', domain:'identity', layer:'perceptual', type:'likert5',
    text:'社会热点事件会让我反复思考自己的立场', options:[{value:1,label:'从不'},{value:5,label:'经常'}], required:false },
  { id:'identity-035', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我认为人的命运主要由自己掌控', options:[{value:1,label:'完全不同意'},{value:5,label:'完全同意'}], required:false, framework:'bigfive', dimension:'openness' },
  { id:'identity-036', domain:'identity', layer:'perceptual', type:'likert5',
    text:'在面对人生的重大选择时，我清楚什么对自己最重要', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'identity' },
  { id:'identity-037', domain:'identity', layer:'perceptual', type:'radio',
    text:'以下哪种描述最接近你的自我认知？', options:[
      {value:'stable',label:'我核心的样子一直没怎么变'},{value:'evolving',label:'我一直在进化，不同阶段有不同的我'},{value:'multi',label:'我在不同环境中展现不同的自己'},{value:'searching',label:'我还在探索自己到底是谁'}], required:false },
  { id:'identity-038', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我相信"人性本善"', options:[{value:1,label:'完全不同意'},{value:5,label:'完全同意'}], required:false, framework:'bigfive', dimension:'agreeableness' },
  { id:'identity-039', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我觉得自己是一个有魅力的人（不只外表）', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'physical' },
  { id:'identity-040', domain:'identity', layer:'perceptual', type:'likert5',
    text:'别人眼中的我和我眼中的自己，应该很不一样', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'social' },

  // --- 叙事层 20 题 ---
  { id:'identity-041', domain:'identity', layer:'narrative', type:'shorttext',
    text:'用一段话描述"你是谁"——抛开名字和身份标签', maxLength:300, required:false },
  { id:'identity-042', domain:'identity', layer:'narrative', type:'longtext',
    text:'你人生中最重要的三个价值观是什么？各举一个具体例子说明它们是如何形成的', required:false },
  { id:'identity-043', domain:'identity', layer:'narrative', type:'longtext',
    text:'描述一次你必须在"做正确的事"和"做容易的事"之间做出选择的经历。你选择了什么？后来回头看，你对自己的选择满意吗？', required:false },
  { id:'identity-044', domain:'identity', layer:'narrative', type:'shorttext',
    text:'如果请你用 5 个关键词定义自己的核心身份，它们会是？', maxLength:150, required:false },
  { id:'identity-045', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你理想中的自己是什么样子？', maxLength:300, required:false },
  { id:'identity-046', domain:'identity', layer:'narrative', type:'longtext',
    text:'有没有一件事/一个人/一本书从根本上改变了你对自己或世界的看法？请详细描述', required:false },
  { id:'identity-047', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你最大的自我矛盾是什么？（例如：渴望自由又害怕不确定性）', maxLength:200, required:false },
  { id:'identity-048', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你觉得别人最容易误解你的地方是什么？', maxLength:200, required:false },
  { id:'identity-049', domain:'identity', layer:'narrative', type:'longtext',
    text:'你对"社会责任感"的理解是什么？你认为自己在这方面做得怎样？', required:false },
  { id:'identity-050', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你最不能容忍自己身上哪些特质？为什么？', maxLength:200, required:false },
  { id:'identity-051', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你觉得自己的"灵魂年龄"是几岁？为什么？', maxLength:200, required:false },
  { id:'identity-052', domain:'identity', layer:'narrative', type:'shorttext',
    text:'如果可以重新选择，你会改变自己身上的哪一点？', maxLength:200, required:false },
  { id:'identity-053', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你最引以为傲的个人品质是什么？', maxLength:150, required:false },
  { id:'identity-054', domain:'identity', layer:'narrative', type:'longtext',
    text:'你对"死亡"这件事的看法是什么？这种看法如何影响了你现在的生活方式？', required:false },
  { id:'identity-055', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你认为自己的存在给身边的人带来了什么？', maxLength:200, required:false },
  { id:'identity-056', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你有没有一直想做但不敢做的事？是什么阻止了你？', maxLength:300, required:false },
  { id:'identity-057', domain:'identity', layer:'narrative', type:'longtext',
    text:'你如何看待"道德相对主义"——即认为道德标准因文化/情境而异？你认同吗？请举例说明你的立场', required:false },
  { id:'identity-058', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你最想被后人记住的一点是什么？', maxLength:200, required:false },
  { id:'identity-059', domain:'identity', layer:'narrative', type:'shorttext',
    text:'如果写一本关于你自己的书，书名会是什么？', maxLength:100, required:false },
  { id:'identity-060', domain:'identity', layer:'narrative', type:'shorttext',
    text:'现在，重新回答第 41 题——经过这几十道题之后，你对"你是谁"的定义有变化吗？', maxLength:300, required:false },

  /* ========================================================
     后续 5 个领域（共 340 题）在后续任务中补齐
     二、思维心智 (65 题) — 框架引用：Big Five, MBTI, 16PF, Enneagram
     三、情感关系 (62 题) — 框架引用：Goleman EQ, TSCS, Big Five Agreeableness
     四、能力行动 (70 题) — 框架引用：CliftonStrengths 34, TSCS, 16PF
     五、热情驱动 (63 题) — 框架引用：Ikigai, Schwartz, Enneagram
     六、成长叙事 (80 题) — 框架引用：叙事心理学, Ikigai
     ======================================================== */
];
```

- [ ] **Step 2: 提交**

```bash
cd "E:\homework\个人发展\自我画像"
git add js/questions.js
git commit -m "feat: 题目数据 — 数据结构定义 + 身份根基 60 题"
```

---

### Task 5: 渲染引擎 — render.js（7 种题目组件 + 虚拟滚动）

**Files:**
- Create: `js/render.js`

- [ ] **Step 1: 创建 render.js 虚拟滚动引擎**

```javascript
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
```

- [ ] **Step 2: 提交**

```bash
cd "E:\homework\个人发展\自我画像"
git add js/render.js
git commit -m "feat: 渲染引擎 — 7 种题目组件 + 虚拟滚动"
```

---

### Task 6: 事件处理 + 应用入口 — app.js

**Files:**
- Create: `js/app.js`

- [ ] **Step 1: 创建 app.js — 初始化流程 + 全局事件代理**

```javascript
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
  renderVisible(); // 刷新视口内题目状态
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
```

- [ ] **Step 2: 提交**

```bash
cd "E:\homework\个人发展\自我画像"
git add js/app.js
git commit -m "feat: 应用入口 — 初始化 + 事件代理 + 答题逻辑"
```

---

> **说明：** Task 7-15 为后续阶段任务（补全 400 题数据、评分引擎、报告生成、质感打磨、测试部署），将在 P1-P3 基础稳定后逐步实施。此处先列出框架，具体代码步骤在实施时展开。

### Task 7: 补全题目数据 — 领域二~六（340 题）

### Task 8: 评分引擎 — scoring.js

### Task 9: 报告页面 — report.js（图表 + 布局 + 文字聚合）

### Task 10: 领域分段标题渲染 — render.js 补充

### Task 11: 质感效果补充 — CSS

### Task 12: 移动端测试 + GitHub 仓库创建 + 部署

---

> 计划基于设计文档 `docs/superpowers/specs/2026-07-31-self-portrait-design.md`，配套方法论文档在 `docs/methodology/`。
