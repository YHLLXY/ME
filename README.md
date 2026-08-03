# 自我画像 Self-Portrait

一份全面的自我认知测评 PWA 问卷：**400 题 · 6 大领域 · 3 个层次 · 8 种题型 · 11 个心理学框架评分**。全部数据仅存储在本地浏览器（IndexedDB），生成结构化个人画像报告。

在线地址：<https://YHLLXY.github.io/ME/>

## 功能

- **400 道题**，覆盖 6 大领域（身份根基 / 思维 / 情感 / 能力 / 热情 / 成长）× 3 个层次（事实 / 感知 / 叙事）
- **8 种题型**：likert5 / likert7 / radio / checkbox / ranking / slider / shorttext / longtext
- **11 个心理学框架评分**：大五人格、MBTI、九型人格、HEXACO、卡特尔 16PF、盖洛普优势、Goleman 情商、Schwartz 价值观、Ikigai、TSCS、叙事心理学
- **虚拟滚动**：节点池复用 + 二分查找定位 + ResizeObserver 动态高度校准，400 题流畅滚动
- **离线可用**：Service Worker 缓存全部静态资源（network-first）
- **隐私优先**：答案只存本机 IndexedDB，不发送任何网络请求

## 架构

```
index.html          入口（无构建步骤，纯静态）
js/questions.js     题库与领域定义（400 题，QUESTIONS/DOMAINS 常量）
js/store.js         IndexedDB 封装 + 防抖批量保存队列（Map 去重、失败重排）
js/scoring.js       评分引擎（纯函数，11 框架，无 DOM 依赖）
js/render.js        虚拟滚动节点池 + 题型渲染
js/app.js           事件代理 / 答案处理 / 跳过逻辑
js/report.js        报告生成与渲染
js/ui.js            进度条 / toast / 回到顶部 / 领域导航
sw.js               Service Worker（v3 缓存桶）
css/style.css       深色主题
```

## 本地运行

无需安装依赖，任意静态服务器即可（IndexedDB 与 Service Worker 需 http/https 协议，直接 `file://` 打开不可用）：

```bash
# Windows
py -m http.server 8080

# macOS / Linux
python3 -m http.server 8080
```

然后访问 <http://localhost:8080>。手机同局域网实测：用电脑 IP + 端口访问（如 `http://192.168.x.x:8080`）。

## 部署（GitHub Pages）

仓库：`git@github.com:YHLLXY/ME.git`（分支 `master`，根目录部署）

```bash
git push origin master
```

Settings → Pages → Source: Deploy from a branch → branch `master` / root，保存后即生效。

**注意：** 页面 URL 是 <https://YHLLXY.github.io/ME/>（项目页带 `/ME/` 子路径）。Service Worker 已用相对路径注册与作用域（`register('sw.js', {scope:'./'})`），子路径部署不会 404。

## 隐私声明

- 答案仅保存在**本机浏览器 IndexedDB**，不经过任何服务器，不上传任何数据
- 报告在本机生成，导出/分享由用户自主决定
- 清除浏览器站点数据即彻底删除全部作答记录

## 开发约定（重要）

本仓库与 Obsidian 知识库笔记**同目录共存**（`30-项目/自我画像/`）：

- 代码仓库独立 git，远端 `YHLLXY/ME`（分支 `master`）
- 同目录的 `*.md` 为知识库笔记（门户口、经验教训），**不属于本仓库**（已由 `.gitignore` 显式排除）
- 操作本仓库时**禁止 `git add -A` / `git add .`**，只显式添加代码文件
