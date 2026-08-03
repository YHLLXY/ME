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

function deleteAnswer(questionId) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('answers', 'readwrite');
    tx.objectStore('answers').delete(questionId);
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

/* ===== 自动保存（防抖 + 批量落库） ===== */
let saveTimer = null;
let retryTimer = null;
const pendingQueue = new Map();   /* questionId → value；value === undefined 表示删除该题 */

function scheduleSave(questionId, value) {
  /* 同题去重：后写覆盖先写；undefined 为删除哨兵（取消跳过） */
  pendingQueue.set(questionId, value);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { saveTimer = null; doFlush(); }, 800);
}

/* 批量落库：队列快照 → 单事务写入（answers + lastSavedAt）→ 失败重排重试 */
function doFlush() {
  if (pendingQueue.size === 0) return Promise.resolve();
  const entries = [...pendingQueue.entries()];
  pendingQueue.clear();
  return new Promise((resolve) => {
    let tx;
    try {
      tx = db.transaction(['answers', 'meta'], 'readwrite');
    } catch (e) {
      /* DB 不可用（M8 内存降级模式）：静默丢弃队列，不阻塞流程 */
      console.error('IndexedDB unavailable, discarding pending saves:', e);
      pendingQueue.clear();
      resolve();
      return;
    }
    const answersStore = tx.objectStore('answers');
    const metaStore = tx.objectStore('meta');
    for (const [qid, value] of entries) {
      if (value === undefined) answersStore.delete(qid);
      else answersStore.put({ questionId: qid, value, savedAt: Date.now() });
    }
    metaStore.put({ key: 'lastSavedAt', value: Date.now() });
    tx.oncomplete = () => {
      if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }
      publish('saved', { queued: pendingQueue.size });
      resolve();
    };
    tx.onerror = () => {
      /* 失败：重排待存条目（去重），稍后自动重试 */
      for (const [qid, value] of entries) pendingQueue.set(qid, value);
      publish('save-error', { error: tx.error });
      if (!retryTimer) retryTimer = setTimeout(() => { retryTimer = null; doFlush(); }, 1500);
      resolve();
    };
  });
}

/* ===== 立即保存（页面隐藏 / 报告生成前） ===== */
function flushPendingSaves() {
  clearTimeout(saveTimer);
  return doFlush();
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