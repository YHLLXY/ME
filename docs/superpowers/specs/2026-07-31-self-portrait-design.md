# 自我画像 · Self-Portrait — 设计文档

> 2026-07-31 | 版本 v1.0  
> 项目路径：`E:\homework\个人发展\自我画像`  
> GitHub 仓库：待创建

---

## 一、项目概述

### 1.1 是什么

一份 **400 道多维度自我认知问卷**，以 PWA 形式呈现。用户答完后自动生成结构化的"自我画像"报告——包含人格分析、价值观图谱、能力评估和成长叙事。

### 1.2 为什么做

- **个人用途**：通过系统化的问卷深度解析自己
- **传承用途**：向学弟学妹/后辈传递个人经验和理念（分享空白问卷让他们自己填）
- **开源**：问卷框架和代码开源在 GitHub，任何人都可以用来认识自己

### 1.3 核心原则

- 纯本地、零服务器、零数据上传
- 移动端优先、PWA、离线可用
- 模块化原生 JS，零构建工具
- GitHub Pages 部署

---

## 二、问卷设计

### 2.1 六大人格领域（400 题）

| # | 领域 | 核心问题 | 事实层 | 感知层 | 叙事层 | 合计 |
|:--:|------|------|:--:|:--:|:--:|:--:|
| 一 | 🪪 身份根基 | 我是谁？价值观和信仰 | 12 | 28 | 20 | **60** |
| 二 | 🧠 思维心智 | 我怎么思考？性格和认知 | 18 | 32 | 15 | **65** |
| 三 | 💙 情感关系 | 我怎么感受和连接他人？ | 12 | 30 | 20 | **62** |
| 四 | 🔧 能力行动 | 我能做什么？执行力与技能 | 25 | 32 | 13 | **70** |
| 五 | 🔥 热情驱动 | 什么驱动我？兴趣与愿景 | 13 | 30 | 20 | **63** |
| 六 | 📖 成长叙事 | 我的故事？经历与传承 | 20 | 15 | 45 | **80** |
| | | **总计** | **100** | **167** | **133** | **400** |

### 2.2 三个答题层次

| 层次 | 类型 | 题目形式 | 示例 |
|------|------|---------|------|
| 事实层 | 客观信息 | 单选/多选/填空 | "你大学期间尝试过几个方向？" |
| 感知层 | 主观评价 | Likert 量表/排序/滑杆 | "你觉得自己的执行力在哪个水平？" |
| 叙事层 | 故事意义 | 简答/长文本 | "讲一件让你价值观发生改变的事。" |

### 2.3 七种题目类型

| 类型 | 缩写 | 适用层次 |
|------|------|---------|
| Likert 5 级量表 | `likert5` | 感知层 |
| Likert 7 级量表 | `likert7` | 感知层 |
| 单选题 | `radio` | 事实层/感知层 |
| 多选题 | `checkbox` | 事实层 |
| 排序/权重分配 | `ranking` | 感知层 |
| 短文本（≤300字） | `shorttext` | 叙事层 |
| 长文本（不限） | `longtext` | 叙事层 |
| 滑杆（0-100） | `slider` | 感知层 |

### 2.4 引用的心理学框架

详见 [`docs/methodology/01-personality-frameworks.md`](../methodology/01-personality-frameworks.md)，包含：
Big Five (OCEAN)、MBTI、Enneagram、HEXACO、16PF、CliftonStrengths 34 天赋、Goleman 情商模型、Schwartz 19 价值观、Ikigai 框架、田纳西自我概念量表 (TSCS)、中国人本土大七人格。

---

## 三、技术架构

### 3.1 技术栈

| 层 | 选型 |
|----|------|
| 语言 | HTML + CSS + Vanilla JS (ES6+) |
| 渲染 | 虚拟滚动 + DOM 回收池 |
| 存储 | IndexedDB（答案） + localStorage（配置） |
| 状态 | 手写 Pub/Sub Store |
| 流程 | 状态机管理 |
| 动画 | anime.js v4.5 |
| 部署 | GitHub Pages |
| 构建 | 零构建工具 |

详见 [`docs/methodology/02-tech-research.md`](../methodology/02-tech-research.md)。

### 3.2 文件结构

```
自我画像/
├── index.html              # 入口骨架
├── css/
│   └── style.css           # 全部样式（CSS 变量 + 组件 + 动画）
├── js/
│   ├── lib/
│   │   └── anime.umd.min.js
│   ├── app.js              # 入口：初始化 + 模块装配 + PWA 注册
│   ├── questions.js        # 400 题数据（纯 JSON 数组）
│   ├── store.js            # IndexedDB 读写 + Pub/Sub + 自动保存
│   ├── render.js           # 虚拟滚动引擎 + DOM 回收池
│   ├── scoring.js          # 11 框架量表评分算法
│   ├── report.js           # 报告生成 + 图表渲染 + PDF 导出
│   └── ui.js               # 主题 / 进度 / 导航 / 弹窗 / 状态指示器
├── manifest.json           # PWA 清单
├── sw.js                   # Service Worker（离线缓存）
├── README.md
└── docs/
    ├── methodology/
    │   ├── 01-personality-frameworks.md   # 心理学框架参考
    │   ├── 02-tech-research.md            # 技术调研笔记
    │   └── 03-ui-design-reference.md      # UI/UX 设计参考
    └── superpowers/
        └── specs/
            └── 2026-07-31-self-portrait-design.md  # 本设计文档
```

### 3.3 数据流

```
questions.js → render.js（虚拟滚动渲染）
                    ↓
              用户填写答案
                    ↓
              store.js（Pub/Sub Store ↔ IndexedDB 自动保存）
                    ↓
              scoring.js（量表评分 + 标签提取）
                    ↓
              report.js（报告生成 → 页面渲染）
```

### 3.4 题目数据模型

```javascript
// questions.js 中的单题结构
{
  id: "identity-001",           // 唯一 ID：领域-序号
  domain: "identity",           // 六大领域之一
  layer: "factual",             // factual | perceptual | narrative
  framework: "bigfive",         // 关联的心理学框架（可选）
  dimension: "openness",        // 框架维度（可选）
  type: "likert5",              // 题目类型
  text: "你对新经验持开放态度",  // 题面
  options: [                    // 选项（量表/选择题）
    { value: 1, label: "完全不符合" },
    { value: 5, label: "完全符合" }
  ],
  required: false,              // 是否必答
  maxLength: 300,               // 简答题字数上限（可选）
}
```

### 3.5 答案存储模型

```javascript
// IndexedDB 中的存储结构
{
  answers: {
    "identity-001": { value: 4, savedAt: 1722412800000 },
    "identity-002": { value: "我觉得是...", savedAt: 1722412900000 },
    // ...
  },
  meta: {
    startedAt: 1722410000000,
    lastSavedAt: 1722415000000,
    completedDomains: ["identity"],
    currentDomain: "mind",
    totalAnswered: 92,
    skippedQuestions: ["identity-015"]
  }
}
```

---

## 四、UI/UX 设计

### 4.1 配色系统

| Token | 色值 | 用途 |
|-------|------|------|
| `--bg-base` | `#08080c` | 页底色（带暖底调） |
| `--bg-card` | `rgba(255,255,255,0.03)` | 卡片背景 + `backdrop-filter: blur(12px)` |
| `--bg-hover` | `rgba(255,255,255,0.06)` | 悬停态 |
| `--bg-overlay` | `rgba(255,255,255,0.09)` | 弹出层/Modal |
| `--accent` | `#c4a45a` | 暖金——唯一强调色 |
| `--accent-glow` | `rgba(196,164,90,0.2)` | 辉光 |
| `--text-primary` | `rgba(255,255,255,0.87)` | 主文字 |
| `--text-secondary` | `rgba(255,255,255,0.50)` | 次要文字 |
| `--text-tertiary` | `rgba(255,255,255,0.30)` | 辅助/占位 |
| `--border` | `rgba(255,255,255,0.06)` | 1px 边框 |
| `--border-focus` | `rgba(196,164,90,0.3)` | 聚焦边框 |
| `--positive` | `#4ecdc4` | 完成/正向 |
| `--warning` | `#e8734a` | 跳过/提醒 |

### 4.2 质感技法

1. **栅格点阵纹理**：`radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)` 24px 间距
2. **亮度层级**：越亮的层越高（+5~8% 递进），不用投影表达层级
3. **1px 半透明边框**：统一 `rgba(255,255,255,0.06)`，不用灰色
4. **顶部内高光**：`inset 0 1px 0 rgba(255,255,255,0.04)`
5. **渐变边框**：`::before` + `mask-composite: exclude`，暖金→透明
6. **单色纪律**：暖金为唯一强调色，95% UI 用透明度表达
7. **克制动效**：统一 `transition: all 200ms ease-out`，悬停 `scale(1.01)`

### 4.3 字体

```css
/* 正文字体栈 */
font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
             "Microsoft YaHei", "Source Han Sans SC", sans-serif;

/* 报告标题（衬线，制造"档案"感） */
font-family: "Noto Serif CJK SC", "Source Han Serif SC", "Songti SC", serif;
```

字号节奏：12 / 14 / 16 / 20 / 28（5 个层级）

### 4.4 布局

- **移动端（< 640px）**：单列瀑布流，全宽
- **平板（640-1024px）**：居中 640px 宽度
- **桌面（> 1024px）**：居中 640px + 左侧 120px 领域导航
- 粘性顶部进度条 + 粘性领域标题 + 右下角回到顶部按钮

### 4.5 题目 UI 组件

| 类型 | 设计 | 选中态 |
|------|------|--------|
| Likert | 水平排列圆点，间距 6px | 暖金填充 + 辉光 + 缩放 1.1 |
| 单选 | 纵向排列卡片选项 | 左边框渐变暖金 + 暖金文字 |
| 多选 | 方形勾选框 + 卡片 | 右上角 ✓ 描边动画 |
| 排序 | 拖拽手柄 ≡ + 卡片 | 拖拽时 150ms 位移 |
| 短文本 | 下划线输入框 | 下划线变暖金 + 1→2px |
| 长文本 | 卡片内 textarea | 边框微亮 |
| 滑杆 | 自定义 range | 轨道暖金渐变 + 拇指辉光 |

### 4.6 报告页面

6 个板块从上到下：
1. **封面**：姓名 + 日期 + 核心标签（4-6 个关键词）
2. **六维雷达图**：6 大领域得分 SVG 可视化
3. **Big Five 详情**：5 个水平柱状条 + 文字解读
4. **Schwartz 价值观环**：价值取向环形图
5. **CliftonStrengths Top 10**：天赋卡片矩阵
6. **叙事总结**：文字自述（整合所有简答题答案）

操作栏：导出 PDF / 复制摘要 / 重新作答 / 查看原始答案

详见 [`docs/methodology/03-ui-design-reference.md`](../methodology/03-ui-design-reference.md)。

---

## 五、报告评分逻辑

### 5.1 量化维度

每个框架维度通过对应的量表题加权计算：

```
维度得分 = Σ(题目得分 × 题目权重) / Σ(权重) × 20
                              // 映射到 0-100
```

### 5.2 文字生成

叙事层的简答/长文本答案不评分，直接按框架归类呈现。报告中的"叙事总结"板块是将所有简答文本按领域聚合后的人工撰写摘要（初次使用时可提供引导模板）。

### 5.3 标签提取

从以下来源自动生成个人标签：
- Big Five 各维度得分极端值（>80 或 <20）
- Enneagram 最高分类
- CliftonStrengths Top 5 映射的中文关键词
- Schwartz 价值观环主导象限

---

## 六、限制与边界

### 6.1 技术限制

- IndexedDB 容量受浏览器配额限制（通常 > 100MB），400 题答案文本约 100-500KB，绰绰有余
- 虚拟滚动假设所有题目等高，混合题目类型（简答题 vs 量表题高度不同）需要**动态高度计算**
- 报告中的图表使用 Canvas/SVG 手写，不引入 Chart.js 等库（控制体积）

### 6.2 非目标

- ❌ 不做多人协作/排行榜
- ❌ 不做 AI 调用（报告是预设模板 + 本地算法，不调 API）
- ❌ 不做后端/数据库/用户系统
- ❌ 不做 i18n（仅中文）
- ❌ 不做时间对比 v1（后续版本再考虑多次作答对比）

---

## 七、实施策略

分 5 个阶段逐步推进：

| 阶段 | 内容 | 预估工作量 |
|------|------|:--:|
| P1 | 脚手架：HTML 骨架 + CSS 变量 + Store + PWA 基础 | 1 天 |
| P2 | 渲染引擎：虚拟滚动 + 7 种题目组件 + 瀑布流 | 2 天 |
| P3 | 题目数据：400 题内容编写（6 领域 × 3 层次） | 2 天 |
| P4 | 报告系统：评分算法 + 图表 + 报告页面 | 2 天 |
| P5 | 打磨：质感升级 + 动效 + 移动端测试 + 部署 | 1 天 |

---

> 本设计文档引用了 3 份方法论参考文档，均在 `docs/methodology/` 下。
