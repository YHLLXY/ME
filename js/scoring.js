/* === js/scoring.js === */

/**
 * 评分引擎 — 将原始答案转换为 11 个心理学框架的结构化得分
 *
 * 输入: answers 对象 { "questionId": value, ... }
 * 输出: 结构化评分结果对象
 *
 * 依赖: QUESTIONS, DOMAINS (由 questions.js 提供，作为全局变量)
 */

/* ===================================================================
   一、框架定义
   =================================================================== */

var FRAMEWORKS = {
  bigfive: {
    name: 'Big Five 大五人格 (OCEAN)',
    shortName: '大五人格',
    dimensions: ['openness','conscientiousness','extraversion','agreeableness','neuroticism'],
    dimNames: { openness:'开放性', conscientiousness:'尽责性', extraversion:'外倾性', agreeableness:'宜人性', neuroticism:'情绪稳定性' },
    dimDescriptions: {
      openness: { high:'好奇心强，喜欢抽象思维和新体验。审美敏感，愿意质疑传统。', low:'务实传统，偏好常规而非新奇。注重具体事实而非抽象理论。' },
      conscientiousness: { high:'自律有条理，可靠负责。善于规划，追求卓越。', low:'随性灵活，不拘泥于规则。适应力强但可能缺乏条理。' },
      extraversion: { high:'社交活跃，从人群互动中获得能量。健谈外向，积极寻求刺激。', low:'内敛安静，独处时感到最舒适。偏好深度交流而非广泛社交。' },
      agreeableness: { high:'信任他人，富有同情心。乐于合作，避免冲突。', low:'独立自主，敢于质疑和竞争。说话直接，不轻易妥协。' },
      neuroticism: { high:'情绪敏感，容易焦虑和担忧。对压力反应较强，情绪起伏大。', low:'情绪平稳，抗压能力强。放松从容，不易被负面情绪困扰。' }
    }
  },
  mbti: {
    name: 'MBTI 类型指标',
    shortName: 'MBTI',
    dimensions: ['ei','sn','tf','jp'],
    dimNames: { ei:'外向(E) vs 内向(I)', sn:'实感(S) vs 直觉(N)', tf:'思考(T) vs 情感(F)', jp:'判断(J) vs 感知(P)' }
  },
  enneagram: {
    name: '九型人格',
    shortName: 'Enneagram',
    dimensions: ['type1','type2','type3','type4','type5','type6','type7','type8','type9'],
    dimNames: { type1:'完美主义者', type2:'助人者', type3:'成就者', type4:'个人主义者', type5:'探索者', type6:'忠诚者', type7:'热爱者', type8:'挑战者', type9:'和平者' }
  },
  hexaco: {
    name: 'HEXACO 六因素',
    shortName: 'HEXACO',
    dimensions: ['honesty','emotionality','extraversion','agreeableness','conscientiousness','openness'],
    dimNames: { honesty:'诚实-谦逊', emotionality:'情绪性', extraversion:'外倾性', agreeableness:'宜人性', conscientiousness:'尽责性', openness:'开放性' }
  },
  '16pf': {
    name: '卡特尔 16PF',
    shortName: '16PF',
    dimensions: ['reasoning','emotional-stability','dominance','liveliness','rule-consciousness','social-boldness','sensitivity','vigilance','abstractedness','privateness','apprehension','openness-to-change','self-reliance','perfectionism','tension'],
    dimNames: { reasoning:'推理能力', 'emotional-stability':'情绪稳定', dominance:'支配性', liveliness:'活跃性', 'rule-consciousness':'规则意识', 'social-boldness':'社交大胆', sensitivity:'敏感性', vigilance:'警惕性', abstractedness:'抽象性', privateness:'隐私性', apprehension:'忧虑性', 'openness-to-change':'变革开放', 'self-reliance':'自立性', perfectionism:'完美主义', tension:'紧张性' }
  },
  cliftonstrengths: {
    name: '盖洛普优势识别',
    shortName: 'CliftonStrengths',
    dimensions: ['executing','influencing','relationship-building','strategic-thinking'],
    dimNames: { executing:'执行力', influencing:'影响力', 'relationship-building':'关系建立', 'strategic-thinking':'战略思维' }
  },
  'goleman-eq': {
    name: 'Goleman 情商模型',
    shortName: '情商',
    dimensions: ['self-awareness','self-management','social-awareness','relationship-management'],
    dimNames: { 'self-awareness':'自我觉察', 'self-management':'自我管理', 'social-awareness':'社会觉察', 'relationship-management':'关系管理' }
  },
  schwartz: {
    name: 'Schwartz 价值观理论',
    shortName: '价值观',
    dimensions: ['benevolence','universalism','self-direction','stimulation','hedonism','achievement','power','security','conformity','tradition'],
    dimNames: { benevolence:'仁爱', universalism:'普世关怀', 'self-direction':'自主导向', stimulation:'刺激追求', hedonism:'享乐主义', achievement:'成就导向', power:'权力影响', security:'安全需求', conformity:'遵从规范', tradition:'传统尊重' }
  },
  ikigai: {
    name: 'Ikigai 生存意义',
    shortName: 'Ikigai',
    dimensions: ['passion','mission','vocation','profession'],
    dimNames: { passion:'热爱之事', mission:'世界需要', vocation:'可获得报酬', profession:'你擅长之事' }
  },
  tscs: {
    name: '田纳西自我概念量表',
    shortName: 'TSCS',
    dimensions: ['identity','satisfaction','physical','moral','social','family','self-criticism','competence'],
    dimNames: { identity:'自我认同', satisfaction:'自我满意', physical:'身体自我', moral:'道德自我', social:'社会自我', family:'家庭自我', 'self-criticism':'自我批评', competence:'能力自我' }
  },
  'narrative-psychology': {
    name: '叙事心理学',
    shortName: '叙事心理',
    dimensions: ['coherence','agency','communion','redemption','contamination','meaning-making'],
    dimNames: { coherence:'人生连贯感', agency:'能动性', communion:'共同体感', redemption:'救赎叙事', contamination:'污染叙事', 'meaning-making':'意义建构' }
  }
};


/* ===================================================================
   二、得分解释
   =================================================================== */

/**
 * 根据 0-100 分数返回文字解释
 */
function interpretScore(score) {
  if (score == null) return { label: '无数据', level: 'none' };
  if (score <= 25) return { label: '偏低', level: 'low' };
  if (score <= 40) return { label: '中等偏低', level: 'mid-low' };
  if (score <= 60) return { label: '中等', level: 'mid' };
  if (score <= 75) return { label: '中等偏高', level: 'mid-high' };
  return { label: '偏高', level: 'high' };
}


/* ===================================================================
   三、答案归一化
   =================================================================== */

/**
 * 判断 radio 型问题的 option value 是否为数字
 * （用于区分"量表式选择"和"标签式选择"）
 */
function _optionsAreNumeric(question) {
  if (!question.options || question.options.length === 0) return false;
  return question.options.every(function (opt) {
    return typeof opt.value === 'number';
  });
}

/**
 * 将单个问题的答案归一化为 0-100 分数
 * 无法打分的问题返回 null
 */
function normalizeAnswer(question, value) {
  if (value == null) return null;
  var qtype = question.type;

  // 简答/长文本 — 不计分
  if (qtype === 'shorttext' || qtype === 'longtext') return null;

  // 排序题 — 不计分
  if (qtype === 'ranking') return null;

  // 滑动条 — 直接使用 (0-100)
  if (qtype === 'slider') {
    var num = Number(value);
    if (isNaN(num)) return null;
    return Math.max(0, Math.min(100, num));
  }

  // Likert 5
  if (qtype === 'likert5') {
    var num = Number(value);
    if (isNaN(num)) return null;
    return ((num - 1) / 4) * 100;
  }

  // Likert 7
  if (qtype === 'likert7') {
    var num = Number(value);
    if (isNaN(num)) return null;
    return ((num - 1) / 6) * 100;
  }

  // 单选 — 判断 option value 类型
  if (qtype === 'radio') {
    if (_optionsAreNumeric(question)) {
      // 数字型选项 → 当作量表处理
      var num = Number(value);
      if (isNaN(num)) return null;
      // 根据选项的最大值判断是 likert5 还是 likert7
      var maxVal = 0;
      question.options.forEach(function (opt) {
        if (typeof opt.value === 'number' && opt.value > maxVal) maxVal = opt.value;
      });
      if (maxVal <= 5) {
        return ((num - 1) / 4) * 100;
      } else {
        return ((num - 1) / 6) * 100;
      }
    }
    // 字符串型选项 — 不计入数值评分（用于标签/分类）
    return null;
  }

  // 多选 — 不计入数值评分
  if (qtype === 'checkbox') return null;

  return null;
}


/* ===================================================================
   四、维度映射
   =================================================================== */

/**
 * 构建 framework:dimension → 问题数组 的映射
 * 同时返回不带 dimension 的 framework 问题列表（用于备用）
 */
function buildDimensionMap() {
  var map = {};       // "frameworkKey:dimensionKey" → [question, ...]
  var scoreCount = 0;

  QUESTIONS.forEach(function (q) {
    if (!q.framework) return;

    var fwKey = q.framework;
    var dimKey = q.dimension || '__ungrouped__';
    var mapKey = fwKey + ':' + dimKey;

    if (!map[mapKey]) map[mapKey] = [];
    map[mapKey].push(q);

    if (q.type !== 'shorttext' && q.type !== 'longtext' && q.type !== 'ranking') {
      scoreCount++;
    }
  });

  return { map: map, totalScorableQuestions: scoreCount };
}

/**
 * 获取维度→问题映射（对外接口）
 */
function getDimensionQuestions() {
  var result = buildDimensionMap();
  return result.map;
}


/* ===================================================================
   五、领域得分
   =================================================================== */

function _calculateDomainScores(answers) {
  var domainData = {};

  // 初始化每个领域
  DOMAINS.forEach(function (d) {
    domainData[d.id] = { sum: 0, scored: 0, total: 0 };
  });

  QUESTIONS.forEach(function (q) {
    var dom = q.domain;
    if (!domainData[dom]) return;

    domainData[dom].total++;

    // 只有可评分题型才计入
    var scoreableTypes = ['likert5', 'likert7', 'slider', 'radio'];
    var isScoreable = scoreableTypes.indexOf(q.type) !== -1;
    // radio 只有数字型才算可评分
    if (q.type === 'radio' && !_optionsAreNumeric(q)) isScoreable = false;

    if (!isScoreable) return;

    var val = answers[q.id];
    if (val == null) return;

    var score = normalizeAnswer(q, val);
    if (score == null) return;

    domainData[dom].sum += score;
    domainData[dom].scored++;
  });

  var result = {};
  DOMAINS.forEach(function (d) {
    var data = domainData[d.id];
    result[d.id] = {
      score: data.scored > 0 ? Math.round(data.sum / data.scored) : null,
      name: d.name,
      answered: data.scored,
      total: data.total
    };
  });

  return result;
}


/* ===================================================================
   六、框架专属处理
   =================================================================== */

/**
 * Big Five: 维度得分 + 高/低解释 + 极值高亮
 */
function _processBigFive(frameworkDimScores) {
  var dims = {};
  var highlights = [];

  FRAMEWORKS.bigfive.dimensions.forEach(function (dim) {
    var score = frameworkDimScores[dim];
    var interp = interpretScore(score);
    var desc = FRAMEWORKS.bigfive.dimDescriptions[dim];
    var interpretation = '';

    if (score != null && desc) {
      if (interp.level === 'high' || interp.level === 'mid-high') {
        interpretation = desc.high;
      } else if (interp.level === 'low' || interp.level === 'mid-low') {
        interpretation = desc.low;
      } else {
        interpretation = '处于中等水平，兼具两端的特质。';
      }
    }

    dims[dim] = {
      score: score,
      label: interp.label,
      level: interp.level,
      interpretation: interpretation
    };

    // 极值高亮
    if (score != null) {
      if (score > 75) {
        highlights.push(FRAMEWORKS.bigfive.dimNames[dim] + '显著偏高');
      } else if (score < 25) {
        highlights.push(FRAMEWORKS.bigfive.dimNames[dim] + '显著偏低');
      }
    }
  });

  var highlight = '';
  if (highlights.length > 0) {
    highlight = '你的' + highlights.join('，') + '。';
  } else {
    highlight = '你的大五人格各维度得分均处于中等范围，性格较为均衡。';
  }

  return {
    name: FRAMEWORKS.bigfive.name,
    dimensions: dims,
    highlight: highlight
  };
}

/**
 * MBTI: 四轴得分 + 四字母类型
 *
 * 每轴同时考虑:
 *   1. likert5/likert7/slider 量表题 → 归一化为 0-100
 *   2. 直接选择题 (radio with string values) → 记票
 * 混合计算: 量表分(50%) + 选择题票数(50%)
 */
function _processMBTI(answers, frameworkDimScores, dimMap) {
  // 每轴的定义: first/second 对应字母，以及量表方向
  var axes = {
    ei: { first: 'E', second: 'I', firstLetter: 'E', secondLetter: 'I' },
    sn: { first: 'S', second: 'N', firstLetter: 'S', secondLetter: 'N' },
    tf: { first: 'T', second: 'F', firstLetter: 'T', secondLetter: 'F' },
    jp: { first: 'J', second: 'P', firstLetter: 'J', secondLetter: 'P' }
  };

  var dimScores = {};
  var mbType = '';

  FRAMEWORKS.mbti.dimensions.forEach(function (axis) {
    // 1. 量表题得分（高分为 second letter 方向，需翻转）
    var rawScore = frameworkDimScores[axis];

    // 2. 收集直接选择题的投票
    var choiceVotes = { first: 0, second: 0 };
    var mapKey = 'mbti:' + axis;
    var questions = (dimMap && dimMap[mapKey]) ? dimMap[mapKey] : [];

    questions.forEach(function (q) {
      var val = answers[q.id];
      if (val == null) return;

      if (q.type === 'radio' && !_optionsAreNumeric(q)) {
        // 直接选择题
        var axisDef = axes[axis];
        if (val === axisDef.firstLetter.toLowerCase()) {
          choiceVotes.first++;
        } else if (val === axisDef.secondLetter.toLowerCase()) {
          choiceVotes.second++;
        }
        // 'both' 等值不计入
      }
    });

    // 3. 计算选择题分 (0-100, >50 = first letter)
    var choiceScore = null;
    var totalChoices = choiceVotes.first + choiceVotes.second;
    if (totalChoices > 0) {
      choiceScore = Math.round((choiceVotes.first / totalChoices) * 100);
    }

    // 4. 翻转量表分 (量表题高分→second letter, 转为高分→first letter)
    var flippedScaleScore = null;
    if (rawScore != null) {
      flippedScaleScore = 100 - rawScore;
    }

    // 5. 混合得分
    var combinedScore;
    if (flippedScaleScore != null && choiceScore != null) {
      combinedScore = Math.round((flippedScaleScore + choiceScore) / 2);
    } else if (flippedScaleScore != null) {
      combinedScore = flippedScaleScore;
    } else if (choiceScore != null) {
      combinedScore = choiceScore;
    } else {
      combinedScore = null;
    }

    dimScores[axis] = combinedScore;

    // 6. 判定类型字母 (>50 = first letter, <=50 = second letter)
    if (combinedScore != null) {
      mbType += (combinedScore > 50) ? axes[axis].firstLetter : axes[axis].secondLetter;
    } else {
      mbType += '?';
    }
  });

  return {
    type: mbType,
    dimensions: dimScores,
    name: FRAMEWORKS.mbti.name
  };
}

/**
 * Enneagram: 最高分类型 + 翼型 (相邻类型中次高分)
 */
function _processEnneagram(frameworkDimScores) {
  var dims = FRAMEWORKS.enneagram.dimensions;
  var scores = {};

  dims.forEach(function (dim) {
    scores[dim] = frameworkDimScores[dim];
  });

  // 找最高分
  var primary = null;
  var primaryScore = -1;
  dims.forEach(function (dim) {
    if (scores[dim] != null && scores[dim] > primaryScore) {
      primaryScore = scores[dim];
      primary = dim;
    }
  });

  // 找翼型（相邻类型，type1与type9不相邻）
  var wing = null;
  if (primary) {
    var typeNum = parseInt(primary.replace('type', ''), 10);
    var adjacent = [];
    if (typeNum === 1) {
      adjacent = ['type2', 'type9'];
    } else if (typeNum === 9) {
      adjacent = ['type8', 'type1'];
    } else {
      adjacent = ['type' + (typeNum - 1), 'type' + (typeNum + 1)];
    }

    var wingScore = -1;
    adjacent.forEach(function (adj) {
      if (scores[adj] != null && scores[adj] > wingScore) {
        wingScore = scores[adj];
        wing = adj;
      }
    });
  }

  // 排序（用于显示）
  var sorted = dims.slice().sort(function (a, b) {
    return (scores[b] || 0) - (scores[a] || 0);
  });

  return {
    name: FRAMEWORKS.enneagram.name,
    primary: primary,
    primaryName: primary ? FRAMEWORKS.enneagram.dimNames[primary] : null,
    primaryScore: primaryScore >= 0 ? primaryScore : null,
    wing: wing,
    wingName: wing ? FRAMEWORKS.enneagram.dimNames[wing] : null,
    wingScore: wing ? scores[wing] : null,
    scores: scores,
    sorted: sorted.map(function (d) {
      return { type: d, name: FRAMEWORKS.enneagram.dimNames[d], score: scores[d] };
    })
  };
}

/**
 * CliftonStrengths: 维度排名 + 前5领域
 */
function _processCliftonStrengths(frameworkDimScores) {
  var dims = {};
  var arr = [];

  FRAMEWORKS.cliftonstrengths.dimensions.forEach(function (dim) {
    var score = frameworkDimScores[dim];
    dims[dim] = { score: score, label: interpretScore(score).label };
    if (score != null) {
      arr.push({ dim: dim, name: FRAMEWORKS.cliftonstrengths.dimNames[dim], score: score });
    }
  });

  arr.sort(function (a, b) { return b.score - a.score; });

  return {
    name: FRAMEWORKS.cliftonstrengths.name,
    dimensions: dims,
    ranked: arr,
    topDomains: arr.slice(0, 5).map(function (item) { return item.name; })
  };
}

/**
 * Schwartz: 维度得分 + 最高价值观
 */
function _processSchwartz(frameworkDimScores) {
  var dims = {};
  var arr = [];

  FRAMEWORKS.schwartz.dimensions.forEach(function (dim) {
    var score = frameworkDimScores[dim];
    dims[dim] = { score: score, label: interpretScore(score).label };
    if (score != null) {
      arr.push({ dim: dim, name: FRAMEWORKS.schwartz.dimNames[dim], score: score });
    }
  });

  arr.sort(function (a, b) { return b.score - a.score; });

  return {
    name: FRAMEWORKS.schwartz.name,
    dimensions: dims,
    topValues: arr.filter(function (item) { return item.score > 70; }).map(function (item) { return item.name; }),
    ranked: arr
  };
}

/**
 * Ikigai: 四圆得分
 */
function _processIkigai(frameworkDimScores) {
  var dims = {};
  var highestCircle = null;
  var highestScore = -1;

  FRAMEWORKS.ikigai.dimensions.forEach(function (dim) {
    var score = frameworkDimScores[dim];
    dims[dim] = { score: score, label: interpretScore(score).label };
    if (score != null && score > highestScore) {
      highestScore = score;
      highestCircle = dim;
    }
  });

  return {
    name: FRAMEWORKS.ikigai.name,
    dimensions: dims,
    highestCircle: highestCircle,
    highestCircleName: highestCircle ? FRAMEWORKS.ikigai.dimNames[highestCircle] : null
  };
}

/**
 * 通用维度得分处理（适用于 HEXACO, 16PF, Goleman-EQ, TSCS, Narrative Psychology）
 */
function _processGeneric(fwKey, frameworkDimScores) {
  var fw = FRAMEWORKS[fwKey];
  if (!fw) return null;

  var dims = {};
  fw.dimensions.forEach(function (dim) {
    var score = frameworkDimScores[dim];
    dims[dim] = { score: score, label: interpretScore(score).label };
  });

  return {
    name: fw.name,
    dimensions: dims
  };
}


/* ===================================================================
   七、标签提取
   =================================================================== */

function _extractTags(results) {
  var tags = [];

  // Big Five 极值 (>80 正面标签, <20 中性/发展标签)
  if (results.bigfive && results.bigfive.dimensions) {
    var bf = results.bigfive.dimensions;
    Object.keys(bf).forEach(function (dim) {
      var s = bf[dim].score;
      if (s == null) return;
      if (s >= 80) {
        tags.push(FRAMEWORKS.bigfive.dimNames[dim] + '强');
      } else if (s < 20) {
        tags.push(FRAMEWORKS.bigfive.dimNames[dim] + '待发展');
      }
    });
  }

  // Enneagram 主类型
  if (results.enneagram && results.enneagram.primaryName) {
    tags.push(results.enneagram.primaryName);
  }

  // CliftonStrengths 前5领域
  if (results.cliftonstrengths && results.cliftonstrengths.topDomains) {
    results.cliftonstrengths.topDomains.forEach(function (name) {
      tags.push(name + '强');
    });
  }

  // Schwartz 高价值观 (>70)
  if (results.schwartz && results.schwartz.topValues) {
    results.schwartz.topValues.forEach(function (name) {
      tags.push(name);
    });
  }

  // Ikigai 最高圆
  if (results.ikigai && results.ikigai.highestCircleName) {
    tags.push(results.ikigai.highestCircleName + '主导');
  }

  return tags;
}

/**
 * 提取优势标签（用于顶部展示）
 */
function _extractTopStrengths(results) {
  var strengths = [];
  var all = [];

  // 收集所有带分数的维度
  function addScores(fwKey, resultKey) {
    var fw = FRAMEWORKS[fwKey];
    var res = results[resultKey || fwKey];
    if (!fw || !res) return;

    var dims = res.dimensions || res.scores || {};
    Object.keys(dims).forEach(function (dim) {
      var score = dims[dim];
      if (typeof score === 'object' && score.score != null) {
        score = score.score;
      }
      if (typeof score === 'number') {
        var name = (fw.dimNames && fw.dimNames[dim]) ? fw.dimNames[dim] : dim;
        all.push({ name: name, score: score });
      }
    });
  }

  addScores('bigfive');
  addScores('cliftonstrengths');
  addScores('goleman-eq');
  addScores('hexaco');
  // Enneagram 分数也用 dimNames
  if (results.enneagram && results.enneagram.scores) {
    Object.keys(results.enneagram.scores).forEach(function (dim) {
      var s = results.enneagram.scores[dim];
      if (typeof s === 'number') {
        all.push({ name: FRAMEWORKS.enneagram.dimNames[dim] || dim, score: s });
      }
    });
  }

  all.sort(function (a, b) { return b.score - a.score; });

  return all.slice(0, 6).map(function (item) { return item.name; });
}


/* ===================================================================
   八、主入口函数
   =================================================================== */

/**
 * 计算所有评分
 * @param {Object} answers — 答案映射 { "questionId": value, ... }
 * @returns {Object} 结构化评分结果
 */
function calculateScores(answers) {
  if (!answers) answers = {};

  // --- 1. 构建维度映射 ---
  var dimData = buildDimensionMap();
  var dimMap = dimData.map;

  // --- 2. 逐维度计算得分 ---
  // allDimensionScores: { "framework:dimension": score }
  var allDimScores = {};

  Object.keys(dimMap).forEach(function (mapKey) {
    var parts = mapKey.split(':');
    var fwKey = parts[0];
    var dimKey = parts.slice(1).join(':'); // 处理 dimension 本身可能含冒号
    var questions = dimMap[mapKey];

    var sum = 0;
    var count = 0;

    questions.forEach(function (q) {
      var val = answers[q.id];
      if (val == null) return;

      var score = normalizeAnswer(q, val);
      if (score == null) return;

      sum += score;
      count++;
    });

    if (count > 0) {
      allDimScores[mapKey] = Math.round(sum / count);
    }
  });

  // --- 3. 按框架汇总维度得分 ---
  // frameworkDimScores: { "frameworkKey": { "dimension": score } }
  var frameworkDimMap = {};
  Object.keys(allDimScores).forEach(function (mapKey) {
    var parts = mapKey.split(':');
    var fwKey = parts[0];
    var dimKey = parts.slice(1).join(':');

    if (!frameworkDimMap[fwKey]) frameworkDimMap[fwKey] = {};
    frameworkDimMap[fwKey][dimKey] = allDimScores[mapKey];
  });

  // --- 4. 框架级处理 ---
  var results = {};

  // Big Five
  results.bigfive = _processBigFive(frameworkDimMap['bigfive'] || {});

  // MBTI
  results.mbti = _processMBTI(answers, frameworkDimMap['mbti'] || {}, dimMap);

  // Enneagram
  results.enneagram = _processEnneagram(frameworkDimMap['enneagram'] || {});

  // HEXACO
  results.hexaco = _processGeneric('hexaco', frameworkDimMap['hexaco'] || {});

  // 16PF
  results['16pf'] = _processGeneric('16pf', frameworkDimMap['16pf'] || {});

  // CliftonStrengths
  results.cliftonstrengths = _processCliftonStrengths(frameworkDimMap['cliftonstrengths'] || {});

  // Goleman EQ
  results['goleman-eq'] = _processGeneric('goleman-eq', frameworkDimMap['goleman-eq'] || {});

  // Schwartz
  results.schwartz = _processSchwartz(frameworkDimMap['schwartz'] || {});

  // Ikigai
  results.ikigai = _processIkigai(frameworkDimMap['ikigai'] || {});

  // TSCS
  results.tscs = _processGeneric('tscs', frameworkDimMap['tscs'] || {});

  // Narrative Psychology
  results['narrative-psychology'] = _processGeneric('narrative-psychology', frameworkDimMap['narrative-psychology'] || {});

  // --- 5. 领域得分 ---
  var domains = _calculateDomainScores(answers);

  // --- 6. 标签 & 优势 ---
  var tagged = _extractTags(results);
  var topStrengths = _extractTopStrengths(results);

  // --- 7. 元信息 ---
  var totalQuestions = QUESTIONS.length;
  var totalScored = Objects.keys(answers).filter(function (qid) {
    var q = QUESTIONS.find(function (q) { return q.id === qid; });
    if (!q) return false;
    var val = answers[qid];
    if (val == null) return false;
    return normalizeAnswer(q, val) != null;
  }).length;

  var meta = {
    totalScored: totalScored,
    totalQuestions: totalQuestions,
    tagged: tagged,
    topStrengths: topStrengths,
    calculatedAt: new Date().toISOString()
  };

  // --- 8. 组装最终结果 ---
  var fullResult = {
    bigfive: results.bigfive,
    mbti: results.mbti,
    enneagram: results.enneagram,
    hexaco: results.hexaco,
    '16pf': results['16pf'],
    cliftonstrengths: results.cliftonstrengths,
    'goleman-eq': results['goleman-eq'],
    schwartz: results.schwartz,
    ikigai: results.ikigai,
    tscs: results.tscs,
    'narrative-psychology': results['narrative-psychology'],
    domains: domains,
    meta: meta
  };

  return fullResult;
}