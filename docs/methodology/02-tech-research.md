# 技术方案调研笔记

> 2026-07-31 网络调研，为"自我画像"PWA 项目提供技术决策依据。

---

## 核心发现

### 1. 渲染方案：虚拟滚动是必选项

400 道题目以瀑布流形式渲染，如果全部塞进 DOM = 灾难。

**推荐方案：DOM 回收池（Node Pool）+ `requestAnimationFrame` 节流**

- 保持 DOM 节点数恒定（约 30 个可见 + 预渲染）
- 滚动时只更新节点内容和位置，不销毁/创建
- 使用 `transform: translateY()` 而非 `top` 定位（GPU 合成器线程，不触发布局重排）
- 用 `requestAnimationFrame` 合并同一帧内的多次滚动事件

**备选方案：CSS `content-visibility: auto`**
- 更简单，一行 CSS
- 浏览器自动跳过屏幕外元素布局
- 兼容性：Chrome 85+, Firefox 125+, Safari 18+
- 作为降级方案的补充手段

### 2. 存储方案：IndexedDB 优于 localStorage

localStorage 是**同步 API**，写入时会阻塞 UI。400 题频繁自动保存 → 卡顿。

| | localStorage | IndexedDB |
|---|---|---|
| 容量 | 5-10MB | 近乎无限 |
| API 类型 | 同步（阻塞 UI） | 异步（不阻塞） |
| 数据类型 | 仅字符串 | 结构化对象 |
| Service Worker 访问 | ❌ | ✅ |
| 查询能力 | 无 | 索引查询 |

**结论：** 使用 IndexedDB 存储完整答案数据，localStorage 仅存轻量元数据（当前进度、主题偏好等）。封装一个简单的异步 Store 层。

### 3. 状态管理：发布订阅 + 状态机

不需要引入 Vue/React。核心模式：

```
用户输入 → Action → Store 更新 → 发布事件 → UI 重新渲染
```

- **集中式 Store**：一个 JS 对象持有所有答案（按 questionId 索引）
- **Pub/Sub**：Store 变化时通知订阅者（进度条、自动保存、报告预览）
- **状态机**：管理问卷的 meta 状态（`ANSWERING → REVIEWING → COMPLETE`），消除混乱的布尔标志组合

参考极小库：Beedle（<5KB）或直接手写（约 50 行）。

### 4. 自动保存策略

- 每次回答变化后 **800ms 防抖**保存到 IndexedDB
- 页面失焦/后台时**立即保存**（`visibilitychange` 事件）
- 草稿 7 天过期自动清理
- 状态指示器："已保存 · 2 秒前" → 用户信任感提升 67%

### 5. 框架选择：纯原生 JS 完全可行

State of JS 2024 数据显示 Alpine.js 是轻量框架首选，但 400 题问卷本质是"超长表单"——原生 JS 配合上面三个模式（虚拟滚动 + Pub/Sub Store + 状态机）完全够用，不需要引入框架。

**不选 Alpine/Vue 的原因：**
- 增加加载体积（Alpine ~15KB, Vue ~40KB gzip）
- 虚拟滚动在框架内反而更难实现（需要直接操作 DOM）
- 用户已有原生 JS 维护经验

---

## 推荐技术栈

| 层 | 选型 | 说明 |
|----|------|------|
| 渲染 | DOM 回收池 + `requestAnimationFrame` | 虚拟滚动，保持 ~30 个 DOM 节点 |
| 存储 | IndexedDB（答案）+ localStorage（配置） | 异步不阻塞，容量充裕 |
| 状态 | 手写 Pub/Sub Store（~50 行） | 集中式状态 + 事件通知 |
| 流程 | 状态机 | 管理作答/审阅/完成三种状态 |
| 动画 | anime.js | 和备忘录项目一致 |
| 部署 | GitHub Pages + PWA | manifest.json + SW |
| 构建 | 零构建工具 | 纯 HTML/CSS/JS，直接部署 |

---

## 关键文件结构

```
自我画像/
├── index.html
├── css/style.css
├── js/
│   ├── lib/anime.umd.min.js
│   ├── app.js          ← 入口：初始化 Store + 渲染
│   ├── questions.js    ← 400 题数据（纯 JSON 数组）
│   ├── store.js        ← IndexedDB 读写 + Pub/Sub
│   ├── render.js       ← 虚拟滚动 + DOM 回收池
│   ├── scoring.js      ← 评分算法（Big Five 等框架量化）
│   ├── report.js       ← 报告生成（图表 + 文字）
│   └── ui.js           ← 主题切换 / 进度条 / 弹窗 / 状态指示器
├── manifest.json
├── sw.js
└── docs/
    └── methodology/
        └── 01-personality-frameworks.md
```

---

> 以上为技术调研笔记，将整合入最终设计文档。
