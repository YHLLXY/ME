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