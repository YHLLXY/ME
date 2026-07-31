# 虚拟滚动优化调研

> 2026-08-01 网络调研，用于优化"自我画像"PWA 的虚拟滚动体验。

---

## 一、缓冲区设计

### 行业标准

| 来源 | 推荐值 |
|------|--------|
| vue-virtual-scroller | 200-400px（桌面）/ 100-200px（移动端） |
| svelte-virtual-list | 默认 20 项 |
| smart-virtual-scroll | 2-3 项额外 |
| 150行实现方案 | 半屏可见项数 |

### 核心公式

```
渲染节点数 = 可视区高度 / 项目高度 + 缓冲区数量(10-20个)
```

缓冲区在可视区上下各额外渲染 5-15 项，防止快速滚动时白屏。

---

## 二、动画过渡方案

### 推荐：CSS Transition + 淡入

```css
.question-slot {
  transition: opacity 250ms ease-out, transform 200ms ease-out;
}
.question-slot.entering {
  opacity: 0;
  transform: translateY(6px);
}
```

JS 侧：节点复用时先加 `entering` 类 → 更新内容 → RAF 后移除 `entering` 类 → CSS 过渡自动执行。

### 级联延迟

```css
animation-delay: calc(var(--animation-order) * 50ms);
```

每个卡片依次出现，制造流畅的视觉流。

### 尊重无障碍

```css
@media (prefers-reduced-motion: reduce) {
  .question-slot { transition: none; }
}
```

---

## 三、性能要点

| 手段 | 作用 |
|------|------|
| `transform: translateY()` 替代 `top` | GPU 合成层，避免重排 |
| `requestAnimationFrame` 节流 | 绑定浏览器帧率（60fps） |
| `will-change: transform` | 提前提升到合成层 |
| `overflow: hidden` 限制溢出 | 防止内容渗入相邻区域 |
| `ResizeObserver` | 动态测量真实高度 |

---

## 四、当前问题诊断

| 问题 | 根因 | 行业对比 |
|------|------|---------|
| 出现太突然 | 无过渡动画，直接 display 切换 | 应用 opacity + transform 过渡 |
| 消失太敏感 | 缓冲区仅 1 屏（~700px） | 行业推荐 2-3 屏或 10-20 项 |
| 重叠 | 估算高度偏小 40-60% | 应提高初始估算 + ResizeObserver 校准 |
| 节点定位用 `top` | 触发 reflow | 应改用 `transform: translateY()` |

---

## 五、参考来源

- [vue-virtual-scroller 全解析](https://developer.baidu.com/article/detail.html?id=3695409)
- [svelte-virtual-list](https://github.com/humanspeak/svelte-virtual-list)
- [150 lines — implementing virtual scroll from scratch](https://dev.to/anishkumar/150-lines-or-less-implementing-virtual-scroll-for-web-from-scratch-4363)
- [Intersection Observer 打造丝滑滚动动画](https://juejin.cn/post/7597199288817893416)
- [虚拟列表实现与优化详解](https://blog.csdn.net/2301_81233478/article/details/154910375)
- [前端开发进阶：虚拟滚动如何大幅提升列表渲染性能](https://blog.csdn.net/mutuyxy/article/details/146353878)
