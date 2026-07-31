/* === js/questions.js === */

/**
 * 单题数据结构
 * @typedef {Object} Question
 * @property {string} id          - 唯一标识：{domain}-{index}
 * @property {string} domain      - 六大领域之一
 * @property {string} layer       - factual | perceptual | narrative
 * @property {string} [framework] - 关联的心理学框架
 * @property {string} [dimension] - 框架内的维度
 * @property {string} type        - likert5|likert7|radio|checkbox|ranking|shorttext|longtext|slider
 * @property {string} text        - 题面
 * @property {Array} [options]    - 选项列表（量表/选择/排序题）
 * @property {boolean} [required] - 是否必答，默认 false
 * @property {number} [maxLength] - 简答题字数上限
 */

/* ===== 领域配置 ===== */
const DOMAINS = [
  { id: 'identity', name: '身份根基', emoji: '🪪', questions: 60 },
  { id: 'mind',     name: '思维心智', emoji: '🧠', questions: 65 },
  { id: 'emotion',  name: '情感关系', emoji: '💙', questions: 62 },
  { id: 'ability',  name: '能力行动', emoji: '🔧', questions: 70 },
  { id: 'passion',  name: '热情驱动', emoji: '🔥', questions: 63 },
  { id: 'history',  name: '成长叙事', emoji: '📖', questions: 80 }
];

/* ===== 全部题目（400 题，按领域分组） ===== */
const QUESTIONS = [

  /* ========================================================
     一、身份根基 (60 题)
     框架引用：TSCS, Schwartz PVQ, HEXACO H因子
     ======================================================== */

  // --- 事实层 12 题 ---
  { id:'identity-001', domain:'identity', layer:'factual', type:'radio',
    text:'你的性别是？', options:[
      {value:'male',label:'男'},{value:'female',label:'女'},{value:'other',label:'其他'},{value:'prefer-not',label:'不愿透露'}], required:true },
  { id:'identity-002', domain:'identity', layer:'factual', type:'radio',
    text:'你目前所处的年龄段是？', options:[
      {value:'under18',label:'18 岁以下'},{value:'18-22',label:'18-22 岁'},{value:'23-30',label:'23-30 岁'},{value:'30plus',label:'30 岁以上'}], required:true },
  { id:'identity-003', domain:'identity', layer:'factual', type:'radio',
    text:'你的成长环境主要属于？', options:[
      {value:'urban',label:'城市'},{value:'town',label:'城镇'},{value:'rural',label:'农村'},{value:'mixed',label:'多次迁徙'}], required:false },
  { id:'identity-004', domain:'identity', layer:'factual', type:'radio',
    text:'你的家庭结构是？', options:[
      {value:'nuclear',label:'核心家庭（父母+子女）'},{value:'extended',label:'大家庭（祖辈同住）'},{value:'single-parent',label:'单亲家庭'},{value:'other',label:'其他'}], required:false },
  { id:'identity-005', domain:'identity', layer:'factual', type:'checkbox',
    text:'你认为以下哪些身份标签最能描述你？（可多选）', options:[
      {value:'student',label:'学生'},{value:'developer',label:'开发者'},{value:'leader',label:'团队负责人'},{value:'mentor',label:'学长/导师'},{value:'creator',label:'创造者'},{value:'learner',label:'终身学习者'},{value:'friend',label:'朋友'},{value:'child',label:'子女'}], required:false },
  { id:'identity-006', domain:'identity', layer:'factual', type:'radio',
    text:'你是否有宗教信仰？', options:[
      {value:'none',label:'无'},{value:'buddhism',label:'佛教'},{value:'christianity',label:'基督教'},{value:'islam',label:'伊斯兰教'},{value:'other',label:'其他'},{value:'spiritual',label:'有灵性信仰但不属特定宗教'}], required:false },
  { id:'identity-007', domain:'identity', layer:'factual', type:'radio',
    text:'你的政治立场倾向于？', options:[
      {value:'left',label:'偏左（强调平等、社会正义）'},{value:'center',label:'中间'},{value:'right',label:'偏右（强调自由、传统）'},{value:'apolitical',label:'不太关心政治'},{value:'uncertain',label:'不确定'}], required:false },
  { id:'identity-008', domain:'identity', layer:'factual', type:'checkbox',
    text:'以下哪些经历你曾有过？（可多选）', options:[
      {value:'lived-alone',label:'独自居住'},{value:'traveled-alone',label:'独自旅行'},{value:'studied-abroad',label:'异地求学'},{value:'job',label:'实习/兼职'},{value:'volunteer',label:'志愿服务'},{value:'competition',label:'大型比赛'}], required:false },
  { id:'identity-009', domain:'identity', layer:'factual', type:'radio',
    text:'你对自己身体的满意程度？', options:[
      {value:1,label:'非常不满意'},{value:2,label:'不太满意'},{value:3,label:'一般'},{value:4,label:'比较满意'},{value:5,label:'非常满意'}], required:false, framework:'tscs', dimension:'physical' },
  { id:'identity-010', domain:'identity', layer:'factual', type:'radio',
    text:'你每天花多少时间独处？', options:[
      {value:'lt1h',label:'少于 1 小时'},{value:'1-3h',label:'1-3 小时'},{value:'3-6h',label:'3-6 小时'},{value:'gt6h',label:'6 小时以上'}], required:false },
  { id:'identity-011', domain:'identity', layer:'factual', type:'radio',
    text:'你觉得自己的道德标准主要来源于？', options:[
      {value:'family',label:'家庭教育'},{value:'education',label:'学校教育'},{value:'experience',label:'个人经历'},{value:'reflection',label:'自己的反思'},{value:'religion',label:'宗教信仰'},{value:'society',label:'社会规范'}], required:false, framework:'tscs', dimension:'moral' },
  { id:'identity-012', domain:'identity', layer:'factual', type:'ranking',
    text:'请按"构成你身份认同的重要性"排列以下方面', options:[
      {value:'family',label:'家庭角色'},{value:'career',label:'学业/职业'},{value:'values',label:'个人价值观'},{value:'community',label:'社群归属'},{value:'hobbies',label:'兴趣爱好'}], required:false },

  // --- 感知层 28 题 ---
  { id:'identity-013', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我清楚知道自己是一个什么样的人', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'identity' },
  { id:'identity-014', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我对自己目前的样子感到满意', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'satisfaction' },
  { id:'identity-015', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我经常思考"人生的意义是什么"这类问题', options:[{value:1,label:'从不'},{value:5,label:'经常'}], required:false, framework:'bigfive', dimension:'openness' },
  { id:'identity-016', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我有一套清晰的价值体系来指导决策', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'schwartz' },
  { id:'identity-017', domain:'identity', layer:'perceptual', type:'likert7',
    text:'诚实对我来说有多重要？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'hexaco', dimension:'honesty' },
  { id:'identity-018', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我有时会为了取悦他人而违背自己的原则', options:[{value:1,label:'从不'},{value:5,label:'经常'}], required:false, framework:'hexaco', dimension:'honesty' },
  { id:'identity-019', domain:'identity', layer:'perceptual', type:'likert5',
    text:'面对道德困境时，我倾向于坚持原则而非灵活处理', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'moral' },
  { id:'identity-020', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"公平"在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'universalism' },
  { id:'identity-021', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"自由"在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'self-direction' },
  { id:'identity-022', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"传统"在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'tradition' },
  { id:'identity-023', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"成就"在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'achievement' },
  { id:'identity-024', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"安全"在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'security' },
  { id:'identity-025', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"仁爱"（关心他人福祉）在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'benevolence' },
  { id:'identity-026', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"权力"（影响和控制）在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'power' },
  { id:'identity-027', domain:'identity', layer:'perceptual', type:'likert7',
    text:'"刺激"（冒险和兴奋）在你的价值体系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'stimulation' },
  { id:'identity-028', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我认为自己是真诚的，不伪装', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'hexaco', dimension:'honesty' },
  { id:'identity-029', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我经常自我怀疑，不确定自己做得对不对', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'bigfive', dimension:'neuroticism' },
  { id:'identity-030', domain:'identity', layer:'perceptual', type:'likert5',
    text:'比起社会认可，我更看重自己内心的标准', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'ikigai' },
  { id:'identity-031', domain:'identity', layer:'perceptual', type:'slider',
    text:'你对自己"是一个好人"的信念程度', options:[{value:0,label:'我经常怀疑'},{value:50,label:''},{value:100,label:'我深信不疑'}], required:false, framework:'tscs', dimension:'moral' },
  { id:'identity-032', domain:'identity', layer:'perceptual', type:'slider',
    text:'你的"理想自我"与"现实自我"的吻合度', options:[{value:0,label:'完全割裂'},{value:50,label:''},{value:100,label:'完全吻合'}], required:false, framework:'tscs' },
  { id:'identity-033', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我清楚自己的弱点，并愿意承认它们', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'self-criticism' },
  { id:'identity-034', domain:'identity', layer:'perceptual', type:'likert5',
    text:'社会热点事件会让我反复思考自己的立场', options:[{value:1,label:'从不'},{value:5,label:'经常'}], required:false },
  { id:'identity-035', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我认为人的命运主要由自己掌控', options:[{value:1,label:'完全不同意'},{value:5,label:'完全同意'}], required:false, framework:'bigfive', dimension:'openness' },
  { id:'identity-036', domain:'identity', layer:'perceptual', type:'likert5',
    text:'在面对人生的重大选择时，我清楚什么对自己最重要', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'identity' },
  { id:'identity-037', domain:'identity', layer:'perceptual', type:'radio',
    text:'以下哪种描述最接近你的自我认知？', options:[
      {value:'stable',label:'我核心的样子一直没怎么变'},{value:'evolving',label:'我一直在进化，不同阶段有不同的我'},{value:'multi',label:'我在不同环境中展现不同的自己'},{value:'searching',label:'我还在探索自己到底是谁'}], required:false },
  { id:'identity-038', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我相信"人性本善"', options:[{value:1,label:'完全不同意'},{value:5,label:'完全同意'}], required:false, framework:'bigfive', dimension:'agreeableness' },
  { id:'identity-039', domain:'identity', layer:'perceptual', type:'likert5',
    text:'我觉得自己是一个有魅力的人（不只外表）', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'physical' },
  { id:'identity-040', domain:'identity', layer:'perceptual', type:'likert5',
    text:'别人眼中的我和我眼中的自己，应该很不一样', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'social' },

  // --- 叙事层 20 题 ---
  { id:'identity-041', domain:'identity', layer:'narrative', type:'shorttext',
    text:'用一段话描述"你是谁"——抛开名字和身份标签', maxLength:300, required:false },
  { id:'identity-042', domain:'identity', layer:'narrative', type:'longtext',
    text:'你人生中最重要的三个价值观是什么？各举一个具体例子说明它们是如何形成的', required:false },
  { id:'identity-043', domain:'identity', layer:'narrative', type:'longtext',
    text:'描述一次你必须在"做正确的事"和"做容易的事"之间做出选择的经历。你选择了什么？后来回头看，你对自己的选择满意吗？', required:false },
  { id:'identity-044', domain:'identity', layer:'narrative', type:'shorttext',
    text:'如果请你用 5 个关键词定义自己的核心身份，它们会是？', maxLength:150, required:false },
  { id:'identity-045', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你理想中的自己是什么样子？', maxLength:300, required:false },
  { id:'identity-046', domain:'identity', layer:'narrative', type:'longtext',
    text:'有没有一件事/一个人/一本书从根本上改变了你对自己或世界的看法？请详细描述', required:false },
  { id:'identity-047', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你最大的自我矛盾是什么？（例如：渴望自由又害怕不确定性）', maxLength:200, required:false },
  { id:'identity-048', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你觉得别人最容易误解你的地方是什么？', maxLength:200, required:false },
  { id:'identity-049', domain:'identity', layer:'narrative', type:'longtext',
    text:'你对"社会责任感"的理解是什么？你认为自己在这方面做得怎样？', required:false },
  { id:'identity-050', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你最不能容忍自己身上哪些特质？为什么？', maxLength:200, required:false },
  { id:'identity-051', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你觉得自己的"灵魂年龄"是几岁？为什么？', maxLength:200, required:false },
  { id:'identity-052', domain:'identity', layer:'narrative', type:'shorttext',
    text:'如果可以重新选择，你会改变自己身上的哪一点？', maxLength:200, required:false },
  { id:'identity-053', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你最引以为傲的个人品质是什么？', maxLength:150, required:false },
  { id:'identity-054', domain:'identity', layer:'narrative', type:'longtext',
    text:'你对"死亡"这件事的看法是什么？这种看法如何影响了你现在的生活方式？', required:false },
  { id:'identity-055', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你认为自己的存在给身边的人带来了什么？', maxLength:200, required:false },
  { id:'identity-056', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你有没有一直想做但不敢做的事？是什么阻止了你？', maxLength:300, required:false },
  { id:'identity-057', domain:'identity', layer:'narrative', type:'longtext',
    text:'你如何看待"道德相对主义"——即认为道德标准因文化/情境而异？你认同吗？请举例说明你的立场', required:false },
  { id:'identity-058', domain:'identity', layer:'narrative', type:'shorttext',
    text:'你最想被后人记住的一点是什么？', maxLength:200, required:false },
  { id:'identity-059', domain:'identity', layer:'narrative', type:'shorttext',
    text:'如果写一本关于你自己的书，书名会是什么？', maxLength:100, required:false },
  { id:'identity-060', domain:'identity', layer:'narrative', type:'shorttext',
    text:'现在，重新回答第 41 题——经过这几十道题之后，你对"你是谁"的定义有变化吗？', maxLength:300, required:false },

  /* ========================================================
     后续 5 个领域（共 340 题）在后续任务中补齐
     二、思维心智 (65 题) — 框架引用：Big Five, MBTI, 16PF, Enneagram
     三、情感关系 (62 题) — 框架引用：Goleman EQ, TSCS, Big Five Agreeableness
     四、能力行动 (70 题) — 框架引用：CliftonStrengths 34, TSCS, 16PF
     五、热情驱动 (63 题) — 框架引用：Ikigai, Schwartz, Enneagram
     六、成长叙事 (80 题) — 框架引用：叙事心理学, Ikigai
     ======================================================== */
];