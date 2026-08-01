# 经验教训 — 自我画像

---

## 2026-08-01：虚拟滚动二分查找共用变量导致只渲染 6 题

### 问题

快速滚动时题目数量不够、从第 6 题后不再显示。

### 根因

`renderVisible()` 中二分查找下界和上界共用了 `to` 变量：

```javascript
// 下界查找把 to 缩小到和 from 相等
let from = 0, to = questions.length - 1;
while (from < to) {
  const mid = Math.floor((from + to) / 2);
  if (questionPositions[mid] < renderStart) from = mid + 1;
  else to = mid;  // ← to 被改变了
}
from = Math.max(0, from - 5);

// 上界查找 —— to === from，条件永不成立，循环不执行
while (to > from && questionPositions[to] > renderEnd) to--;
to = Math.min(questions.length - 1, to + 5);  // to = 0 + 5 = 5
```

无论滚到哪，`to` 永远 ≈ `from + 5`，只渲染 ~6 道题。

### 解决方案

用独立变量做两遍二分查找：

```javascript
// 下界（第一个可见题）
let lo = 0, hi = questions.length - 1;
while (lo < hi) { ... }
let from = Math.max(0, lo - 5);

// 上界（最后一个可见题）—— 独立变量
lo = from; hi = questions.length - 1;
while (lo < hi) {
  const mid = Math.ceil((lo + hi) / 2);
  if (questionPositions[mid] > renderEnd) hi = mid - 1;
  else lo = mid;
}
let to = Math.min(questions.length - 1, hi + 5);
```

### 如何避免

二分查找变体多（找首个匹配、找末个匹配、找插入位置），**永远不要在不同目的的查找之间共享搜索变量**。给变量起语义化名字（如 `findFirst`/`findLast`）而不是 `from`/`to`。

---

## 2026-08-01：虚拟滚动固定估算高度导致题目重叠

### 问题

初始化时用固定值估算每道题高度，之后永不再修正。题目实际高度因文字长度、选项数量、屏幕宽度而异，估算偏差逐题累积，越往后偏离越大。

### 根因

```javascript
// 只在 initRender 里算一次，之后永不更新
for (let i = 0; i < questions.length; i++) {
  questionPositions.push(offset);
  offset += ESTIMATED_HEIGHTS[q.type] || 140;  // ← 固定值，无视实际内容
}
```

虚拟滚动的核心矛盾：**定位需要精确高度 → 但精确高度只有渲染后才能知道 → 但定位又需要在渲染之前算好**。

### 解决方案

打破循环依赖：先估算 → 渲染 → 实测 → 回写。

```
ResizeObserver 监听每个已渲染节点
  → offsetHeight 读取真实高度
  → measuredHeights[qi] = 真实值
  → rebuildPositions() 用实测值重建位置表
  → 锚点机制锁定当前视口位置，防止校准跳动
```

关键实现细节：

1. **实测值包含领域标题** — `renderQuestion` 把标题和卡片都放进同一个 slot，所以 ResizeObserver 测出来已经是完整高度，`rebuildPositions` 里直接使用，不再叠加 `DOMAIN_HEADER_HEIGHT`。
2. **RAF 防抖** — `onNodeResize` 可能批量触发（多个节点同时渲染），用 `pendingRecalc` 标记 + 单个 RAF 合并为一次 `rebuildPositions`。
3. **隐藏节点过滤** — 节点归还池（`display: none`）时 ResizeObserver 也触发（高度变 0），通过 `data-qi === '-1'` 跳过。

### 如何避免

**虚拟滚动的估算值永远是错的。** 必须有一个"渲染后测量 → 回写位置表"的闭环。行业标准做法：

| 框架 | 机制 |
|------|------|
| react-window | 每个 item 渲染后用 `onItemsRendered` 回调 + `scrollToItem` 对齐 |
| vue-virtual-scroller | `ResizeObserver` + `--item-height` CSS 变量动态更新 |
| 原生实现 | ResizeObserver / IntersectionObserver + anchor 锚点 |

**写虚拟滚动之前就应该规划这个闭环，而不是事后打补丁。**

---

## 2026-08-01：节点池复用导致答题后选中态不更新

### 问题

点击选项后，数据已保存、进度条已更新，但页面上选项没有任何视觉变化。

### 根因

节点池复用时只检查"题目是否换了"：

```javascript
if (slot.qi !== qi) {   // 换了题目 → 重新渲染
  renderQuestion(el, q, qi);
}
// 没换题目 → 跳过 → 选中态不更新！
```

答题后题目还在同一个槽位 → `qi` 没变 → `renderQuestion` 不执行 → DOM 不更新。

### 解决方案

加一个"强制刷新"分支：同槽位但被要求刷新时，无动画直接重渲染：

```javascript
} else if (arguments[0]) {
  renderQuestion(el, q, qi);  // 无动画，只更新内容
}
```

### 如何避免

**节点池的"复用判定"和"内容更新判定"是两个独立维度。** 复用判定是"这个 slot 该显示哪个题"，内容更新判定是"这个题的内容有没有变化（选中态、输入值等）"。前者通过 `qi` 判断，后者需要额外的脏标记或强制刷新参数。