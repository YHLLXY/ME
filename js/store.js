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