/* === js/report.js === */

/**
 * 报告页渲染引擎 — 将评分结果渲染为完整的"自我画像"报告
 *
 * 依赖（全局）:
 *   calculateScores()  — scoring.js
 *   getAllAnswers()    — store.js
 *   exportJSON()       — store.js
 *   clearAllData()     — store.js
 *   escapeHTML()       — render.js
 *   DOMAINS            — questions.js
 *   QUESTIONS          — questions.js
 */

/* ===================================================================
   一、注入报告专属样式
   =================================================================== */

(function injectReportStyles() {
  if (document.getElementById('report-inline-styles')) return;
  var style = document.createElement('style');
  style.id = 'report-inline-styles';
  style.textContent = [
    '.r-cover { text-align:center; padding:60px 0 40px; }',
    '.r-cover-title { font-family:"Noto Serif CJK SC","Source Han Serif SC","Songti SC",serif; font-size:36px; color:var(--accent); margin-bottom:12px; letter-spacing:2px; }',
    '.r-cover-date { font-size:var(--fs-sm); color:var(--text-tertiary); margin-bottom:20px; }',
    '.r-cover-tags { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-bottom:16px; }',
    '.r-cover-meta { font-size:var(--fs-xs); color:var(--text-tertiary); }',
    '.r-section { margin:40px 0; padding-top:24px; border-top:1px solid var(--border-subtle); }',
    '.r-section:first-of-type { border-top:none; padding-top:0; }',
    '.r-section-title { font-size:var(--fs-lg); font-weight:600; color:var(--accent); margin-bottom:20px; padding-left:12px; border-left:3px solid var(--accent); }',
    '.r-tag { display:inline-block; padding:4px 12px; border-radius:12px; background:var(--accent-dim); color:var(--accent); font-size:var(--fs-xs); }',
    '.r-bar-row { display:flex; align-items:center; margin-bottom:12px; gap:12px; }',
    '.r-bar-label { width:80px; font-size:var(--fs-sm); color:var(--text-secondary); text-align:right; flex-shrink:0; }',
    '.r-bar-content { flex:1; }',
    '.r-bar-track { width:100%; height:24px; background:rgba(255,255,255,0.04); border-radius:4px; overflow:hidden; position:relative; }',
    '.r-bar-fill { height:100%; border-radius:4px; background:var(--accent); transition:width 800ms ease-out; min-width:0; }',
    '.r-bar-score { font-size:var(--fs-xs); color:var(--accent); margin-top:2px; }',
    '.r-dim-desc { font-size:var(--fs-xs); color:var(--text-tertiary); margin-top:4px; }',
    '.r-type-badge { display:inline-block; font-size:48px; font-weight:700; color:var(--accent); font-family:"Noto Serif CJK SC","Source Han Serif SC","Songti SC",serif; margin:12px 0; }',
    '.r-type-row { display:flex; gap:16px; flex-wrap:wrap; margin:16px 0; }',
    '.r-type-item { flex:1; min-width:120px; text-align:center; }',
    '.r-type-label { font-size:var(--fs-xs); color:var(--text-tertiary); }',
    '.r-type-val { font-size:var(--fs-lg); font-weight:700; color:var(--accent); }',
    '.r-type-bar { height:4px; background:rgba(255,255,255,0.06); border-radius:2px; margin-top:4px; overflow:hidden; }',
    '.r-type-bar-fill { height:100%; background:var(--accent); border-radius:2px; }',
    '.r-narrative-block { margin-bottom:24px; }',
    '.r-narrative-domain { font-size:var(--fs-md); font-weight:600; color:var(--text-primary); margin-bottom:8px; cursor:pointer; user-select:none; display:flex; align-items:center; gap:8px; }',
    '.r-narrative-domain::after { content:"▸"; font-size:10px; transition:transform 200ms ease-out; color:var(--text-tertiary); }',
    '.r-narrative-domain.open::after { transform:rotate(90deg); }',
    '.r-narrative-body { display:none; }',
    '.r-narrative-body.open { display:block; }',
    '.r-narrative-item { margin-bottom:12px; }',
    '.r-narrative-q { font-size:var(--fs-xs); color:var(--accent); margin-bottom:4px; }',
    '.r-narrative-text { font-size:var(--fs-sm); color:var(--text-secondary); line-height:1.8; padding:12px; background:var(--bg-card); border-radius:var(--radius-md); border:1px solid var(--border-subtle); white-space:pre-wrap; word-break:break-word; }',
    '.r-action-bar { position:sticky; bottom:0; background:rgba(8,8,12,0.9); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border-top:1px solid var(--border-subtle); padding:12px 16px; display:flex; gap:8px; flex-wrap:wrap; justify-content:center; z-index:10; }',
    '.r-btn { padding:8px 20px; border-radius:var(--radius-sm); font-size:var(--fs-sm); cursor:pointer; border:1px solid var(--border-subtle); background:transparent; color:var(--text-secondary); transition:all var(--ease-out); font-family:inherit; }',
    '.r-btn:hover { background:var(--bg-hover); color:var(--text-primary); }',
    '.r-btn.primary { background:var(--accent); color:var(--bg-base); border-color:var(--accent); font-weight:600; }',
    '.r-btn.primary:hover { box-shadow:0 0 16px var(--accent-glow); }',
    '.r-svg-chart { display:block; margin:0 auto; max-width:100%; }',
    '.r-value-list { display:flex; flex-wrap:wrap; gap:8px; }',
    '.r-value-item { padding:6px 14px; border-radius:var(--radius-md); background:var(--bg-card); border:1px solid var(--border-subtle); font-size:var(--fs-sm); color:var(--text-secondary); display:flex; align-items:center; gap:8px; }',
    '.r-value-score { font-size:var(--fs-xs); color:var(--accent); font-weight:600; }',
    '.r-ordered-list { list-style:none; padding:0; }',
    '.r-ordered-list li { padding:8px 0; border-bottom:1px solid var(--border-subtle); font-size:var(--fs-sm); color:var(--text-secondary); display:flex; justify-content:space-between; align-items:center; }',
    '.r-ordered-list li:last-child { border-bottom:none; }',
    '.r-ordered-num { color:var(--accent); font-weight:600; min-width:24px; }',
    '.r-summary-block { margin:16px 0; padding:16px; background:var(--bg-card); border-radius:var(--radius-md); border:1px solid var(--border-subtle); }',
    '.r-summary-block p { font-size:var(--fs-sm); color:var(--text-secondary); line-height:1.8; margin-bottom:8px; }',
    '.r-summary-block p:last-child { margin-bottom:0; }',
    '.r-mbti-dims { display:flex; gap:12px; flex-wrap:wrap; margin:12px 0; }',
    '.r-mbti-dim { flex:1; min-width:80px; background:var(--bg-card); border-radius:var(--radius-md); padding:12px; text-align:center; border:1px solid var(--border-subtle); }',
    '.r-mbti-dim-name { font-size:10px; color:var(--text-tertiary); margin-bottom:4px; }',
    '.r-mbti-dim-letters { font-size:var(--fs-md); font-weight:700; color:var(--text-primary); }',
    '.r-mbti-dim-score { font-size:var(--fs-xs); color:var(--accent); margin-top:4px; }',
    '.r-ikigai-circles { display:flex; gap:12px; flex-wrap:wrap; margin:16px 0; }',
    '.r-ikigai-circle { flex:1; min-width:100px; text-align:center; padding:12px; background:var(--bg-card); border-radius:var(--radius-md); border:1px solid var(--border-subtle); }',
    '.r-ikigai-circle.highest { border-color:var(--accent); background:var(--accent-dim); }',
    '.r-ikigai-name { font-size:var(--fs-xs); color:var(--text-tertiary); margin-bottom:4px; }',
    '.r-ikigai-score { font-size:var(--fs-lg); font-weight:700; color:var(--accent); }',
    '@media (max-width:640px) {',
    '  .r-cover-title { font-size:28px; }',
    '  .r-bar-label { width:60px; font-size:var(--fs-xs); }',
    '  .r-type-badge { font-size:36px; }',
    '  .r-cover { padding:40px 0 24px; }',
    '  .r-type-row { gap:8px; }',
    '  .r-mbti-dims { gap:6px; }',
    '  .r-mbti-dim { min-width:60px; padding:8px; }',
    '  .r-ikigai-circles { gap:8px; }',
    '  .r-ikigai-circle { min-width:70px; padding:8px; }',
    '}'
  ].join('\n');
  document.head.appendChild(style);
})();


/* ===================================================================
   二、辅助函数
   =================================================================== */

/**
 * 安全获取嵌套属性
 */
function safeGet(obj, path, fallback) {
  if (fallback === undefined) fallback = null;
  if (!obj) return fallback;
  var keys = path.split('.');
  var current = obj;
  for (var i = 0; i < keys.length; i++) {
    if (current == null || typeof current !== 'object') return fallback;
    current = current[keys[i]];
  }
  return current != null ? current : fallback;
}

/**
 * 格式化日期
 */
function formatDate(isoStr) {
  if (!isoStr) return '';
  var d = new Date(isoStr);
  if (isNaN(d.getTime())) return '';
  return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
}


/* ===================================================================
   三、SVG 雷达图
   =================================================================== */

function drawRadarChart(domainScores) {
  var cx = 200, cy = 200, r = 160;
  var domains = DOMAINS;
  var n = domains.length; // 6
  var angleStep = (2 * Math.PI) / n;
  var startAngle = -Math.PI / 2; // 从顶部开始

  // 计算网格多边形坐标
  function gridPoints(level) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var a = startAngle + i * angleStep;
      pts.push({
        x: cx + r * level * Math.cos(a),
        y: cy + r * level * Math.sin(a)
      });
    }
    return pts;
  }

  var svg = '<svg class="r-svg-chart" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">';

  // 网格层 (25%, 50%, 75%, 100%)
  var gridLevels = [0.25, 0.5, 0.75, 1.0];
  for (var gi = 0; gi < gridLevels.length; gi++) {
    var level = gridLevels[gi];
    var pts = gridPoints(level);
    var pointsStr = pts.map(function (p) { return p.x + ',' + p.y; }).join(' ');
    var opacity = level === 1.0 ? 0.08 : level === 0.75 ? 0.05 : 0.03;
    svg += '<polygon points="' + pointsStr + '" fill="none" stroke="rgba(255,255,255,' + opacity + ')" stroke-width="1"/>';
  }

  // 轴射线
  for (var i = 0; i < n; i++) {
    var a = startAngle + i * angleStep;
    var ex = cx + r * Math.cos(a);
    var ey = cy + r * Math.sin(a);
    svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + ex + '" y2="' + ey + '" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>';
  }

  // 数据区域
  var dataPts = [];
  for (var i = 0; i < n; i++) {
    var d = domainScores[domains[i].id];
    var score = (d && d.score != null) ? d.score : 0;
    var ratio = Math.max(0, Math.min(100, score)) / 100;
    var a = startAngle + i * angleStep;
    dataPts.push({
      x: cx + r * ratio * Math.cos(a),
      y: cy + r * ratio * Math.sin(a)
    });
  }
  var dataPointsStr = dataPts.map(function (p) { return p.x + ',' + p.y; }).join(' ');
  svg += '<polygon points="' + dataPointsStr + '" fill="rgba(196,164,90,0.15)" stroke="var(--accent)" stroke-width="1.5" stroke-linejoin="round"/>';

  // 数据点
  for (var i = 0; i < n; i++) {
    var pt = dataPts[i];
    svg += '<circle cx="' + pt.x + '" cy="' + pt.y + '" r="4" fill="var(--accent)">';
    svg += '<animate attributeName="r" values="0;4" dur="600ms" fill="freeze"/>';
    svg += '</circle>';
  }

  // 轴标签
  for (var i = 0; i < n; i++) {
    var a = startAngle + i * angleStep;
    var labelR = r + 28;
    var lx = cx + labelR * Math.cos(a);
    var ly = cy + labelR * Math.sin(a);
    var textAnchor = 'middle';
    if (lx < cx - 10) textAnchor = 'end';
    else if (lx > cx + 10) textAnchor = 'start';
    svg += '<text x="' + lx + '" y="' + (ly + 5) + '" text-anchor="' + textAnchor + '" fill="var(--text-secondary)" font-size="12" font-family="inherit">' + escapeHTML(domains[i].name) + '</text>';
  }

  svg += '</svg>';
  return svg;
}


/* ===================================================================
   四、各区块渲染函数
   =================================================================== */

/**
 * 渲染封面
 */
function renderCover(report) {
  var tags = safeGet(report, 'meta.tagged', []);
  var tagsHTML = tags.length > 0
    ? tags.map(function (t) { return '<span class="r-tag">' + escapeHTML(t) + '</span>'; }).join('')
    : '<span class="r-tag">等待探索</span>';

  var dateStr = formatDate(safeGet(report, 'meta.calculatedAt'));

  return '<div class="r-cover">'
    + '<h1 class="r-cover-title">自我画像</h1>'
    + (dateStr ? '<p class="r-cover-date">生成日期：' + dateStr + '</p>' : '')
    + '<div class="r-cover-tags">' + tagsHTML + '</div>'
    + '<p class="r-cover-meta">基于 400 题 · 11 个心理学框架 · 6 大领域</p>'
    + '</div>';
}

/**
 * 渲染六维雷达图区域
 */
function renderDomainSection(report) {
  var domains = safeGet(report, 'domains', {});
  var svgChart = drawRadarChart(domains);

  var summaryItems = '';
  DOMAINS.forEach(function (d) {
    var data = domains[d.id];
    if (!data) return;
    var score = data.score != null ? data.score + '分' : '--';
    var meta = data.answered + '/' + data.total + '题';
    summaryItems += '<div class="r-value-item">'
      + '<span>' + (d.emoji || '') + ' ' + escapeHTML(data.name) + '</span>'
      + '<span class="r-value-score">' + score + '</span>'
      + '<span style="font-size:10px;color:var(--text-tertiary)">' + meta + '</span>'
      + '</div>';
  });

  return '<div class="r-section">'
    + '<h2 class="r-section-title">六维概览</h2>'
    + svgChart
    + '<div class="r-value-list" style="margin-top:16px;">' + summaryItems + '</div>'
    + '</div>';
}

/**
 * 渲染 Big Five 水平柱状图
 */
function renderBigFiveSection(report) {
  var bf = safeGet(report, 'bigfive');
  if (!bf || !bf.dimensions) return '';

  var dimNames = {
    openness: '开放性', conscientiousness: '尽责性', extraversion: '外倾性',
    agreeableness: '宜人性', neuroticism: '情绪稳定性'
  };

  var bars = '';
  var keys = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
  keys.forEach(function (dim) {
    var d = bf.dimensions[dim];
    if (!d) return;
    var score = d.score != null ? d.score : 0;
    var width = score + '%';
    bars += '<div class="r-bar-row">'
      + '<div class="r-bar-label">' + (dimNames[dim] || dim) + '</div>'
      + '<div class="r-bar-content">'
      + '<div class="r-bar-track"><div class="r-bar-fill" style="width:' + width + '"></div></div>'
      + '<div class="r-bar-score">' + score + ' · ' + escapeHTML(d.label || '') + '</div>'
      + (d.interpretation ? '<div class="r-dim-desc">' + escapeHTML(d.interpretation) + '</div>' : '')
      + '</div>'
      + '</div>';
  });

  var highlight = bf.highlight || '';

  return '<div class="r-section">'
    + '<h2 class="r-section-title">Big Five 大五人格</h2>'
    + (highlight ? '<div class="r-summary-block"><p>' + escapeHTML(highlight) + '</p></div>' : '')
    + bars
    + '</div>';
}

/**
 * 渲染 MBTI + Enneagram
 */
function renderTypeSection(report) {
  var mbti = safeGet(report, 'mbti');
  var ennea = safeGet(report, 'enneagram');

  var html = '<div class="r-section"><h2 class="r-section-title">类型指标</h2>';

  // MBTI
  if (mbti && mbti.type) {
    var mbtiDims = { ei: 'E/I', sn: 'S/N', tf: 'T/F', jp: 'J/P' };
    var mbtiDimsHTML = '';
    Object.keys(mbtiDims).forEach(function (dim) {
      var score = mbti.dimensions && mbti.dimensions[dim] != null ? mbti.dimensions[dim] : null;
      var pct = score != null ? score : 50;
      html += '<div class="r-mbti-dim">'
        + '<div class="r-mbti-dim-name">' + mbtiDims[dim] + '</div>'
        + '<div class="r-mbti-dim-letters">' + (pct > 50 ? dim.charAt(0).toUpperCase() : dim.charAt(1).toUpperCase()) + '</div>'
        + '<div class="r-type-bar"><div class="r-type-bar-fill" style="width:' + pct + '%"></div></div>'
        + '<div class="r-mbti-dim-score">' + (score != null ? score + '%' : '--') + '</div>'
        + '</div>';
    });

    html += '<div style="text-align:center;margin-bottom:24px;">'
      + '<div class="r-type-badge">' + escapeHTML(mbti.type) + '</div>'
      + '<p style="font-size:var(--fs-xs);color:var(--text-tertiary);">MBTI 类型指标</p>'
      + '</div>'
      + '<div class="r-mbti-dims">' + mbtiDimsHTML + '</div>';
  }

  // Enneagram
  if (ennea && ennea.primary) {
    var primaryLabel = ennea.primaryName || ennea.primary;
    var wingLabel = ennea.wingName || '';
    html += '<div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid var(--border-subtle);">'
      + '<div class="r-type-badge" style="font-size:36px;">' + escapeHTML(primaryLabel) + '</div>';
    if (wingLabel) {
      html += '<p style="font-size:var(--fs-sm);color:var(--text-secondary);">翼型：' + escapeHTML(wingLabel) + '</p>';
    }
    html += '<p style="font-size:var(--fs-xs);color:var(--text-tertiary);">九型人格主类型</p>';

    // 所有类型得分排序
    if (ennea.sorted && ennea.sorted.length > 0) {
      html += '<div style="margin-top:16px;">';
      ennea.sorted.forEach(function (item, idx) {
        var barW = (item.score != null ? item.score : 0) + '%';
        html += '<div class="r-bar-row">'
          + '<div class="r-bar-label" style="width:60px;">' + (idx + 1) + '. ' + escapeHTML(item.name) + '</div>'
          + '<div class="r-bar-content">'
          + '<div class="r-bar-track"><div class="r-bar-fill" style="width:' + barW + '"></div></div>'
          + '<div class="r-bar-score">' + (item.score != null ? item.score : '--') + '</div>'
          + '</div>'
          + '</div>';
      });
      html += '</div>';
    }

    html += '</div>';
  }

  html += '</div>';
  return html;
}

/**
 * 渲染 Schwartz 价值观 + Ikigai
 */
function renderValuesSection(report) {
  var schwartz = safeGet(report, 'schwartz');
  var ikigai = safeGet(report, 'ikigai');

  var html = '<div class="r-section"><h2 class="r-section-title">价值观与意义</h2>';

  // Schwartz
  if (schwartz && schwartz.ranked && schwartz.ranked.length > 0) {
    html += '<h3 style="font-size:var(--fs-sm);color:var(--text-secondary);margin-bottom:12px;">Schwartz 价值观排序</h3>';
    html += '<div class="r-value-list">';
    schwartz.ranked.forEach(function (item) {
      html += '<div class="r-value-item">'
        + escapeHTML(item.name)
        + '<span class="r-value-score">' + (item.score != null ? item.score : '--') + '</span>'
        + '</div>';
    });
    html += '</div>';
  }

  // Ikigai
  if (ikigai && ikigai.dimensions) {
    html += '<h3 style="font-size:var(--fs-sm);color:var(--text-secondary);margin:20px 0 12px;">Ikigai 四圆</h3>';
    html += '<div class="r-ikigai-circles">';
    var dimNames = { passion: '热爱之事', mission: '世界需要', vocation: '可获得报酬', profession: '你擅长之事' };
    Object.keys(dimNames).forEach(function (dim) {
      var d = ikigai.dimensions[dim];
      var score = d ? d.score : null;
      var isHighest = ikigai.highestCircle === dim;
      html += '<div class="r-ikigai-circle' + (isHighest ? ' highest' : '') + '">'
        + '<div class="r-ikigai-name">' + dimNames[dim] + '</div>'
        + '<div class="r-ikigai-score">' + (score != null ? score : '--') + '</div>'
        + (isHighest ? '<div style="font-size:10px;color:var(--accent);margin-top:4px;">最突出</div>' : '')
        + '</div>';
    });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

/**
 * 渲染 CliftonStrengths
 */
function renderStrengthsSection(report) {
  var cs = safeGet(report, 'cliftonstrengths');
  if (!cs) return '';

  var html = '<div class="r-section"><h2 class="r-section-title">优势识别</h2>';

  if (cs.topDomains && cs.topDomains.length > 0) {
    html += '<p style="font-size:var(--fs-sm);color:var(--text-secondary);margin-bottom:12px;">Top 优势领域</p>';
    html += '<ol class="r-ordered-list">';
    cs.topDomains.forEach(function (name, idx) {
      html += '<li><span><span class="r-ordered-num">' + (idx + 1) + '.</span>' + escapeHTML(name) + '</span></li>';
    });
    html += '</ol>';
  }

  // 所有维度
  if (cs.dimensions) {
    var dimNames = { executing: '执行力', influencing: '影响力', 'relationship-building': '关系建立', 'strategic-thinking': '战略思维' };
    html += '<div style="margin-top:16px;">';
    Object.keys(dimNames).forEach(function (dim) {
      var d = cs.dimensions[dim];
      if (!d) return;
      var score = d.score != null ? d.score : 0;
      html += '<div class="r-bar-row">'
        + '<div class="r-bar-label" style="width:80px;">' + dimNames[dim] + '</div>'
        + '<div class="r-bar-content">'
        + '<div class="r-bar-track"><div class="r-bar-fill" style="width:' + score + '%"></div></div>'
        + '<div class="r-bar-score">' + score + ' · ' + escapeHTML(d.label || '') + '</div>'
        + '</div>'
        + '</div>';
    });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

/**
 * 渲染 TSCS + Goleman EQ（合并为"自我认知与情商"）
 */
function renderSelfConceptSection(report) {
  var tscs = safeGet(report, 'tscs');
  var eq = safeGet(report, 'goleman-eq');

  if (!tscs && !eq) return '';

  var html = '<div class="r-section"><h2 class="r-section-title">自我认知与情商</h2>';

  // TSCS
  if (tscs && tscs.dimensions) {
    html += '<h3 style="font-size:var(--fs-sm);color:var(--text-secondary);margin-bottom:12px;">田纳西自我概念 (TSCS)</h3>';
    var dimNames = {
      identity: '自我认同', satisfaction: '自我满意', physical: '身体自我',
      moral: '道德自我', social: '社会自我', family: '家庭自我',
      'self-criticism': '自我批评', competence: '能力自我'
    };
    html += '<div class="r-value-list">';
    Object.keys(dimNames).forEach(function (dim) {
      var d = tscs.dimensions[dim];
      if (!d) return;
      html += '<div class="r-value-item">'
        + escapeHTML(dimNames[dim] || dim)
        + '<span class="r-value-score">' + (d.score != null ? d.score : '--') + '</span>'
        + '</div>';
    });
    html += '</div>';
  }

  // Goleman EQ
  if (eq && eq.dimensions) {
    html += '<h3 style="font-size:var(--fs-sm);color:var(--text-secondary);margin:20px 0 12px;">Goleman 情商</h3>';
    var eqDimNames = {
      'self-awareness': '自我觉察', 'self-management': '自我管理',
      'social-awareness': '社会觉察', 'relationship-management': '关系管理'
    };
    html += '<div class="r-value-list">';
    Object.keys(eqDimNames).forEach(function (dim) {
      var d = eq.dimensions[dim];
      if (!d) return;
      html += '<div class="r-value-item">'
        + escapeHTML(eqDimNames[dim] || dim)
        + '<span class="r-value-score">' + (d.score != null ? d.score : '--') + '</span>'
        + '</div>';
    });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

/**
 * 渲染叙事总结
 */
function renderNarrativeSection(answers) {
  // 收集所有 shorttext / longtext 答案，按领域分组
  var narrativeMap = {};
  QUESTIONS.forEach(function (q) {
    if (q.type !== 'shorttext' && q.type !== 'longtext') return;
    var val = answers[q.id];
    if (!val || (typeof val === 'string' && val.trim() === '')) return;

    if (!narrativeMap[q.domain]) {
      narrativeMap[q.domain] = [];
    }
    narrativeMap[q.domain].push({
      id: q.id,
      text: q.text,
      answer: val,
      type: q.type
    });
  });

  var domainIds = Object.keys(narrativeMap);
  if (domainIds.length === 0) return '';

  var html = '<div class="r-section"><h2 class="r-section-title">叙事回顾</h2>';

  domainIds.forEach(function (domainId) {
    var items = narrativeMap[domainId];
    var domainInfo = DOMAINS.find(function (d) { return d.id === domainId; });
    var domainName = domainInfo ? domainInfo.name : domainId;
    var domainEmoji = domainInfo ? (domainInfo.emoji || '') : '';

    html += '<div class="r-narrative-block">'
      + '<div class="r-narrative-domain" onclick="var b=this.nextElementSibling;var isOpen=b.classList.contains(\'open\');b.classList.toggle(\'open\',!isOpen);this.classList.toggle(\'open\',!isOpen);">'
      + domainEmoji + ' ' + escapeHTML(domainName)
      + ' <span style="font-size:var(--fs-xs);color:var(--text-tertiary);font-weight:400;">(' + items.length + '条)</span>'
      + '</div>'
      + '<div class="r-narrative-body">';

    items.forEach(function (item) {
      html += '<div class="r-narrative-item">'
        + '<div class="r-narrative-q">' + escapeHTML(item.text) + '</div>'
        + '<div class="r-narrative-text">' + escapeHTML(item.answer) + '</div>'
        + '</div>';
    });

    html += '</div></div>';
  });

  html += '</div>';
  return html;
}

/**
 * 渲染操作栏
 */
function renderActionBar() {
  return '<div class="r-section">'
    + '<h2 class="r-section-title">操作</h2>'
    + '<div class="r-action-bar" style="position:static;background:none;backdrop-filter:none;border:none;padding:0;">'
    + '<button class="r-btn primary" id="btnExportJSON">导出 JSON</button>'
    + '<button class="r-btn" id="btnCopySummary">复制摘要</button>'
    + '<button class="r-btn" id="btnRetake">重新作答</button>'
    + '<button class="r-btn" id="btnBackToQuestions">返回题目</button>'
    + '</div>'
    + '</div>';
}


/* ===================================================================
   五、主渲染函数
   =================================================================== */

function renderReport(report, answers) {
  var container = document.getElementById('reportContent');
  if (!container) {
    console.error('[report] #reportContent not found');
    return;
  }

  var html = '';

  // 1. 封面
  html += renderCover(report);

  // 2. 六维雷达图
  html += renderDomainSection(report);

  // 3. Big Five
  html += renderBigFiveSection(report);

  // 4. MBTI + Enneagram
  html += renderTypeSection(report);

  // 5. 价值观 + Ikigai
  html += renderValuesSection(report);

  // 6. CliftonStrengths
  html += renderStrengthsSection(report);

  // 7. TSCS + Goleman EQ
  html += renderSelfConceptSection(report);

  // 8. 叙事总结
  html += renderNarrativeSection(answers);

  // 9. 操作栏
  html += renderActionBar();

  container.innerHTML = html;

  // 绑定操作按钮事件
  bindActionButtons(report);
}


/* ===================================================================
   六、操作按钮事件
   =================================================================== */

function bindActionButtons(report) {
  // 导出 JSON
  var btnExport = document.getElementById('btnExportJSON');
  if (btnExport) {
    btnExport.addEventListener('click', function () {
      try {
        exportJSON().then(function (data) {
          var json = JSON.stringify(data, null, 2);
          var blob = new Blob([json], { type: 'application/json' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'self-portrait-' + new Date().toISOString().slice(0, 10) + '.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }).catch(function (e) {
          alert('导出失败：' + e.message);
        });
      } catch (e) {
        alert('导出失败：' + e.message);
      }
    });
  }

  // 复制摘要
  var btnCopy = document.getElementById('btnCopySummary');
  if (btnCopy) {
    btnCopy.addEventListener('click', function () {
      try {
        var summary = buildTextSummary(report);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(summary).then(function () {
            btnCopy.textContent = '已复制';
            setTimeout(function () { btnCopy.textContent = '复制摘要'; }, 2000);
          }).catch(function () {
            fallbackCopy(summary, btnCopy);
          });
        } else {
          fallbackCopy(summary, btnCopy);
        }
      } catch (e) {
        alert('复制失败：' + e.message);
      }
    });
  }

  // 重新作答
  var btnRetake = document.getElementById('btnRetake');
  if (btnRetake) {
    btnRetake.addEventListener('click', function () {
      if (!confirm('确定要重新作答吗？所有已保存的答案将被清除，此操作不可撤销。')) return;
      try {
        clearAllData().then(function () {
          window.location.reload();
        }).catch(function (e) {
          alert('清除数据失败：' + e.message);
        });
      } catch (e) {
        alert('清除数据失败：' + e.message);
      }
    });
  }

  // 返回题目
  var btnBack = document.getElementById('btnBackToQuestions');
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      var reportPage = document.getElementById('reportPage');
      if (reportPage) {
        reportPage.setAttribute('hidden', '');
      }
      var waterfall = document.getElementById('waterfall');
      if (waterfall) {
        waterfall.style.display = '';
      }
      window.scrollTo(0, 0);
    });
  }
}

/**
 * 降级复制（fallback for older browsers）
 */
function fallbackCopy(text, btn) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    btn.textContent = '已复制';
    setTimeout(function () { btn.textContent = '复制摘要'; }, 2000);
  } catch (e) {
    alert('复制失败，请手动复制');
  }
  document.body.removeChild(textarea);
}

/**
 * 生成文字摘要
 */
function buildTextSummary(report) {
  var lines = [];

  lines.push('=== 自我画像 报告摘要 ===');
  lines.push('');

  // Big Five
  var bf = safeGet(report, 'bigfive');
  if (bf && bf.highlight) {
    lines.push('【大五人格】');
    lines.push(bf.highlight);
    lines.push('');
  }

  // MBTI
  var mbti = safeGet(report, 'mbti');
  if (mbti && mbti.type) {
    lines.push('【MBTI 类型】' + mbti.type);
    lines.push('');
  }

  // Enneagram
  var ennea = safeGet(report, 'enneagram');
  if (ennea && ennea.primaryName) {
    var enneaStr = '【九型人格】' + ennea.primaryName;
    if (ennea.wingName) enneaStr += '（翼型：' + ennea.wingName + '）';
    lines.push(enneaStr);
    lines.push('');
  }

  // Top Strengths
  var strengths = safeGet(report, 'meta.topStrengths', []);
  if (strengths.length > 0) {
    lines.push('【突出优势】' + strengths.slice(0, 5).join('、'));
    lines.push('');
  }

  // Schwartz top values
  var sv = safeGet(report, 'schwartz.topValues', []);
  if (sv.length > 0) {
    lines.push('【核心价值观】' + sv.join('、'));
    lines.push('');
  }

  // Ikigai
  var ikigai = safeGet(report, 'ikigai');
  if (ikigai && ikigai.highestCircleName) {
    lines.push('【Ikigai 最突出】' + ikigai.highestCircleName);
    lines.push('');
  }

  // Domain scores
  var domains = safeGet(report, 'domains', {});
  lines.push('【六维得分】');
  DOMAINS.forEach(function (d) {
    var data = domains[d.id];
    if (data && data.score != null) {
      lines.push('  ' + d.name + '：' + data.score + '分');
    }
  });
  lines.push('');

  // CliftonStrengths
  var cs = safeGet(report, 'cliftonstrengths.topDomains', []);
  if (cs.length > 0) {
    lines.push('【优势领域】' + cs.join('、'));
    lines.push('');
  }

  lines.push('---');
  lines.push('由「自我画像」PWA 生成');
  lines.push('https://github.com/YHLLXY/self-portrait');

  return lines.join('\n');
}


/* ===================================================================
   七、主入口
   =================================================================== */

/**
 * 生成报告 — 从 IndexedDB 获取所有答案，评分，渲染报告页
 */
async function generateReport() {
  try {
    // 1. 获取所有答案
    var answers = await getAllAnswers();

    // 2. 检查是否有有效答案
    var answerCount = Object.keys(answers).length;
    if (answerCount === 0) {
      alert('还没有作答记录。请先完成一些题目再生成报告。');
      return;
    }

    // 3. 计算评分
    var report = calculateScores(answers);

    // 4. 渲染报告
    renderReport(report, answers);

    // 5. 显示报告页
    var reportPage = document.getElementById('reportPage');
    if (reportPage) {
      reportPage.removeAttribute('hidden');
      reportPage.scrollTop = 0;
    }

    // 6. 隐藏瀑布流
    var waterfall = document.getElementById('waterfall');
    if (waterfall) {
      waterfall.style.display = 'none';
    }

    console.log('[report] Report generated. Scored ' + report.meta.totalScored + ' of ' + report.meta.totalQuestions + ' questions.');
  } catch (e) {
    console.error('[report] Failed to generate report:', e);
    alert('生成报告时出错：' + e.message + '\n请刷新页面后重试。');
  }
}