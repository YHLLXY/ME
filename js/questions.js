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
     二、思维心智 (65 题)
     框架引用：Big Five, MBTI, 16PF, Enneagram
     ======================================================== */

  // --- 事实层 18 题 ---
  { id:'mind-001', domain:'mind', layer:'factual', type:'radio',
    text:'你的最高学历（或在读）是？', options:[
      {value:'highschool',label:'高中及以下'},{value:'associate',label:'大专'},{value:'bachelor',label:'本科'},{value:'master',label:'硕士'},{value:'doctor',label:'博士'}], required:true },
  { id:'mind-002', domain:'mind', layer:'factual', type:'radio',
    text:'你的专业领域属于？', options:[
      {value:'science',label:'理学'},{value:'engineering',label:'工学'},{value:'medicine',label:'医学'},{value:'humanities',label:'人文社科'},{value:'arts',label:'艺术'},{value:'business',label:'经管'},{value:'other',label:'其他'}], required:false },
  { id:'mind-003', domain:'mind', layer:'factual', type:'radio',
    text:'你每天课外学习（自学、阅读、网课等）的时间大约是多少？', options:[
      {value:'lt30m',label:'少于 30 分钟'},{value:'30m-1h',label:'30 分钟-1 小时'},{value:'1-2h',label:'1-2 小时'},{value:'2-4h',label:'2-4 小时'},{value:'gt4h',label:'4 小时以上'}], required:false },
  { id:'mind-004', domain:'mind', layer:'factual', type:'checkbox',
    text:'你常用的学习方式有哪些？（可多选）', options:[
      {value:'reading',label:'阅读书籍/论文'},{value:'video',label:'看视频教程'},{value:'practice',label:'动手实践/做项目'},{value:'discuss',label:'与人讨论'},{value:'teach',label:'教别人（费曼学习法）'},{value:'note',label:'做笔记/思维导图'},{value:'flashcard',label:'闪卡/间隔重复'}], required:false },
  { id:'mind-005', domain:'mind', layer:'factual', type:'radio',
    text:'你做笔记的习惯是？', options:[
      {value:'detailed',label:'详细记录，条理清晰'},{value:'mindmap',label:'画思维导图'},{value:'rough',label:'只记关键点'},{value:'none',label:'基本不做笔记'},{value:'digital',label:'用数字工具（Notion/Obsidian等）'}], required:false },
  { id:'mind-006', domain:'mind', layer:'factual', type:'radio',
    text:'做重要决定时，你更倾向于？', options:[
      {value:'logic',label:'罗列利弊，理性分析'},{value:'intuition',label:'跟随直觉'},{value:'consult',label:'咨询他人意见'},{value:'delay',label:'能拖就拖'},{value:'mixed',label:'先直觉判断，再理性验证'}], required:false },
  { id:'mind-007', domain:'mind', layer:'factual', type:'radio',
    text:'面对一个复杂问题，你的第一反应通常是？', options:[
      {value:'breakdown',label:'拆解成小问题逐一解决'},{value:'analogy',label:'联想类似的已知问题'},{value:'research',label:'先搜集信息再动手'},{value:'trial',label:'直接试错'},{value:'ask',label:'找有经验的人请教'}], required:false },
  { id:'mind-008', domain:'mind', layer:'factual', type:'radio',
    text:'你对风险的偏好是？', options:[
      {value:'averse',label:'尽量规避风险，追求稳妥'},{value:'cautious',label:'谨慎但可接受可控风险'},{value:'neutral',label:'视情况而定'},{value:'seeking',label:'偏好高风险高回报'},{value:'oblivious',label:'很少考虑风险因素'}], required:false },
  { id:'mind-009', domain:'mind', layer:'factual', type:'radio',
    text:'你一年大约读多少本书（不含教材）？', options:[
      {value:'lt5',label:'少于 5 本'},{value:'5-12',label:'5-12 本'},{value:'12-24',label:'12-24 本'},{value:'24-50',label:'24-50 本'},{value:'gt50',label:'50 本以上'}], required:false },
  { id:'mind-010', domain:'mind', layer:'factual', type:'checkbox',
    text:'你主要阅读哪些类型的书？（可多选）', options:[
      {value:'literature',label:'文学小说'},{value:'social',label:'社会科学/历史'},{value:'tech',label:'科技/计算机'},{value:'philosophy',label:'哲学/思想'},{value:'selfhelp',label:'个人成长/心理学'},{value:'business',label:'商业/经济'},{value:'comic',label:'漫画/轻小说'}], required:false },
  { id:'mind-011', domain:'mind', layer:'factual', type:'radio',
    text:'你获取新闻资讯的主要渠道是？', options:[
      {value:'social',label:'微博/微信/知乎等社交平台'},{value:'video',label:'B站/抖音等视频平台'},{value:'newsapp',label:'新闻类 App'},{value:'rss',label:'RSS/Newsletter'},{value:'friends',label:'朋友/群聊转发'},{value:'none',label:'基本不主动看新闻'}], required:false },
  { id:'mind-012', domain:'mind', layer:'factual', type:'radio',
    text:'你每天花在社交媒体上的时间大约是？', options:[
      {value:'lt30m',label:'少于 30 分钟'},{value:'30m-1h',label:'30 分钟-1 小时'},{value:'1-2h',label:'1-2 小时'},{value:'2-4h',label:'2-4 小时'},{value:'gt4h',label:'4 小时以上'}], required:false },
  { id:'mind-013', domain:'mind', layer:'factual', type:'radio',
    text:'遇到不懂的知识点，你通常会？', options:[
      {value:'search',label:'马上搜索'},{value:'note',label:'先记下来，有空再查'},{value:'ask',label:'直接问懂的人'},{value:'skip',label:'如果不是必需的，跳过'},{value:'deepdive',label:'顺藤摸瓜深入研究'}], required:false },
  { id:'mind-014', domain:'mind', layer:'factual', type:'radio',
    text:'你更偏好哪种思维方式？', options:[
      {value:'deductive',label:'演绎——从一般原理推导具体结论'},{value:'inductive',label:'归纳——从具体案例总结规律'},{value:'abductive',label:'溯因——从结果反推最可能的原因'},{value:'analogical',label:'类比——用熟悉的事物理解陌生的'},{value:'intuitive',label:'直觉——说不清楚但就是觉得对'}], required:false },
  { id:'mind-015', domain:'mind', layer:'factual', type:'radio',
    text:'你认为自己的记忆力属于？', options:[
      {value:'excellent',label:'很好——记住细节毫不费力'},{value:'good',label:'还可以——理解后能记住'},{value:'average',label:'一般——重要的能记住'},{value:'poor',label:'不太好——经常忘事'},{value:'selective',label:'有选择性——感兴趣的记得特别牢'}], required:false },
  { id:'mind-016', domain:'mind', layer:'factual', type:'checkbox',
    text:'你平时使用哪些工具辅助思考和知识管理？（可多选）', options:[
      {value:'notion',label:'Notion'},{value:'obsidian',label:'Obsidian/Logseq'},{value:'mindmap',label:'思维导图工具'},{value:'notes',label:'系统自带备忘录'},{value:'paper',label:'纸笔'},{value:'none',label:'不怎么用工具'}], required:false },
  { id:'mind-017', domain:'mind', layer:'factual', type:'radio',
    text:'你学习一门新知识时，更看重？', options:[
      {value:'system',label:'建立完整的知识体系'},{value:'practical',label:'能马上用起来'},{value:'fun',label:'有趣比有用更重要'},{value:'depth',label:'把一个点挖深挖透'},{value:'breadth',label:'广泛涉猎，建立知识地图'}], required:false },
  { id:'mind-018', domain:'mind', layer:'factual', type:'ranking',
    text:'请按"你获取新知识的重要性"排列以下渠道', options:[
      {value:'books',label:'书籍'},{value:'courses',label:'课程/讲座'},{value:'peers',label:'同行/朋友交流'},{value:'practice',label:'亲身实践'},{value:'online',label:'网络文章/视频'}], required:false },

  // --- 感知层 32 题 ---
  // Big Five: openness (4题)
  { id:'mind-019', domain:'mind', layer:'perceptual', type:'likert5',
    text:'我对抽象概念和理论有天然的兴趣', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'bigfive', dimension:'openness' },
  { id:'mind-020', domain:'mind', layer:'perceptual', type:'likert5',
    text:'我喜欢尝试用全新的方法解决问题，而不是沿用老办法', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'bigfive', dimension:'openness' },
  { id:'mind-021', domain:'mind', layer:'perceptual', type:'likert7',
    text:'艺术和美在你的生活中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'bigfive', dimension:'openness' },
  { id:'mind-022', domain:'mind', layer:'perceptual', type:'likert5',
    text:'我的思维经常从一个想法跳跃到另一个看似无关的想法', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'bigfive', dimension:'openness' },
  // Big Five: conscientiousness (4题)
  { id:'mind-023', domain:'mind', layer:'perceptual', type:'likert5',
    text:'我在开始一项任务之前会做详细的计划', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'bigfive', dimension:'conscientiousness' },
  { id:'mind-024', domain:'mind', layer:'perceptual', type:'likert5',
    text:'即使没有外部截止日期，我也能保持高效推进', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'bigfive', dimension:'conscientiousness' },
  { id:'mind-025', domain:'mind', layer:'perceptual', type:'likert5',
    text:'我的桌面/房间通常是整洁有序的', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'bigfive', dimension:'conscientiousness' },
  { id:'mind-026', domain:'mind', layer:'perceptual', type:'likert7',
    text:'"自律"对你来说有多重要？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'bigfive', dimension:'conscientiousness' },
  // Big Five: extraversion (2题)
  { id:'mind-027', domain:'mind', layer:'perceptual', type:'likert5',
    text:'在头脑风暴的讨论中，我通常是发言最多的那个人', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'bigfive', dimension:'extraversion' },
  { id:'mind-028', domain:'mind', layer:'perceptual', type:'likert5',
    text:'独自思考比集体讨论更能让我产生好想法', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'bigfive', dimension:'extraversion' },
  // Big Five: agreeableness (2题)
  { id:'mind-029', domain:'mind', layer:'perceptual', type:'likert5',
    text:'在争论中，即使我认为自己是对的，也会优先考虑维护关系', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'bigfive', dimension:'agreeableness' },
  { id:'mind-030', domain:'mind', layer:'perceptual', type:'likert5',
    text:'我乐于指出他人逻辑中的漏洞，即使可能让对方不舒服', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'bigfive', dimension:'agreeableness' },
  // Big Five: neuroticism (3题)
  { id:'mind-031', domain:'mind', layer:'perceptual', type:'likert5',
    text:'面对不确定的事情，我会反复在脑子里推演各种可能性', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'bigfive', dimension:'neuroticism' },
  { id:'mind-032', domain:'mind', layer:'perceptual', type:'likert5',
    text:'即使准备充分，重要场合前我还是会紧张到难以入睡', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'bigfive', dimension:'neuroticism' },
  { id:'mind-033', domain:'mind', layer:'perceptual', type:'slider',
    text:'你的思维"刹车"有多灵——能否在需要时让大脑安静下来？', options:[{value:0,label:'完全停不下来'},{value:50,label:''},{value:100,label:'收放自如'}], required:false, framework:'bigfive', dimension:'neuroticism' },
  // MBTI: E/I 轴 (2题)
  { id:'mind-034', domain:'mind', layer:'perceptual', type:'radio',
    text:'高强度社交一天后，你通常感觉？', options:[
      {value:'e',label:'充满能量，还想继续聊'},{value:'i',label:'精疲力竭，需要独处充电'},{value:'both',label:'看和谁在一起'}], required:false, framework:'mbti', dimension:'ei' },
  { id:'mind-035', domain:'mind', layer:'perceptual', type:'likert5',
    text:'在小组中，我更倾向于先听后说，而非先说后听', options:[{value:1,label:'完全不符合（我先说）'},{value:5,label:'完全符合（我先听）'}], required:false, framework:'mbti', dimension:'ei' },
  // MBTI: S/N 轴 (2题)
  { id:'mind-036', domain:'mind', layer:'perceptual', type:'radio',
    text:'听一场讲座时，你更容易被什么吸引？', options:[
      {value:'s',label:'具体的案例、数据和操作步骤'},{value:'n',label:'背后的理论框架、模式和可能性'}], required:false, framework:'mbti', dimension:'sn' },
  { id:'mind-037', domain:'mind', layer:'perceptual', type:'likert5',
    text:'比起处理当下具体的事务，我更享受思考未来的可能性', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'mbti', dimension:'sn' },
  // MBTI: T/F 轴 (2题)
  { id:'mind-038', domain:'mind', layer:'perceptual', type:'radio',
    text:'朋友向你倾诉烦恼时，你的第一反应是？', options:[
      {value:'t',label:'帮 ta 分析问题、找解决方案'},{value:'f',label:'先共情、安抚情绪'}], required:false, framework:'mbti', dimension:'tf' },
  { id:'mind-039', domain:'mind', layer:'perceptual', type:'likert5',
    text:'做决定时，逻辑一致性通常比人情因素更重要', options:[{value:1,label:'完全不同意'},{value:5,label:'完全同意'}], required:false, framework:'mbti', dimension:'tf', polarity:'first' },
  // MBTI: J/P 轴 (2题)
  { id:'mind-040', domain:'mind', layer:'perceptual', type:'radio',
    text:'面对一个截止日期，你通常？', options:[
      {value:'j',label:'提前规划、分步执行、尽量提早完成'},{value:'p',label:'截止日期前爆发冲刺，享受压力下的效率'}], required:false, framework:'mbti', dimension:'jp' },
  { id:'mind-041', domain:'mind', layer:'perceptual', type:'likert5',
    text:'计划被打乱会让我感到焦虑', options:[{value:1,label:'完全不符合（我很灵活）'},{value:5,label:'完全符合（我很在意计划）'}], required:false, framework:'mbti', dimension:'jp', polarity:'first' },
  // Enneagram 9 型自评 (9题)
  { id:'mind-042', domain:'mind', layer:'perceptual', type:'likert5',
    text:'我内心有一个严厉的"内在批评家"，驱使我不断追求更好', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type1' },
  { id:'mind-043', domain:'mind', layer:'perceptual', type:'likert5',
    text:'我习惯主动照顾他人的需求，有时会忽略自己', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type2' },
  { id:'mind-044', domain:'mind', layer:'perceptual', type:'likert5',
    text:'我把成就和效率看作证明自己价值的方式', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type3' },
  { id:'mind-045', domain:'mind', layer:'perceptual', type:'likert5',
    text:'我常常觉得别人拥有我所缺失的东西，总在寻找"真正的自己"', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type4' },
  { id:'mind-046', domain:'mind', layer:'perceptual', type:'likert5',
    text:'我倾向于观察和分析，而不是参与——保持距离让我感到安全', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type5' },
  { id:'mind-047', domain:'mind', layer:'perceptual', type:'likert5',
    text:'我习惯做最坏的打算，对"安全感"有强烈的需求', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type6' },
  { id:'mind-048', domain:'mind', layer:'perceptual', type:'likert5',
    text:'我喜欢保持多个选项开放，不喜欢被束缚在单一计划里', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type7' },
  { id:'mind-049', domain:'mind', layer:'perceptual', type:'likert5',
    text:'我习惯掌控局面，不喜欢表现脆弱', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type8' },
  { id:'mind-050', domain:'mind', layer:'perceptual', type:'likert5',
    text:'我倾向于顺应环境、避免冲突，宁可退一步海阔天空', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type9' },

  // --- 叙事层 15 题 ---
  { id:'mind-051', domain:'mind', layer:'narrative', type:'shorttext',
    text:'描述一下你典型的思考过程——当你要解决一个从没遇到过的问题时，你的大脑里发生了什么？', maxLength:300, required:false },
  { id:'mind-052', domain:'mind', layer:'narrative', type:'shorttext',
    text:'你觉得自己最独特的一种思维方式是什么？举例说明', maxLength:250, required:false },
  { id:'mind-053', domain:'mind', layer:'narrative', type:'longtext',
    text:'回顾你人生中一个重大的决策过程——你是如何收集信息、权衡各方因素、最终做出决定的？回头看，你对当时的决策过程满意吗？', required:false },
  { id:'mind-054', domain:'mind', layer:'narrative', type:'shorttext',
    text:'你做过的最"反直觉"但结果却很好的决定是什么？', maxLength:250, required:false },
  { id:'mind-055', domain:'mind', layer:'narrative', type:'longtext',
    text:'描述一次你"改变主意"的经历——从坚信某事到彻底推翻自己的看法。是什么触发了这个转变？', required:false },
  { id:'mind-056', domain:'mind', layer:'narrative', type:'shorttext',
    text:'你学习生涯中最难忘的一次"顿悟时刻"（Aha moment）是什么？', maxLength:250, required:false },
  { id:'mind-057', domain:'mind', layer:'narrative', type:'shorttext',
    text:'有没有一个知识点/技能，你花了很长时间才真正掌握？这个过程中最大的障碍是什么？', maxLength:300, required:false },
  { id:'mind-058', domain:'mind', layer:'narrative', type:'longtext',
    text:'你如何判断一个信息是否可信？请描述你在面对争议性话题时的信息验证流程', required:false },
  { id:'mind-059', domain:'mind', layer:'narrative', type:'shorttext',
    text:'你发现自己最容易陷入哪些认知偏差？（如确认偏误、幸存者偏差等）请举例', maxLength:250, required:false },
  { id:'mind-060', domain:'mind', layer:'narrative', type:'shorttext',
    text:'有没有哪一次你意识到"原来我一直都理解错了"？是什么事情？', maxLength:250, required:false },
  { id:'mind-061', domain:'mind', layer:'narrative', type:'longtext',
    text:'如果你可以给自己设计一套"思维操作系统"，你会包含哪些核心算法/原则？', required:false },
  { id:'mind-062', domain:'mind', layer:'narrative', type:'shorttext',
    text:'你在什么情况下思维最清晰？什么情况下最容易混乱？', maxLength:200, required:false },
  { id:'mind-063', domain:'mind', layer:'narrative', type:'shorttext',
    text:'你有没有自己独特的"思维工具"或心理模型（如第一性原理、逆向思维等）？描述一个你实际使用过的场景', maxLength:300, required:false },
  { id:'mind-064', domain:'mind', layer:'narrative', type:'shorttext',
    text:'如果用一个比喻来描述你的大脑，它会是什么？（如：一座图书馆、一个实验室、一片森林……）为什么？', maxLength:200, required:false },
  { id:'mind-065', domain:'mind', layer:'narrative', type:'shorttext',
    text:'经过以上这些思考之后，你对自己的"思维方式"有没有什么新的发现或感悟？', maxLength:300, required:false },

  /* ========================================================
     三、情感关系 (62 题)
     框架引用：Goleman EQ, TSCS, Big Five
     ======================================================== */

  // --- 事实层 12 题 ---
  { id:'emotion-001', domain:'emotion', layer:'factual', type:'radio',
    text:'你目前拥有的"可以深入谈心"的朋友大约有几个？', options:[
      {value:'none',label:'没有'},{value:'1-2',label:'1-2 个'},{value:'3-5',label:'3-5 个'},{value:'6-10',label:'6-10 个'},{value:'gt10',label:'10 个以上'}], required:false },
  { id:'emotion-002', domain:'emotion', layer:'factual', type:'checkbox',
    text:'你的社交圈主要包括哪些人？（可多选）', options:[
      {value:'classmate',label:'同学'},{value:'roommate',label:'室友'},{value:'club',label:'社团/组织成员'},{value:'online',label:'线上朋友'},{value:'family',label:'家人/亲戚'},{value:'colleague',label:'实习/工作同事'},{value:'childhood',label:'从小一起长大的朋友'}], required:false },
  { id:'emotion-003', domain:'emotion', layer:'factual', type:'radio',
    text:'你目前的状态更接近？', options:[
      {value:'single',label:'单身'},{value:'dating',label:'约会中'},{value:'relationship',label:'恋爱中'},{value:'married',label:'已婚'},{value:'complicated',label:'比较复杂'}], required:false },
  { id:'emotion-004', domain:'emotion', layer:'factual', type:'radio',
    text:'在一段亲密关系中，你最看重什么？', options:[
      {value:'trust',label:'信任'},{value:'understanding',label:'被理解'},{value:'growth',label:'共同成长'},{value:'passion',label:'激情/吸引力'},{value:'stability',label:'稳定/安全感'},{value:'freedom',label:'独立空间'}], required:false },
  { id:'emotion-005', domain:'emotion', layer:'factual', type:'radio',
    text:'你原生家庭的亲密关系模式是？', options:[
      {value:'close',label:'亲密、善于表达情感'},{value:'distant',label:'有距离、不擅长表达'},{value:'conflict',label:'常有冲突'},{value:'absent',label:'某一方长期缺席'},{value:'complex',label:'比较复杂，难以概括'}], required:false },
  { id:'emotion-006', domain:'emotion', layer:'factual', type:'radio',
    text:'与人发生冲突时，你的典型反应是？', options:[
      {value:'confront',label:'直接面对，当场说清楚'},{value:'withdraw',label:'先撤退冷静'},{value:'avoid',label:'尽量避免冲突，能忍则忍'},{value:'mediate',label:'寻求第三方调解'},{value:'explode',label:'情绪爆发后再后悔'}], required:false },
  { id:'emotion-007', domain:'emotion', layer:'factual', type:'radio',
    text:'你通常如何表达愤怒？', options:[
      {value:'suppress',label:'压在心底，不表现出来'},{value:'verbal',label:'用语言表达出来'},{value:'passive',label:'消极抵抗/冷战'},{value:'physical',label:'通过运动等方式发泄'},{value:'write',label:'写下来自己消化'},{value:'talk',label:'找第三方倾诉'}], required:false },
  { id:'emotion-008', domain:'emotion', layer:'factual', type:'checkbox',
    text:'过去一年中，你经历过哪些情绪状态？（可多选）', options:[
      {value:'joy',label:'持久的快乐/满足'},{value:'anxiety',label:'明显的焦虑'},{value:'sadness',label:'持续的低落/悲伤'},{value:'anger',label:'频繁的愤怒/烦躁'},{value:'numb',label:'麻木/没什么感觉'},{value:'hope',label:'充满希望'},{value:'lonely',label:'孤独感'}], required:false },
  { id:'emotion-009', domain:'emotion', layer:'factual', type:'radio',
    text:'你对自己情绪的觉察程度？', options:[
      {value:'always',label:'我总能清楚地知道自己当下的情绪是什么'},{value:'often',label:'大多数时候能'},{value:'sometimes',label:'有时候能，有时候不太确定'},{value:'rarely',label:'经常不知道自己到底是什么感觉'},{value:'retrospect',label:'事情过后才能反应过来'}], required:false },
  { id:'emotion-010', domain:'emotion', layer:'factual', type:'radio',
    text:'心情不好的时候，你通常会？', options:[
      {value:'alone',label:'自己待着消化'},{value:'talk',label:'找人聊天倾诉'},{value:'distract',label:'做别的事转移注意力'},{value:'music',label:'听音乐/看电影'},{value:'exercise',label:'运动/出去走走'},{value:'spiral',label:'陷在里面反复想'}], required:false },
  { id:'emotion-011', domain:'emotion', layer:'factual', type:'radio',
    text:'过去一年中，你是否因情绪问题寻求过帮助（心理咨询、朋友深谈等）？', options:[
      {value:'professional',label:'求助过专业心理咨询'},{value:'friends',label:'和朋友/家人深度聊过'},{value:'selfhelp',label:'自己看书/查资料'},{value:'none',label:'没有寻求过帮助'},{value:'considering',label:'正在考虑'}], required:false },
  { id:'emotion-012', domain:'emotion', layer:'factual', type:'radio',
    text:'你对"孤独"的感受通常是？', options:[
      {value:'enjoy',label:'享受独处，很少感到孤独'},{value:'occasional',label:'偶尔孤独但能接受'},{value:'frequent',label:'经常感到孤独，即使周围有人'},{value:'painful',label:'孤独让我很痛苦'},{value:'numb',label:'习惯了，没什么特别的感觉'}], required:false },

  // --- 感知层 30 题 ---
  // Goleman EQ: self-awareness (4题)
  { id:'emotion-013', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'我能精准地识别并命名自己当下的情绪', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'goleman-eq', dimension:'self-awareness' },
  { id:'emotion-014', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'我知道什么样的事情会触发我的情绪反应', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'goleman-eq', dimension:'self-awareness' },
  { id:'emotion-015', domain:'emotion', layer:'perceptual', type:'likert7',
    text:'你对自己"为什么会有这种情绪"的理解程度？', options:[{value:1,label:'完全不理解'},{value:7,label:'非常理解'}], required:false, framework:'goleman-eq', dimension:'self-awareness' },
  { id:'emotion-016', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'当我情绪波动时，我能意识到它正在影响我的判断', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'goleman-eq', dimension:'self-awareness' },
  // Goleman EQ: self-management (4题)
  { id:'emotion-017', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'在压力下，我仍能保持冷静和清晰思考', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'goleman-eq', dimension:'self-management' },
  { id:'emotion-018', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'情绪上来时我能"暂停"——在冲动行动之前给自己缓冲时间', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'goleman-eq', dimension:'self-management' },
  { id:'emotion-019', domain:'emotion', layer:'perceptual', type:'likert7',
    text:'遭遇重大挫折后，你恢复平静的能力？', options:[{value:1,label:'非常弱——久久不能平复'},{value:7,label:'非常强——很快调整过来'}], required:false, framework:'goleman-eq', dimension:'self-management' },
  { id:'emotion-020', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'我有一套行之有效的"情绪调节策略"（如深呼吸、换位思考等）', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'goleman-eq', dimension:'self-management' },
  // Goleman EQ: social-awareness (3题)
  { id:'emotion-021', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'我能很快察觉到周围人的情绪变化', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'goleman-eq', dimension:'social-awareness' },
  { id:'emotion-022', domain:'emotion', layer:'perceptual', type:'slider',
    text:'你的"共情天线"有多灵敏——能否感知到他人没说出口的感受？', options:[{value:0,label:'经常察觉不到'},{value:50,label:''},{value:100,label:'敏锐到像读心'}], required:false, framework:'goleman-eq', dimension:'social-awareness' },
  { id:'emotion-023', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'在群体中，我能感知到"气氛"的变化', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'goleman-eq', dimension:'social-awareness' },
  // Goleman EQ: relationship-management (4题)
  { id:'emotion-024', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'当朋友之间有矛盾时，我通常能充当调解的角色', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'goleman-eq', dimension:'relationship-management' },
  { id:'emotion-025', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'我能坦然地向他人表达自己的情感需求', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'goleman-eq', dimension:'relationship-management' },
  { id:'emotion-026', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'我发现给别人反馈（尤其是负面的）是一件很难的事', options:[{value:1,label:'完全不符合（我挺擅长）'},{value:5,label:'完全符合（确实很难）'}], required:false, framework:'goleman-eq', dimension:'relationship-management' },
  { id:'emotion-027', domain:'emotion', layer:'perceptual', type:'likert7',
    text:'你在团队中化解冲突的能力？', options:[{value:1,label:'非常弱'},{value:7,label:'非常强'}], required:false, framework:'goleman-eq', dimension:'relationship-management' },
  // TSCS: social (3题)
  { id:'emotion-028', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'我认为自己在社交场合中是一个让人舒服的存在', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'social' },
  { id:'emotion-029', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'我经常担心别人怎么看我', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'tscs', dimension:'social' },
  { id:'emotion-030', domain:'emotion', layer:'perceptual', type:'slider',
    text:'你在社交中的真实自我暴露程度？', options:[{value:0,label:'戴着面具'},{value:50,label:''},{value:100,label:'完全真实'}], required:false, framework:'tscs', dimension:'social' },
  // TSCS: moral (3题)
  { id:'emotion-031', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'我对待他人的方式与我的道德标准是一致的', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'moral' },
  { id:'emotion-032', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'当我辜负了某个人的信任时，我会长时间感到内疚', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'moral' },
  { id:'emotion-033', domain:'emotion', layer:'perceptual', type:'likert7',
    text:'"忠诚"在你人际关系中的重要性？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'tscs', dimension:'moral' },
  // Big Five: agreeableness (3题)
  { id:'emotion-034', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'我天然地信任他人，除非对方给我不信任的理由', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'bigfive', dimension:'agreeableness' },
  { id:'emotion-035', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'看到别人陷入困境，我很难袖手旁观', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'bigfive', dimension:'agreeableness' },
  { id:'emotion-036', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'即使不喜欢一个人，我也能保持礼貌和尊重', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'bigfive', dimension:'agreeableness' },
  // Big Five: extraversion (3题)
  { id:'emotion-037', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'在聚会上，我喜欢成为众人关注的焦点', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'bigfive', dimension:'extraversion' },
  { id:'emotion-038', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'结识新朋友让我感到兴奋', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'bigfive', dimension:'extraversion' },
  { id:'emotion-039', domain:'emotion', layer:'perceptual', type:'slider',
    text:'你在社交中的能量流向？', options:[{value:0,label:'社交消耗能量'},{value:50,label:''},{value:100,label:'社交补充能量'}], required:false, framework:'bigfive', dimension:'extraversion' },
  // Big Five: neuroticism (3题)
  { id:'emotion-040', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'我经常担心重要的人会离开我', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'bigfive', dimension:'neuroticism' },
  { id:'emotion-041', domain:'emotion', layer:'perceptual', type:'likert7',
    text:'人际冲突对你的情绪影响有多大？', options:[{value:1,label:'几乎没影响'},{value:7,label:'影响极大，久久不能平复'}], required:false, framework:'bigfive', dimension:'neuroticism' },
  { id:'emotion-042', domain:'emotion', layer:'perceptual', type:'likert5',
    text:'发出一条信息后未收到回复，我会反复揣测原因', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'bigfive', dimension:'neuroticism' },

  // --- 叙事层 20 题 ---
  { id:'emotion-043', domain:'emotion', layer:'narrative', type:'longtext',
    text:'描述一段对你影响最深的关系（可以是任何人）——这段关系如何塑造了你？', required:false },
  { id:'emotion-044', domain:'emotion', layer:'narrative', type:'shorttext',
    text:'你有没有失去过一段重要的关系？那次经历教会了你什么？', maxLength:300, required:false },
  { id:'emotion-045', domain:'emotion', layer:'narrative', type:'shorttext',
    text:'你觉得自己是一个"好的朋友/伴侣/家人"吗？用具体的例子说明', maxLength:300, required:false },
  { id:'emotion-046', domain:'emotion', layer:'narrative', type:'shorttext',
    text:'如果有人对你说"你不懂我"，你觉得问题出在哪里？', maxLength:250, required:false },
  { id:'emotion-047', domain:'emotion', layer:'narrative', type:'longtext',
    text:'你人生中情绪最低谷的一段时期是怎样的？你是如何走出来的？', required:false },
  { id:'emotion-048', domain:'emotion', layer:'narrative', type:'shorttext',
    text:'描述一次你的情绪让你做出了你后来后悔的事', maxLength:250, required:false },
  { id:'emotion-049', domain:'emotion', layer:'narrative', type:'longtext',
    text:'有没有哪一刻，你突然理解了某个人的行为/选择，即使你以前完全不认同？那一刻发生了什么？', required:false },
  { id:'emotion-050', domain:'emotion', layer:'narrative', type:'shorttext',
    text:'你对"爱"的定义是什么？你自己给出去的爱符合这个定义吗？', maxLength:300, required:false },
  { id:'emotion-051', domain:'emotion', layer:'narrative', type:'shorttext',
    text:'你经历过最深刻的"被看见"的感觉是怎样的？谁给了你这种感觉？', maxLength:250, required:false },
  { id:'emotion-052', domain:'emotion', layer:'narrative', type:'shorttext',
    text:'回想一次你对某人产生真正的共情——不是同情，而是感同身受。是什么样的情境？', maxLength:250, required:false },
  { id:'emotion-053', domain:'emotion', layer:'narrative', type:'shorttext',
    text:'你有没有对某个群体/某个人产生过偏见，后来发现是自己错了？', maxLength:300, required:false },
  { id:'emotion-054', domain:'emotion', layer:'narrative', type:'longtext',
    text:'你是否经历过"共情疲劳"——因为太容易感受他人的痛苦而感到耗竭？如果有，你如何应对？', required:false },
  { id:'emotion-055', domain:'emotion', layer:'narrative', type:'shorttext',
    text:'你最深的孤独感来源于什么？是缺少陪伴，还是缺少理解？', maxLength:250, required:false },
  { id:'emotion-056', domain:'emotion', layer:'narrative', type:'shorttext',
    text:'有没有人说过你"变了"？你自己觉得变了吗？具体变了什么？', maxLength:300, required:false },
  { id:'emotion-057', domain:'emotion', layer:'narrative', type:'shorttext',
    text:'你感受到"连接感"最强烈的一次经历是什么？', maxLength:250, required:false },
  { id:'emotion-058', domain:'emotion', layer:'narrative', type:'shorttext',
    text:'如果用一个画面/场景来描述你目前的"情感世界"，它会是什么样的？', maxLength:200, required:false },
  { id:'emotion-059', domain:'emotion', layer:'narrative', type:'longtext',
    text:'你如何看待"亲密关系的边界"——亲密是否意味着完全透明？你在关系中如何平衡坦诚与自我保护？', required:false },
  { id:'emotion-060', domain:'emotion', layer:'narrative', type:'shorttext',
    text:'如果可以修复一段关系，你最想修复哪一段？为什么？', maxLength:250, required:false },
  { id:'emotion-061', domain:'emotion', layer:'narrative', type:'shorttext',
    text:'你希望别人记住你的哪一面——理性的、温暖的、有趣的、还是其他？', maxLength:200, required:false },
  { id:'emotion-062', domain:'emotion', layer:'narrative', type:'longtext',
    text:'经过以上这些关于情感的回顾，你对自己与他人的关系模式有没有什么新的认识？', required:false },

  /* ========================================================
     四、能力行动 (70 题)
     框架引用：CliftonStrengths 34, TSCS, 16PF, Ikigai
     ======================================================== */

  // --- 事实层 25 题 ---
  { id:'ability-001', domain:'ability', layer:'factual', type:'checkbox',
    text:'你掌握以下哪些硬技能？（可多选）', options:[
      {value:'programming',label:'编程/软件开发'},{value:'design',label:'设计（UI/平面/工业）'},{value:'writing',label:'写作/内容创作'},{value:'data',label:'数据分析/统计'},{value:'language',label:'外语能力'},{value:'video',label:'视频/音频制作'},{value:'teaching',label:'教学/培训'},{value:'research',label:'学术研究'},{value:'speaking',label:'演讲/辩论'}], required:false },
  { id:'ability-002', domain:'ability', layer:'factual', type:'radio',
    text:'你的 GPA / 专业排名大致处于？', options:[
      {value:'top5',label:'前 5%'},{value:'top20',label:'前 5%-20%'},{value:'top50',label:'前 20%-50%'},{value:'bot50',label:'后 50%'},{value:'na',label:'不清楚/不适用'}], required:false },
  { id:'ability-003', domain:'ability', layer:'factual', type:'radio',
    text:'你对自己的学业表现满意吗？', options:[
      {value:'very',label:'非常满意'},{value:'ok',label:'还行'},{value:'mixed',label:'有些科目好有些很差'},{value:'no',label:'不满意'},{value:'indifferent',label:'不太在乎成绩'}], required:false },
  { id:'ability-004', domain:'ability', layer:'factual', type:'checkbox',
    text:'你参加过以下哪些类型的竞赛？（可多选）', options:[
      {value:'academic',label:'学科竞赛（数学建模/ACM/英语等）'},{value:'innovation',label:'创新创业大赛'},{value:'hackathon',label:'黑客马拉松'},{value:'design',label:'设计/艺术类比赛'},{value:'speech',label:'演讲/辩论赛'},{value:'sports',label:'体育竞赛'},{value:'none',label:'没有参加过竞赛'}], required:false },
  { id:'ability-005', domain:'ability', layer:'factual', type:'radio',
    text:'你在竞赛/比赛中获得过的最高荣誉是？', options:[
      {value:'international',label:'国际级奖项'},{value:'national',label:'国家级奖项'},{value:'provincial',label:'省/市级奖项'},{value:'school',label:'校级奖项'},{value:'participation',label:'参与奖/未获奖'},{value:'none',label:'未参加过竞赛'}], required:false },
  { id:'ability-006', domain:'ability', layer:'factual', type:'radio',
    text:'你是否有过担任团队负责人的经历？', options:[
      {value:'major',label:'担任过核心负责人（社团/项目/创业等）'},{value:'minor',label:'担任过小组长等小角色'},{value:'informal',label:'非正式地带领过团队'},{value:'none',label:'没有带过团队'},{value:'prefer-not',label:'更喜欢做执行者而非领导者'}], required:false },
  { id:'ability-007', domain:'ability', layer:'factual', type:'checkbox',
    text:'你管理过以下哪些类型的项目？（可多选）', options:[
      {value:'tech',label:'技术开发项目'},{value:'event',label:'活动策划/执行'},{value:'research',label:'科研/调研项目'},{value:'creative',label:'创作类项目（视频/写作/设计）'},{value:'volunteer',label:'志愿/公益项目'},{value:'business',label:'商业/创业项目'},{value:'none',label:'还没有项目管理经验'}], required:false },
  { id:'ability-008', domain:'ability', layer:'factual', type:'radio',
    text:'你考取过哪些证书或资格？（选最高级别）', options:[
      {value:'professional',label:'专业资格证书（如CPA/律师/医师等）'},{value:'language',label:'语言证书（四六级/雅思/托福/N1等）'},{value:'tech',label:'技术认证（如计算机等级/厂商认证）'},{value:'other',label:'其他证书'},{value:'none',label:'暂未考取证书'}], required:false },
  { id:'ability-009', domain:'ability', layer:'factual', type:'checkbox',
    text:'你的技术栈包括哪些？（可多选）', options:[
      {value:'frontend',label:'前端（HTML/CSS/JS/React/Vue等）'},{value:'backend',label:'后端（Node/Python/Java/Go等）'},{value:'mobile',label:'移动端开发'},{value:'ai',label:'AI/机器学习'},{value:'design',label:'设计工具（Figma/PS/AI等）'},{value:'office',label:'办公软件（Excel/PPT/Word）'},{value:'other',label:'其他工具或软件'}], required:false },
  { id:'ability-010', domain:'ability', layer:'factual', type:'radio',
    text:'你最熟练的技能达到了什么水平？（自评）', options:[
      {value:'expert',label:'专家级——可以教别人'},{value:'advanced',label:'高级——能独立完成复杂任务'},{value:'intermediate',label:'中级——能完成常规任务'},{value:'beginner',label:'初学者——还在学习'},{value:'jack',label:'样样通样样松'}], required:false },
  { id:'ability-011', domain:'ability', layer:'factual', type:'radio',
    text:'你每周花多少时间刻意练习/提升专业技能？', options:[
      {value:'lt2h',label:'少于 2 小时'},{value:'2-5h',label:'2-5 小时'},{value:'5-10h',label:'5-10 小时'},{value:'10-20h',label:'10-20 小时'},{value:'gt20h',label:'20 小时以上'}], required:false },
  { id:'ability-012', domain:'ability', layer:'factual', type:'radio',
    text:'你学习一项新技能通常需要多久才能达到"能独立使用"的水平？', options:[
      {value:'days',label:'几天'},{value:'weeks',label:'几周'},{value:'months',label:'几个月'},{value:'year',label:'半年到一年'},{value:'varies',label:'看是什么样的技能'}], required:false },
  { id:'ability-013', domain:'ability', layer:'factual', type:'checkbox',
    text:'你认为自己比较突出的软技能有哪些？（可多选）', options:[
      {value:'communication',label:'沟通表达'},{value:'leadership',label:'领导力'},{value:'teamwork',label:'团队协作'},{value:'adaptability',label:'适应力'},{value:'creativity',label:'创造力'},{value:'critical-thinking',label:'批判性思维'},{value:'time',label:'时间管理'},{value:'resilience',label:'抗压/韧性'}], required:false },
  { id:'ability-014', domain:'ability', layer:'factual', type:'radio',
    text:'你有没有过"把学到的技能用在实际中并产生了价值"的经历？（如接外包、做产品、帮人解决问题）', options:[
      {value:'significant',label:'有，并且产生了显著价值（收入/影响力等）'},{value:'some',label:'有一些小实践'},{value:'trying',label:'正在尝试'},{value:'none',label:'还没有'}], required:false },
  { id:'ability-015', domain:'ability', layer:'factual', type:'radio',
    text:'你是否清楚自己"真正擅长什么"？', options:[
      {value:'clear',label:'非常清楚'},{value:'rough',label:'大概知道'},{value:'others',label:'别人比我更清楚我擅长什么'},{value:'unsure',label:'不太确定'},{value:'changing',label:'正在重新认识中'}], required:false },
  { id:'ability-016', domain:'ability', layer:'factual', type:'ranking',
    text:'请按"实际熟练程度"排列以下能力领域', options:[
      {value:'technical',label:'技术/工具操作'},{value:'thinking',label:'分析/策略思考'},{value:'social',label:'人际/沟通'},{value:'creative',label:'创意/设计'},{value:'execution',label:'执行/管理'}], required:false },
  { id:'ability-017', domain:'ability', layer:'factual', type:'radio',
    text:'你每天有效工作/学习的时间大约是？', options:[
      {value:'lt2h',label:'少于 2 小时'},{value:'2-4h',label:'2-4 小时'},{value:'4-6h',label:'4-6 小时'},{value:'6-8h',label:'6-8 小时'},{value:'gt8h',label:'8 小时以上'}], required:false },
  { id:'ability-018', domain:'ability', layer:'factual', type:'radio',
    text:'你有没有被 mentor / 老师 / 上级明确表扬过的能力？', options:[
      {value:'frequently',label:'经常被表扬'},{value:'sometimes',label:'偶尔'},{value:'once',label:'有过一两次'},{value:'never',label:'没有过'},{value:'unclear',label:'不太清楚算不算'}], required:false },
  { id:'ability-019', domain:'ability', layer:'factual', type:'radio',
    text:'你是否有实习/工作经验？', options:[
      {value:'fulltime',label:'有全职工作经验'},{value:'intern',label:'有实习经验'},{value:'parttime',label:'有兼职/零工经验'},{value:'volunteer',label:'有志愿服务经验'},{value:'none',label:'还没有工作经验'}], required:false },
  { id:'ability-020', domain:'ability', layer:'factual', type:'radio',
    text:'面对一个完全陌生的领域，你的学习策略是？', options:[
      {value:'structured',label:'找系统课程/教材从头学'},{value:'project',label:'直接上手做项目，边做边学'},{value:'mentor',label:'找一个懂的人带路'},{value:'community',label:'加入相关社群浸泡'},{value:'skim',label:'先快速浏览全局再深入'}], required:false },
  { id:'ability-021', domain:'ability', layer:'factual', type:'radio',
    text:'你对自己目前的"职业竞争力"的评价？', options:[
      {value:'strong',label:'很强——我有信心拿到理想的机会'},{value:'ok',label:'还行——在平均水平以上'},{value:'average',label:'一般——和同龄人差不多'},{value:'weak',label:'偏弱——需要大幅提升'},{value:'unclear',label:'不清楚——还没认真评估过'}], required:false },
  { id:'ability-022', domain:'ability', layer:'factual', type:'radio',
    text:'你是否有一个明确的"专业技能发展路线图"？', options:[
      {value:'detailed',label:'有详细的规划和里程碑'},{value:'rough',label:'有大方向但没有具体规划'},{value:'vague',label:'模糊地知道该学什么'},{value:'none',label:'走一步看一步'},{value:'overwhelmed',label:'想学的东西太多，规划不过来'}], required:false },
  { id:'ability-023', domain:'ability', layer:'factual', type:'checkbox',
    text:'你有哪些"跨界"的能力组合？（可多选）', options:[
      {value:'tech-design',label:'技术+设计'},{value:'tech-business',label:'技术+商业'},{value:'writing-tech',label:'写作+专业领域知识'},{value:'data-story',label:'数据分析+叙事'},{value:'teach-tech',label:'教学+专业技能'},{value:'none',label:'暂时没有明显的跨界组合'}], required:false },
  { id:'ability-024', domain:'ability', layer:'factual', type:'radio',
    text:'你是否在某个细分领域达到了"比周围人都强"的水平？', options:[
      {value:'definitely',label:'是，有明确的细分优势'},{value:'maybe',label:'可能有，但不确定'},{value:'no',label:'好像没有特别突出的'},{value:'hidden',label:'有但我没展示出来'}], required:false },
  { id:'ability-025', domain:'ability', layer:'factual', type:'radio',
    text:'你做事的驱动力更多来自？', options:[
      {value:'intrinsic',label:'内在——兴趣、好奇心、成长的渴望'},{value:'extrinsic',label:'外在——成绩、认可、报酬'},{value:'obligation',label:'责任感——答应了就得做好'},{value:'competition',label:'竞争——不想比别人差'},{value:'fear',label:'压力——不做会有后果'}], required:false },

  // --- 感知层 32 题 ---
  // CliftonStrengths: executing (5题)
  { id:'ability-026', domain:'ability', layer:'perceptual', type:'likert5',
    text:'一旦开始做一件事，我会坚持到底直到完成', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'cliftonstrengths', dimension:'executing' },
  { id:'ability-027', domain:'ability', layer:'perceptual', type:'likert5',
    text:'我擅长把大目标分解成可执行的步骤', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'cliftonstrengths', dimension:'executing' },
  { id:'ability-028', domain:'ability', layer:'perceptual', type:'likert5',
    text:'我对细节的严谨程度让周围人觉得"有点过了"', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'cliftonstrengths', dimension:'executing' },
  { id:'ability-029', domain:'ability', layer:'perceptual', type:'likert7',
    text:'你在"说到做到"这件事上的自我评分？', options:[{value:1,label:'经常说到做不到'},{value:7,label:'说到一定做到'}], required:false, framework:'cliftonstrengths', dimension:'executing' },
  { id:'ability-030', domain:'ability', layer:'perceptual', type:'likert5',
    text:'面对多项任务时，我能高效地排优先级并逐一完成', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'cliftonstrengths', dimension:'executing' },
  // CliftonStrengths: influencing (4题)
  { id:'ability-031', domain:'ability', layer:'perceptual', type:'likert5',
    text:'在小组讨论中，我的意见通常能影响最终决定', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'cliftonstrengths', dimension:'influencing' },
  { id:'ability-032', domain:'ability', layer:'perceptual', type:'likert5',
    text:'我善于"推销"自己的想法，让其他人认同并支持', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'cliftonstrengths', dimension:'influencing' },
  { id:'ability-033', domain:'ability', layer:'perceptual', type:'slider',
    text:'你的表达能力——能否清晰地传递复杂想法？', options:[{value:0,label:'常常词不达意'},{value:50,label:''},{value:100,label:'总能精准传达'}], required:false, framework:'cliftonstrengths', dimension:'influencing' },
  { id:'ability-034', domain:'ability', layer:'perceptual', type:'likert5',
    text:'即使面对反对意见，我也敢于坚持自己的立场', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'cliftonstrengths', dimension:'influencing' },
  // CliftonStrengths: relationship-building (4题)
  { id:'ability-035', domain:'ability', layer:'perceptual', type:'likert5',
    text:'在团队中，我通常是那个凝聚大家的人', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'cliftonstrengths', dimension:'relationship-building' },
  { id:'ability-036', domain:'ability', layer:'perceptual', type:'likert5',
    text:'我善于发现每个人的长处，并把他们放在合适的位置', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'cliftonstrengths', dimension:'relationship-building' },
  { id:'ability-037', domain:'ability', layer:'perceptual', type:'likert7',
    text:'你在团队中获得他人信任的能力？', options:[{value:1,label:'非常弱'},{value:7,label:'非常强'}], required:false, framework:'cliftonstrengths', dimension:'relationship-building' },
  { id:'ability-038', domain:'ability', layer:'perceptual', type:'likert5',
    text:'我愿意花时间帮助团队成员成长，即使这会拖慢进度', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'cliftonstrengths', dimension:'relationship-building' },
  // CliftonStrengths: strategic-thinking (4题)
  { id:'ability-039', domain:'ability', layer:'perceptual', type:'likert5',
    text:'我喜欢从大量信息中找出规律和模式', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'cliftonstrengths', dimension:'strategic-thinking' },
  { id:'ability-040', domain:'ability', layer:'perceptual', type:'likert5',
    text:'在做决策之前，我会考虑各种可能的情景和应对方案', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'cliftonstrengths', dimension:'strategic-thinking' },
  { id:'ability-041', domain:'ability', layer:'perceptual', type:'slider',
    text:'你的"全局观"——能否跳出细节看到整体？', options:[{value:0,label:'容易陷入细节'},{value:50,label:''},{value:100,label:'总能抓住全局'}], required:false, framework:'cliftonstrengths', dimension:'strategic-thinking' },
  { id:'ability-042', domain:'ability', layer:'perceptual', type:'likert7',
    text:'你对未来的预判和规划能力自评？', options:[{value:1,label:'非常弱——走一步看一步'},{value:7,label:'非常强——总能提前布局'}], required:false, framework:'cliftonstrengths', dimension:'strategic-thinking' },
  // TSCS: competence (4题)
  { id:'ability-043', domain:'ability', layer:'perceptual', type:'likert5',
    text:'我相信自己有能力解决遇到的大多数问题', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'competence' },
  { id:'ability-044', domain:'ability', layer:'perceptual', type:'likert5',
    text:'面对失败时，我倾向于归因于"我不够努力"而非"我不够聪明"', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'competence' },
  { id:'ability-045', domain:'ability', layer:'perceptual', type:'slider',
    text:'你的"自我效能感"——对自己"能做到"的信心', options:[{value:0,label:'常常怀疑自己'},{value:50,label:''},{value:100,label:'深信自己能做到'}], required:false, framework:'tscs', dimension:'competence' },
  { id:'ability-046', domain:'ability', layer:'perceptual', type:'likert5',
    text:'我觉得自己有能力在所选领域做出有意义的贡献', options:[{value:1,label:'完全不同意'},{value:5,label:'完全同意'}], required:false, framework:'tscs', dimension:'competence' },
  // TSCS: identity (2题)
  { id:'ability-047', domain:'ability', layer:'perceptual', type:'likert5',
    text:'我的能力是我身份认同的重要组成部分', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'tscs', dimension:'identity' },
  { id:'ability-048', domain:'ability', layer:'perceptual', type:'likert5',
    text:'如果突然失去了我最擅长的能力，我会觉得自己"不再是自己"', options:[{value:1,label:'完全不符——我不由能力定义'},{value:5,label:'完全符合——我会迷失'}], required:false, framework:'tscs', dimension:'identity' },
  // 16PF: reasoning (2题)
  { id:'ability-049', domain:'ability', layer:'perceptual', type:'likert5',
    text:'面对复杂抽象的问题，我能比大多数人更快地抓住核心', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'16pf', dimension:'reasoning' },
  { id:'ability-050', domain:'ability', layer:'perceptual', type:'likert7',
    text:'你的逻辑推理能力自评？', options:[{value:1,label:'非常弱'},{value:7,label:'非常强'}], required:false, framework:'16pf', dimension:'reasoning' },
  // 16PF: perfectionism (2题)
  { id:'ability-051', domain:'ability', layer:'perceptual', type:'likert5',
    text:'我倾向于反复检查我的工作成果，总觉得还可以更好', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'16pf', dimension:'perfectionism' },
  { id:'ability-052', domain:'ability', layer:'perceptual', type:'likert5',
    text:'"差不多就行了"是我很难接受的标准', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'16pf', dimension:'perfectionism' },
  // 16PF: self-reliance (2题)
  { id:'ability-053', domain:'ability', layer:'perceptual', type:'likert5',
    text:'遇到困难时，我倾向于先自己解决而不是马上求助', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'16pf', dimension:'self-reliance' },
  { id:'ability-054', domain:'ability', layer:'perceptual', type:'likert5',
    text:'独立完成一项任务比团队合作更让我有成就感', options:[{value:1,label:'完全不同意'},{value:5,label:'完全同意'}], required:false, framework:'16pf', dimension:'self-reliance' },
  // Ikigai: professional/competence (3题)
  { id:'ability-055', domain:'ability', layer:'perceptual', type:'likert7',
    text:'你觉得目前所学的专业/技能"擅长"和"热爱"的重合度有多高？', options:[{value:1,label:'完全不重合'},{value:7,label:'完美重合'}], required:false, framework:'ikigai' },
  { id:'ability-056', domain:'ability', layer:'perceptual', type:'likert5',
    text:'我认为自己的核心能力有市场价值——能转化为实际收入', options:[{value:1,label:'完全不同意'},{value:5,label:'完全同意'}], required:false, framework:'ikigai' },
  { id:'ability-057', domain:'ability', layer:'perceptual', type:'slider',
    text:'你的技能组合的"独特性"——别人难以复制的程度？', options:[{value:0,label:'非常普通，很多人都有'},{value:50,label:''},{value:100,label:'独一无二的组合'}], required:false, framework:'ikigai' },

  // --- 叙事层 13 题 ---
  { id:'ability-058', domain:'ability', layer:'narrative', type:'longtext',
    text:'详细描述一项你从零开始学到精通的能力——是什么驱动你走到现在？过程中最大的挑战和突破是什么？', required:false },
  { id:'ability-059', domain:'ability', layer:'narrative', type:'shorttext',
    text:'有没有一项能力是你原本以为自己很弱，后来发现其实不错的？你是怎么发现的？', maxLength:250, required:false },
  { id:'ability-060', domain:'ability', layer:'narrative', type:'shorttext',
    text:'你心中"理想的能力组合"是什么样的？你现在离它有多远？', maxLength:250, required:false },
  { id:'ability-061', domain:'ability', layer:'narrative', type:'longtext',
    text:'描述一次你"搞砸了"的经历——一个项目、一次考试、一个承诺。你是如何面对的？这件事教会了你什么？', required:false },
  { id:'ability-062', domain:'ability', layer:'narrative', type:'shorttext',
    text:'你犯过的最"低级"但后果最严重的一个错误是什么？', maxLength:250, required:false },
  { id:'ability-063', domain:'ability', layer:'narrative', type:'shorttext',
    text:'在团队协作中，你有没有过"拖累团队"的经历？如果有，后来怎么改进的？', maxLength:300, required:false },
  { id:'ability-064', domain:'ability', layer:'narrative', type:'shorttext',
    text:'描述一次你觉得自己"超常发挥"的经历——在什么情境下，你做到了自己都不敢想象的事情？', maxLength:300, required:false },
  { id:'ability-065', domain:'ability', layer:'narrative', type:'shorttext',
    text:'有没有一个人（老师/朋友/对手）的一句话让你在某项能力上突飞猛进？ta 说了什么？', maxLength:250, required:false },
  { id:'ability-066', domain:'ability', layer:'narrative', type:'longtext',
    text:'你有没有把一项能力从一个领域迁移到另一个领域的经历？比如学习方法用在了学乐器上、编程思维用在了生活中……', required:false },
  { id:'ability-067', domain:'ability', layer:'narrative', type:'shorttext',
    text:'你认为自己最被低估的一项能力是什么？为什么被低估了？', maxLength:250, required:false },
  { id:'ability-068', domain:'ability', layer:'narrative', type:'shorttext',
    text:'如果明天需要你靠某项能力赚钱养活自己，你会选哪项？你能靠它活下去吗？', maxLength:250, required:false },
  { id:'ability-069', domain:'ability', layer:'narrative', type:'shorttext',
    text:'回顾你能力的成长曲线——它是什么样的形状？（平稳上升？阶梯式跳跃？有平台期？）', maxLength:200, required:false },
  { id:'ability-070', domain:'ability', layer:'narrative', type:'longtext',
    text:'经过以上这些关于能力的回顾，重新思考：你最想在未来 3 年构建的"核心能力"是什么？为什么？你计划如何开始？', required:false },  /* ========================================================
     五、热情驱动 (63 题)
     框架引用：Ikigai, Schwartz PVQ, Enneagram
     ======================================================== */

  // --- 事实层 13 题 ---
  { id:'passion-001', domain:'passion', layer:'factual', type:'checkbox',
    text:'在以下活动中，哪些是你发自内心喜欢、即使没有外部奖励也愿意做的？（可多选）', options:[
      {value:'coding',label:'写代码/做技术项目'},{value:'writing',label:'写作/记录'},{value:'art',label:'画画/设计/手工'},{value:'music',label:'听音乐/演奏乐器'},{value:'sports',label:'运动/健身'},{value:'reading',label:'阅读'},{value:'gaming',label:'打游戏'},{value:'cooking',label:'烹饪/烘焙'},{value:'nature',label:'户外/自然探索'},{value:'social',label:'和朋友聊天/社交'},{value:'teach',label:'教别人/分享知识'},{value:'think',label:'独自思考/研究问题'}], required:false },
  { id:'passion-002', domain:'passion', layer:'factual', type:'radio',
    text:'你每周花在"纯粹因为喜欢而做的事"上的时间大约是多少？', options:[
      {value:'lt2h',label:'少于 2 小时'},{value:'2-5h',label:'2-5 小时'},{value:'5-10h',label:'5-10 小时'},{value:'10-20h',label:'10-20 小时'},{value:'gt20h',label:'20 小时以上'}], required:false },
  { id:'passion-003', domain:'passion', layer:'factual', type:'radio',
    text:'做选择时——比如选课、选专业、选工作方向——"我喜欢"在你的决策中占多大权重？', options:[
      {value:'primary',label:'是最重要的决定因素'},{value:'important',label:'重要但不是唯一的'},{value:'secondary',label:'会考虑，但排在现实因素之后'},{value:'rarely',label:'很少考虑喜不喜欢'},{value:'unsure',label:'不太确定自己喜欢什么'}], required:false },
  { id:'passion-004', domain:'passion', layer:'factual', type:'radio',
    text:'你玩游戏的偏好的类型是？', options:[
      {value:'competitive',label:'竞技类（MOBA/FPS/格斗等）'},{value:'rpg',label:'角色扮演/开放世界'},{value:'strategy',label:'策略/模拟经营'},{value:'casual',label:'休闲/解谜'},{value:'story',label:'剧情/叙事向'},{value:'social',label:'社交/派对游戏'},{value:'none',label:'基本不玩游戏'}], required:false },
  { id:'passion-005', domain:'passion', layer:'factual', type:'checkbox',
    text:'你日常娱乐消费的钱主要花在哪些方面？（可多选）', options:[
      {value:'games',label:'游戏（充值/买断/周边）'},{value:'books',label:'书/知识付费'},{value:'music-video',label:'音乐/视频会员'},{value:'events',label:'演出/展览/活动'},{value:'gear',label:'装备/工具（如相机、键盘、运动器材）'},{value:'courses',label:'课程/培训'},{value:'collect',label:'收藏/手办/潮玩'},{value:'food-travel',label:'吃喝/旅行'}], required:false },
  { id:'passion-006', domain:'passion', layer:'factual', type:'radio',
    text:'你有没有一件"坚持了三年以上"的兴趣爱好？', options:[
      {value:'multiple',label:'有好几件'},{value:'one',label:'有一件'},{value:'on-off',label:'断断续续在坚持'},{value:'none',label:'没有——兴趣来得快去得也快'},{value:'searching',label:'还在寻找中'}], required:false },
  { id:'passion-007', domain:'passion', layer:'factual', type:'radio',
    text:'你是否做过志愿者/公益活动？', options:[
      {value:'regular',label:'定期在做'},{value:'several',label:'做过几次'},{value:'once',label:'做过一次'},{value:'want',label:'想做但还没行动'},{value:'none',label:'没有，也不太感兴趣'}], required:false },
  { id:'passion-008', domain:'passion', layer:'factual', type:'checkbox',
    text:'你做志愿者/公益活动的动机是什么？（可多选）', options:[
      {value:'meaning',label:'觉得有意义'},{value:'connect',label:'想连接他人'},{value:'resume',label:'对简历/升学有帮助'},{value:'required',label:'学校/组织要求'},{value:'curious',label:'好奇想试试'},{value:'heal',label:'自己经历过类似困境，想帮助同样的人'},{value:'na',label:'没做过'}], required:false },
  { id:'passion-009', domain:'passion', layer:'factual', type:'radio',
    text:'你对自己目前所学专业/从事领域的态度是？', options:[
      {value:'love',label:'真心喜欢，觉得这就是我想做的'},{value:'like',label:'挺感兴趣的，愿意深入'},{value:'neutral',label:'说不上喜不喜欢，就是个选择'},{value:'dislike',label:'不太喜欢，但因为各种原因在坚持'},{value:'lost',label:'不喜欢但也不知道该做什么别的'}], required:false },
  { id:'passion-010', domain:'passion', layer:'factual', type:'radio',
    text:'你有没有过"忘记时间沉浸在某件事里"的经历？', options:[
      {value:'frequent',label:'经常——每周都有'},{value:'sometimes',label:'偶尔——每个月有一两次'},{value:'rare',label:'很少——一年几次'},{value:'past',label:'以前有，现在没有了'},{value:'never',label:'好像从来没有过'}], required:false },
  { id:'passion-011', domain:'passion', layer:'factual', type:'checkbox',
    text:'让你产生过"心流"——全然投入忘记时间——的活动有哪些？（可多选）', options:[
      {value:'coding',label:'写代码/做项目'},{value:'writing',label:'写作'},{value:'art',label:'创作（画画/音乐/手工）'},{value:'sports',label:'运动'},{value:'reading',label:'阅读'},{value:'gaming',label:'打游戏'},{value:'puzzle',label:'解谜/推理'},{value:'teach',label:'教别人/做分享'},{value:'talk',label:'深度对话'},{value:'none',label:'不太确定什么是心流'}], required:false },
  { id:'passion-012', domain:'passion', layer:'factual', type:'radio',
    text:'你从小到大，有没有"别人都说好但你就是不喜欢"的事情？', options:[
      {value:'many',label:'有很多'},{value:'some',label:'有几件'},{value:'one',label:'有一件印象特别深的'},{value:'no',label:'好像没有——我什么都愿意试试'},{value:'unsure',label:'不太确定'}], required:false },
  { id:'passion-013', domain:'passion', layer:'factual', type:'ranking',
    text:'请按"对你生活满意度的贡献"排列以下方面', options:[
      {value:'interest',label:'做自己感兴趣的事'},{value:'people',label:'和喜欢的人在一起'},{value:'growth',label:'感受到自己在进步'},{value:'recognition',label:'被认可/有成就感'},{value:'freedom',label:'有自由支配的时间'}], required:false },

  // --- 感知层 30 题 ---
  // Ikigai: what you love / passion (4题)
  { id:'passion-014', domain:'passion', layer:'perceptual', type:'likert5',
    text:'我清楚地知道自己真正热爱什么', options:[{value:1,label:'完全不知道'},{value:5,label:'非常清楚'}], required:false, framework:'ikigai', dimension:'passion' },
  { id:'passion-015', domain:'passion', layer:'perceptual', type:'likert7',
    text:'你目前的生活中，"做自己喜欢的事"和"做必须做的事"的比例？', options:[{value:1,label:'几乎全是必须做的'},{value:7,label:'几乎全是我喜欢的'}], required:false, framework:'ikigai', dimension:'passion' },
  { id:'passion-016', domain:'passion', layer:'perceptual', type:'slider',
    text:'你的"热爱雷达"——对兴趣的感知有多敏锐？', options:[{value:0,label:'麻木——不知道自己喜欢什么'},{value:50,label:''},{value:100,label:'敏锐——总能发现新兴趣'}], required:false, framework:'ikigai', dimension:'passion' },
  { id:'passion-017', domain:'passion', layer:'perceptual', type:'likert5',
    text:'即使没有人关注或认可，我也能从自己的兴趣中获得持久的满足感', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'ikigai', dimension:'passion' },
  // Ikigai: what the world needs / mission (3题)
  { id:'passion-018', domain:'passion', layer:'perceptual', type:'likert5',
    text:'我感觉到自己有一种"应该为世界做点什么"的内在驱动', options:[{value:1,label:'完全没有'},{value:5,label:'非常强烈'}], required:false, framework:'ikigai', dimension:'mission' },
  { id:'passion-019', domain:'passion', layer:'perceptual', type:'likert7',
    text:'你觉得自己的存在能让他人/世界变得更好的程度？', options:[{value:1,label:'几乎没有任何影响'},{value:7,label:'我能带来很大的积极改变'}], required:false, framework:'ikigai', dimension:'mission' },
  { id:'passion-020', domain:'passion', layer:'perceptual', type:'likert5',
    text:'当我看到社会上的某些问题（贫富差距、环境污染、教育不公等），我会产生"我想做点什么"的冲动', options:[{value:1,label:'从不'},{value:5,label:'总是'}], required:false, framework:'ikigai', dimension:'mission' },
  // Ikigai: what you can be paid for / vocation (3题)
  { id:'passion-021', domain:'passion', layer:'perceptual', type:'likert5',
    text:'我认为自己热爱的事情最终可以转化为可维持生计的职业', options:[{value:1,label:'完全没可能'},{value:5,label:'非常有信心'}], required:false, framework:'ikigai', dimension:'vocation' },
  { id:'passion-022', domain:'passion', layer:'perceptual', type:'likert5',
    text:'我愿意为了把兴趣变成职业而接受初期收入较低的现实', options:[{value:1,label:'完全不愿意'},{value:5,label:'非常愿意'}], required:false, framework:'ikigai', dimension:'vocation' },
  { id:'passion-023', domain:'passion', layer:'perceptual', type:'slider',
    text:'你的"兴趣变现力"——目前能把热爱转化为收入的程度？', options:[{value:0,label:'完全没有变现'},{value:50,label:''},{value:100,label:'已经完全可以靠它生活'}], required:false, framework:'ikigai', dimension:'vocation' },
  // Ikigai: what you are good at / profession (2题)
  { id:'passion-024', domain:'passion', layer:'perceptual', type:'likert5',
    text:'我热爱的事情恰好也是我擅长的事情', options:[{value:1,label:'完全不符合——喜欢但不擅长'},{value:5,label:'完全符合——热爱且擅长'}], required:false, framework:'ikigai', dimension:'profession' },
  { id:'passion-025', domain:'passion', layer:'perceptual', type:'likert7',
    text:'你在"热爱之事"上的投入产出比——付出的努力是否带来了相应成长？', options:[{value:1,label:'投入很多但进步很慢'},{value:7,label:'投入就有回报，成长迅速'}], required:false, framework:'ikigai', dimension:'profession' },
  // Schwartz: benevolence 仁爱 (2题)
  { id:'passion-026', domain:'passion', layer:'perceptual', type:'likert5',
    text:'帮助他人成长/渡过难关本身就能给我带来巨大的满足感', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'schwartz', dimension:'benevolence' },
  { id:'passion-027', domain:'passion', layer:'perceptual', type:'likert7',
    text:'"让身边的人过得更好"在你人生追求中的优先级？', options:[{value:1,label:'几乎不关心'},{value:7,label:'最高优先级'}], required:false, framework:'schwartz', dimension:'benevolence' },
  // Schwartz: universalism 普世 (2题)
  { id:'passion-028', domain:'passion', layer:'perceptual', type:'likert5',
    text:'我对环境保护、社会公正、世界和平等议题有深切的关注', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'schwartz', dimension:'universalism' },
  { id:'passion-029', domain:'passion', layer:'perceptual', type:'slider',
    text:'你的"世界公民"意识——对超越自身利益的人类共同议题的关心程度？', options:[{value:0,label:'只关心自己的小圈子'},{value:50,label:''},{value:100,label:'心怀天下'}], required:false, framework:'schwartz', dimension:'universalism' },
  // Schwartz: self-direction 自主 (2题)
  { id:'passion-030', domain:'passion', layer:'perceptual', type:'likert5',
    text:'自由选择自己想走的路，比走一条被规划好的"稳妥"道路更重要', options:[{value:1,label:'完全不同意'},{value:5,label:'完全同意'}], required:false, framework:'schwartz', dimension:'self-direction' },
  { id:'passion-031', domain:'passion', layer:'perceptual', type:'likert5',
    text:'我不喜欢被告诉"应该做什么"——我需要自己做决定', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'schwartz', dimension:'self-direction' },
  // Schwartz: stimulation 刺激 (2题)
  { id:'passion-032', domain:'passion', layer:'perceptual', type:'likert5',
    text:'我追求新鲜刺激的体验，重复的日常让我感到窒息', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'schwartz', dimension:'stimulation' },
  { id:'passion-033', domain:'passion', layer:'perceptual', type:'likert7',
    text:'"冒险和尝试新事物"对你生活幸福感的重要程度？', options:[{value:1,label:'完全不重要'},{value:7,label:'极其重要'}], required:false, framework:'schwartz', dimension:'stimulation' },
  // Schwartz: achievement 成就 (1题)
  { id:'passion-034', domain:'passion', layer:'perceptual', type:'likert5',
    text:'在热爱的事情上取得成就——被认可、拿奖、成为专家——对我很重要', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'schwartz', dimension:'achievement' },
  // Enneagram 动机自评 (9题)
  { id:'passion-035', domain:'passion', layer:'perceptual', type:'likert5',
    text:'我内心有一把标尺，时刻在衡量自己是否"做对了"——追求完美和正确', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type1' },
  { id:'passion-036', domain:'passion', layer:'perceptual', type:'likert5',
    text:'我被"被需要"的感觉驱动——当别人需要我时，我才觉得自己有价值', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type2' },
  { id:'passion-037', domain:'passion', layer:'perceptual', type:'likert5',
    text:'我的动力来源是"成为最好的"——效率和成果是我衡量自我价值的标准', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type3' },
  { id:'passion-038', domain:'passion', layer:'perceptual', type:'likert5',
    text:'驱动我的是一种"缺憾感"——总觉得缺少了什么，渴望找到独特的意义', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type4' },
  { id:'passion-039', domain:'passion', layer:'perceptual', type:'likert5',
    text:'我的热情在于"理解世界"——收集知识、分析规律、建立体系', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type5' },
  { id:'passion-040', domain:'passion', layer:'perceptual', type:'likert5',
    text:'我做的很多事情背后是"安全焦虑"——提前预判风险、寻找可靠的锚点', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type6' },
  { id:'passion-041', domain:'passion', layer:'perceptual', type:'likert5',
    text:'驱动我的是"对快乐的追逐"——我害怕无聊，永远在寻找下一个有趣的体验', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type7' },
  { id:'passion-042', domain:'passion', layer:'perceptual', type:'likert5',
    text:'我骨子里有一股"不服"的劲儿——想掌控、想主导、不想被任何人压制', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type8' },
  { id:'passion-043', domain:'passion', layer:'perceptual', type:'likert5',
    text:'我的驱动力是"内心的平和"——比起出人头地，我更在意自在和舒适', options:[{value:1,label:'完全不符合'},{value:5,label:'完全符合'}], required:false, framework:'enneagram', dimension:'type9' },

  // --- 叙事层 20 题 ---
  { id:'passion-044', domain:'passion', layer:'narrative', type:'longtext',
    text:'描述一次你"完全沉浸在热爱之事中忘了整个世界"的经历——你在做什么？那种感觉是什么样的？', required:false },
  { id:'passion-045', domain:'passion', layer:'narrative', type:'shorttext',
    text:'如果你不需要担心钱，你会如何度过你的一生？请尽量具体地描述', maxLength:300, required:false },
  { id:'passion-046', domain:'passion', layer:'narrative', type:'shorttext',
    text:'你有没有过一个"一见钟情"的兴趣——第一次接触就知道"这就是我要做的事"？是什么？', maxLength:250, required:false },
  { id:'passion-047', domain:'passion', layer:'narrative', type:'longtext',
    text:'你觉得自己"活着就是为了做某件事"吗？那件事是什么？你是如何发现的？', required:false },
  { id:'passion-048', domain:'passion', layer:'narrative', type:'shorttext',
    text:'有没有一件事，你明知道做它"不划算"（赚不到钱、没人在乎、甚至不被理解），但你还是想做？为什么？', maxLength:300, required:false },
  { id:'passion-049', domain:'passion', layer:'narrative', type:'shorttext',
    text:'你的家人/朋友怎么看你热爱的事情？他们的态度是否影响了你的选择？', maxLength:250, required:false },
  { id:'passion-050', domain:'passion', layer:'narrative', type:'shorttext',
    text:'回顾你从小到大"喜欢过"的事情——它们之间有没有一条共同的线索或主题？', maxLength:300, required:false },
  { id:'passion-051', domain:'passion', layer:'narrative', type:'longtext',
    text:'如果你在某个兴趣上投入了几年时间却"一事无成"——没有成就、没有认可、没有变现——你会后悔吗？为什么？', required:false },
  { id:'passion-052', domain:'passion', layer:'narrative', type:'shorttext',
    text:'你有没有亲手"杀死"过自己的某个热爱？因为什么？', maxLength:250, required:false },
  { id:'passion-053', domain:'passion', layer:'narrative', type:'shorttext',
    text:'你觉得"热爱"和"擅长"之间是什么关系？你更愿意做自己热爱但不擅长的事，还是擅长但不热爱的事？', maxLength:250, required:false },
  { id:'passion-054', domain:'passion', layer:'narrative', type:'shorttext',
    text:'描述一个你羡慕甚至嫉妒的人——ta 拥有什么样的热情/生活方式是你渴望的？', maxLength:250, required:false },
  { id:'passion-055', domain:'passion', layer:'narrative', type:'shorttext',
    text:'你认为"热情"是可以培养的，还是天生的？你自己的经历支持哪个观点？', maxLength:250, required:false },
  { id:'passion-056', domain:'passion', layer:'narrative', type:'longtext',
    text:'你有没有经历过"热情消退"——曾经无比热爱的事情突然变得索然无味？发生了什么？你后来怎么面对的？', required:false },
  { id:'passion-057', domain:'passion', layer:'narrative', type:'shorttext',
    text:'如果你要给一个比你小 5 岁的人一条关于"寻找热情"的建议，你会说什么？', maxLength:250, required:false },
  { id:'passion-058', domain:'passion', layer:'narrative', type:'shorttext',
    text:'你现在"最遗憾没去尝试"的一件事是什么？是什么阻止了你？', maxLength:250, required:false },
  { id:'passion-059', domain:'passion', layer:'narrative', type:'shorttext',
    text:'有没有一件事是你觉得"未来一定会去做"的？它是什么？你在等什么？', maxLength:250, required:false },
  { id:'passion-060', domain:'passion', layer:'narrative', type:'longtext',
    text:'设想 10 年后的某一天——你理想中的"充满热情的一天"是什么样的？从早上睁开眼到晚上入睡，你在做什么？', required:false },
  { id:'passion-061', domain:'passion', layer:'narrative', type:'shorttext',
    text:'你觉得自己身上的"热情之火"目前处于什么状态——熊熊燃烧、小火慢炖、还是快要熄灭了？', maxLength:200, required:false },
  { id:'passion-062', domain:'passion', layer:'narrative', type:'shorttext',
    text:'如果"热情"是一种会被消耗的资源——你觉得自己目前是在消耗它、补充它、还是透支它？你现在做的哪些事情是在滋养热情，哪些是在损耗热情？', maxLength:300, required:false },
  { id:'passion-063', domain:'passion', layer:'narrative', type:'longtext',
    text:'经过以上所有关于"热情"的回顾与思考，你现在对自己的"热爱"有没有新的发现？如果今天就要做一个决定——你接下来一年会把最多的热情投注在什么事情上？', required:false },

  /* ========================================================
     六、成长叙事 (80 题)
     框架引用：叙事心理学（McAdams）, Ikigai
     ======================================================== */

  // --- 事实层 20 题 ---
  { id:'history-001', domain:'history', layer:'factual', type:'checkbox',
    text:'你经历过以下哪些重大人生事件？（可多选）', options:[
      {value:'move',label:'搬家/转学'},{value:'exam',label:'重大考试（中考/高考/考研等）'},{value:'loss',label:'失去重要的人（亲人/朋友）'},{value:'illness',label:'自己或家人患重病'},{value:'achieve',label:'取得重要成就/突破'},{value:'fail',label:'重大失败/打击'},{value:'abroad',label:'出国/异地生活'},{value:'love',label:'初恋/重要感情'},{value:'bully',label:'被霸凌/排斥'},{value:'transform',label:'人生观念的根本转变'}], required:false },
  { id:'history-002', domain:'history', layer:'factual', type:'radio',
    text:'你的童年（12 岁以前）整体基调是？', options:[
      {value:'happy',label:'快乐无忧'},{value:'mixed',label:'有苦有甜'},{value:'lonely',label:'比较孤独'},{value:'difficult',label:'比较艰难'},{value:'vague',label:'记不太清了'}], required:false },
  { id:'history-003', domain:'history', layer:'factual', type:'radio',
    text:'你成长过程中，家庭经济状况属于？', options:[
      {value:'affluent',label:'富裕'},{value:'comfortable',label:'小康'},{value:'modest',label:'普通'},{value:'struggling',label:'比较拮据'},{value:'changed',label:'经历过明显的变化'}], required:false },
  { id:'history-004', domain:'history', layer:'factual', type:'radio',
    text:'你是否有过转学/换城市生活的经历？', options:[
      {value:'multiple',label:'多次（3次及以上）'},{value:'few',label:'一两次'},{value:'once',label:'一次'},{value:'none',label:'一直没怎么挪过窝'}], required:false },
  { id:'history-005', domain:'history', layer:'factual', type:'checkbox',
    text:'在你成长过程中，哪些人对你产生了深远影响？（可多选）', options:[
      {value:'parent',label:'父母中的一方或双方'},{value:'grandparent',label:'祖辈'},{value:'teacher',label:'某位老师'},{value:'friend',label:'某位朋友'},{value:'mentor',label:'一位导师/前辈'},{value:'rival',label:'一位竞争对手'},{value:'author',label:'某本书的作者/某个思想领袖'},{value:'stranger',label:'一位陌生人的一句话/一个举动'}], required:false },
  { id:'history-006', domain:'history', layer:'factual', type:'radio',
    text:'你经历过的最大的一次"失败"属于什么类型？', options:[
      {value:'academic',label:'学业上的（考试失利/挂科/落榜）'},{value:'relationship',label:'关系上的（决裂/分手/被排斥）'},{value:'career',label:'事业上的（被拒/项目失败）'},{value:'health',label:'健康上的'},{value:'self',label:'自我期待的落空——没有成为想成为的人'},{value:'none',label:'好像还没有经历过什么重大失败'}], required:false },
  { id:'history-007', domain:'history', layer:'factual', type:'checkbox',
    text:'你取得过哪些让你"为自己骄傲"的成就？（可多选）', options:[
      {value:'academic',label:'学业/学术成就'},{value:'competition',label:'竞赛获奖'},{value:'project',label:'完成一个有分量的项目/作品'},{value:'leadership',label:'带领团队做成了一件事'},{value:'overcome',label:'克服了一个长期困扰自己的问题'},{value:'help',label:'帮到了某个人/某个群体'},{value:'independence',label:'实现了经济/生活独立'},{value:'recognition',label:'获得了重要的认可/荣誉'}], required:false },
  { id:'history-008', domain:'history', layer:'factual', type:'radio',
    text:'你觉得迄今为止人生的"转折点"有几个？', options:[
      {value:'many',label:'很多——人生充满转折'},{value:'few',label:'两三个——关键的几步'},{value:'one',label:'就一次——彻底改变了轨迹'},{value:'none',label:'似乎一直是平稳延续的'},{value:'unclear',label:'不太确定哪些算转折点'}], required:false },
  { id:'history-009', domain:'history', layer:'factual', type:'radio',
    text:'你父母的教养方式更接近哪种？', options:[
      {value:'authoritative',label:'温暖但有边界——讲道理，给自主空间'},{value:'authoritarian',label:'严格/控制——规矩多，不太商量'},{value:'permissive',label:'宽松/放养——基本不管'},{value:'neglectful',label:'忽视/缺席——情感或物理上不在场'},{value:'inconsistent',label:'不一致——爸妈风格差异很大'}], required:false },
  { id:'history-010', domain:'history', layer:'factual', type:'radio',
    text:'你成长中是否有过"被寄予厚望"的感觉？', options:[
      {value:'heavy',label:'压力很大——感觉背负着整个家庭的期望'},{value:'moderate',label:'有一定期望但还能承受'},{value:'light',label:'没什么压力——家人比较佛系'},{value:'none',label:'好像没人在乎我的表现'},{value:'self',label:'压力主要来自我自己'}], required:false },
  { id:'history-011', domain:'history', layer:'factual', type:'checkbox',
    text:'你成长过程中有过哪些"边缘体验"？（可多选）', options:[
      {value:'outsider',label:'曾是"局外人"——在某个群体中格格不入'},{value:'minority',label:'在某个环境中属于少数群体'},{value:'invisible',label:'被忽视/被当作透明人'},{value:'misunderstood',label:'长期被误解'},{value:'different',label:'觉得自己"和别人不一样"但说不出哪里不一样'},{value:'none',label:'没有特别的感觉'}], required:false },
  { id:'history-012', domain:'history', layer:'factual', type:'radio',
    text:'你至今还保留着童年的哪些东西？（实物层面）', options:[
      {value:'many',label:'保留了很多——玩具/照片/日记/信件'},{value:'some',label:'保留了一些重要的'},{value:'few',label:'只有零星一点'},{value:'none',label:'基本都丢了'},{value:'digital',label:'有照片/电子存档'}], required:false },
  { id:'history-013', domain:'history', layer:'factual', type:'radio',
    text:'你的中学时代（初中+高中）整体体验是？', options:[
      {value:'great',label:'很美好——有很多美好回忆'},{value:'ok',label:'还行——有好的也有不好的'},{value:'survive',label:'熬过来的——不想重来'},{value:'isolated',label:'孤独——没什么归属感'},{value:'mixed',label:'初中和高中差别很大'}], required:false },
  { id:'history-014', domain:'history', layer:'factual', type:'radio',
    text:'你有没有"如果能重来，那段时间我一定会换个活法"的阶段？', options:[
      {value:'definitely',label:'有——非常明确是哪个阶段'},{value:'maybe',label:'有——但不确定换了会不会更好'},{value:'no',label:'没有——每个阶段都是必经之路'},{value:'current',label:'现在就是这个阶段'}], required:false },
  { id:'history-015', domain:'history', layer:'factual', type:'checkbox',
    text:'你的"人生故事"中反复出现的主题有哪些？（可多选）', options:[
      {value:'overcome',label:'克服困难/逆袭'},{value:'search',label:'寻找/探索'},{value:'loss',label:'失去/告别'},{value:'growth',label:'成长/蜕变'},{value:'belong',label:'寻找归属'},{value:'freedom',label:'挣脱束缚/追求自由'},{value:'prove',label:'证明自己'},{value:'connect',label:'连接/爱'}], required:false },
  { id:'history-016', domain:'history', layer:'factual', type:'radio',
    text:'你有没有一个"如果当时没有发生……我现在会是完全不同的一个人"的关键事件？', options:[
      {value:'clear',label:'有，而且非常清楚是哪个事件'},{value:'vague',label:'有模糊的感觉但说不上来具体是哪个'},{value:'multiple',label:'不是一件事而是一系列事'},{value:'no',label:'好像没有——感觉一切是自然延续的'}], required:false },
  { id:'history-017', domain:'history', layer:'factual', type:'radio',
    text:'你对自己的名字（以及它的含义/由来）的认同程度？', options:[
      {value:'proud',label:'很喜欢——它就是我的一部分'},{value:'ok',label:'还可以——没特别的感觉'},{value:'dislike',label:'不太喜欢'},{value:'changed',label:'想过改名/已经改名'},{value:'curious',label:'想了解更多名字背后的故事'}], required:false },
  { id:'history-018', domain:'history', layer:'factual', type:'radio',
    text:'你对家族历史的了解程度？', options:[
      {value:'deep',label:'很了解——听过很多家族故事'},{value:'some',label:'知道一些'},{value:'little',label:'只知道父母这一辈'},{value:'none',label:'几乎一无所知'},{value:'uninterested',label:'不太关心'}], required:false },
  { id:'history-019', domain:'history', layer:'factual', type:'radio',
    text:'你有没有经历过让你"一夜成长"的事？', options:[
      {value:'yes',label:'有——那件事之后我变了个人'},{value:'gradual',label:'更多是渐进的——没有哪个单一事件'},{value:'no',label:'没有——我还挺平稳的'},{value:'ongoing',label:'现在正在经历'}], required:false },
  { id:'history-020', domain:'history', layer:'factual', type:'ranking',
    text:'请按"对你人生轨迹影响的大小"排列以下因素', options:[
      {value:'family',label:'家庭环境'},{value:'education',label:'教育经历'},{value:'person',label:'某个重要他人'},{value:'event',label:'某个关键事件'},{value:'self',label:'自己的性格/选择'}], required:false },

  // --- 感知层 15 题 ---
  // 成长满意度 (3题)
  { id:'history-021', domain:'history', layer:'perceptual', type:'likert5',
    text:'回顾到目前为止的人生，我对自己走过的路感到满意', options:[{value:1,label:'完全不满意'},{value:5,label:'非常满意'}], required:false, framework:'ikigai' },
  { id:'history-022', domain:'history', layer:'perceptual', type:'slider',
    text:'你的"人生满意度曲线"——如果现在让你给不同阶段的满意度打分，你觉得自己是在上升还是下降？', options:[{value:0,label:'逐年下降'},{value:50,label:''},{value:100,label:'逐年上升'}], required:false, framework:'ikigai' },
  { id:'history-023', domain:'history', layer:'perceptual', type:'likert7',
    text:'你觉得自己目前处于人生的哪个阶段？', options:[{value:1,label:'迷茫期——不知道往哪走'},{value:7,label:'明确期——方向清晰，正在发力'}], required:false, framework:'ikigai' },
  // 叙事连续性 / coherence (3题)
  { id:'history-024', domain:'history', layer:'perceptual', type:'likert5',
    text:'我能把过去的经历串成一条有因果关系的、完整的人生故事线', options:[{value:1,label:'完全串不起来——人生很碎片化'},{value:5,label:'非常清晰连贯'}], required:false, framework:'narrative-psychology', dimension:'coherence' },
  { id:'history-025', domain:'history', layer:'perceptual', type:'likert5',
    text:'我觉得过去的"我"和现在的"我"是同一个人——有连续的身份感', options:[{value:1,label:'完全不觉得——我好像变了一个人'},{value:5,label:'完全觉得——我就是我'}], required:false, framework:'narrative-psychology', dimension:'coherence' },
  { id:'history-026', domain:'history', layer:'perceptual', type:'likert7',
    text:'你的人生故事有一个明确的"主题"吗？', options:[{value:1,label:'完全没有——感觉是随机事件'},{value:7,label:'有明确的主题——我能用一句话概括'}], required:false, framework:'narrative-psychology', dimension:'coherence' },
  // 能动性 / agency (2题)
  { id:'history-027', domain:'history', layer:'perceptual', type:'likert5',
    text:'在我的人生故事中，我更多是"主动的选择者"而非"被动的承受者"', options:[{value:1,label:'完全被动——都是被推着走'},{value:5,label:'完全主动——我掌控自己的方向'}], required:false, framework:'narrative-psychology', dimension:'agency' },
  { id:'history-028', domain:'history', layer:'perceptual', type:'slider',
    text:'你在自己人生中的"主角感"——你觉得自己是你故事的主角吗？', options:[{value:0,label:'我感觉自己是个配角'},{value:50,label:''},{value:100,label:'我绝对是主角'}], required:false, framework:'narrative-psychology', dimension:'agency' },
  // 抗逆力 / resilience (2题)
  { id:'history-029', domain:'history', layer:'perceptual', type:'likert5',
    text:'经历挫折后，我通常能变得更强——不是恢复原状，而是升级', options:[{value:1,label:'完全不符合——挫折让我更弱'},{value:5,label:'完全符合——挫折是我的成长催化剂'}], required:false, framework:'narrative-psychology', dimension:'redemption' },
  { id:'history-030', domain:'history', layer:'perceptual', type:'likert7',
    text:'你从最近的重大挫折中恢复/成长的程度？', options:[{value:1,label:'还没走出来'},{value:7,label:'已经完全消化并从中获得了力量'}], required:false, framework:'narrative-psychology', dimension:'redemption' },
  // 感恩与后悔 (2题)
  { id:'history-031', domain:'history', layer:'perceptual', type:'likert5',
    text:'我常常对生命中遇到的人和事心怀感激', options:[{value:1,label:'很少感激'},{value:5,label:'常常感激'}], required:false, framework:'narrative-psychology', dimension:'meaning-making' },
  { id:'history-032', domain:'history', layer:'perceptual', type:'likert7',
    text:'你对人生中的"遗憾"的态度？', options:[{value:1,label:'后悔的事情很多，常常回想'},{value:7,label:'基本没有遗憾——每件事都有其意义'}], required:false, framework:'narrative-psychology', dimension:'contamination' },
  // 时间观 (3题)
  { id:'history-033', domain:'history', layer:'perceptual', type:'slider',
    text:'你的时间注意力分配——你更多活在过去、现在还是未来？', options:[{value:0,label:'活在过去'},{value:50,label:'活在当下'},{value:100,label:'活在未来'}], required:false, framework:'narrative-psychology', dimension:'coherence' },
  { id:'history-034', domain:'history', layer:'perceptual', type:'likert5',
    text:'我经常回忆过去，那些记忆对我来说是很重要的情感资源', options:[{value:1,label:'完全不符合——我很少回忆'},{value:5,label:'完全符合——回忆是我的重要养分'}], required:false, framework:'narrative-psychology', dimension:'coherence' },
  { id:'history-035', domain:'history', layer:'perceptual', type:'likert5',
    text:'我对未来有一个清晰的愿景——知道自己大概往哪个方向走', options:[{value:1,label:'完全模糊'},{value:5,label:'非常清晰'}], required:false, framework:'ikigai' },

  // --- 叙事层 45 题 ---
  // 童年记忆 (6题)
  { id:'history-036', domain:'history', layer:'narrative', type:'longtext',
    text:'描述你最早的童年记忆——越具体越好。那个画面为什么留在了你的脑海里？', required:false },
  { id:'history-037', domain:'history', layer:'narrative', type:'shorttext',
    text:'你小时候最害怕的一件事是什么？现在回头看，那个恐惧说明了什么？', maxLength:300, required:false },
  { id:'history-038', domain:'history', layer:'narrative', type:'shorttext',
    text:'你童年时代有过一个"秘密基地"吗？一个只属于你的地方——可能是真实的，也可能是想象中的。描述它', maxLength:300, required:false },
  { id:'history-039', domain:'history', layer:'narrative', type:'shorttext',
    text:'你第一次意识到"世界不只是围着我转"是什么时候？', maxLength:250, required:false },
  { id:'history-040', domain:'history', layer:'narrative', type:'longtext',
    text:'描述你童年/青少年时期最快乐的一段时光——你在哪里？和谁在一起？在做什么？那段时光对你后来的性格/选择有什么影响？', required:false },
  { id:'history-041', domain:'history', layer:'narrative', type:'shorttext',
    text:'你小时候的梦想是什么（比如"长大想当什么"）？那个梦想现在还残留在你身上吗？', maxLength:250, required:false },

  // 关键转折故事 (7题)
  { id:'history-042', domain:'history', layer:'narrative', type:'longtext',
    text:'讲述你人生中最重要的一次转折——是什么事件触发了它？在转折之前你是怎样的人，之后又变成了怎样的人？', required:false },
  { id:'history-043', domain:'history', layer:'narrative', type:'shorttext',
    text:'你人生中有没有一个"如果没有遇见 ta，我的人生将完全不同"的人？讲讲你们的故事', maxLength:300, required:false },
  { id:'history-044', domain:'history', layer:'narrative', type:'shorttext',
    text:'你有没有在某个时刻主动选择了一条"更难的路"？为什么？现在回头看，值得吗？', maxLength:300, required:false },
  { id:'history-045', domain:'history', layer:'narrative', type:'longtext',
    text:'讲述一次你"被打击到谷底"然后又重新站起来的故事。那次经历给你留下了什么"伤疤"？那个"伤疤"现在还有感觉吗？', required:false },
  { id:'history-046', domain:'history', layer:'narrative', type:'shorttext',
    text:'你有没有经历过一次"顿悟"——突然看明白了一个困扰你很久的问题，或者理解了某个人的行为？那一刻发生了什么？', maxLength:300, required:false },
  { id:'history-047', domain:'history', layer:'narrative', type:'longtext',
    text:'讲述一个"你错过的机会"的故事——错过了什么？当时为什么错过？现在回头看，那个错过是好事还是坏事？', required:false },
  { id:'history-048', domain:'history', layer:'narrative', type:'shorttext',
    text:'如果把你的人生分成几个"章节"，每个章节的标题会是什么？', maxLength:300, required:false },

  // 人生曲线图描述 (3题)
  { id:'history-049', domain:'history', layer:'narrative', type:'longtext',
    text:'画一条你人生的"幸福曲线"——横轴是年龄，纵轴是幸福感。描述这条曲线的走势：哪里是高点、哪里是低点？为什么？', required:false },
  { id:'history-050', domain:'history', layer:'narrative', type:'shorttext',
    text:'你现在处于这条幸福曲线的什么位置？你预测接下来会上升还是下降？', maxLength:250, required:false },
  { id:'history-051', domain:'history', layer:'narrative', type:'shorttext',
    text:'如果给你的人生曲线取一个名字——就像一本书的标题——它会是什么？', maxLength:150, required:false },

  // 最重要的教训 (5题)
  { id:'history-052', domain:'history', layer:'narrative', type:'shorttext',
    text:'你从父母（或主要养育者）身上学到的最重要的一课是什么？好的一课还是让你警惕的一课？', maxLength:300, required:false },
  { id:'history-053', domain:'history', layer:'narrative', type:'shorttext',
    text:'你人生中交过的最"贵"的一笔"学费"是什么？——不是钱，是时间/精力/情感上的代价', maxLength:300, required:false },
  { id:'history-054', domain:'history', layer:'narrative', type:'shorttext',
    text:'你做过的最正确的一个决定是什么？当时你是怎么做出这个决定的？', maxLength:300, required:false },
  { id:'history-055', domain:'history', layer:'narrative', type:'longtext',
    text:'你有没有一个"你希望 5 年前的自己就知道"的道理？你为什么花了这么久才明白？', required:false },
  { id:'history-056', domain:'history', layer:'narrative', type:'shorttext',
    text:'你认为自己最重要的三条"人生信条"是什么？每条请用一句话说明它是怎么来的', maxLength:300, required:false },

  // "如果…会怎样"的想象 (5题)
  { id:'history-057', domain:'history', layer:'narrative', type:'longtext',
    text:'如果你出生在一个完全不同的家庭（不同的城市、不同的经济条件、不同的文化背景）——你觉得你会是谁？你会有什么不同？', required:false },
  { id:'history-058', domain:'history', layer:'narrative', type:'shorttext',
    text:'如果当初你在某个关键节点做了不同的选择（比如选了另一个专业、另一所学校、另一座城市）——你觉得你现在会在哪里？在做什么？', maxLength:300, required:false },
  { id:'history-059', domain:'history', layer:'narrative', type:'shorttext',
    text:'如果有一天你醒来发现自己回到了 15 岁——但保留着你现在的所有记忆——你会做的第一件事是什么？', maxLength:250, required:false },
  { id:'history-060', domain:'history', layer:'narrative', type:'shorttext',
    text:'如果有一个"平行宇宙"里的你过着完全不同的生活——你觉得那个版本的你最有可能会做什么？', maxLength:250, required:false },
  { id:'history-061', domain:'history', layer:'narrative', type:'longtext',
    text:'如果你的生命还剩下最后一年——你会怎么过？你会停止做什么？你会开始做什么？那些你一直想但"没时间"去做的事情，在最后一年会排在最前面吗？', required:false },

  // 未完成的事 (5题)
  { id:'history-062', domain:'history', layer:'narrative', type:'shorttext',
    text:'你生命中有没有一段"未完成"的关系——一句没说出口的话、一次没和解的争吵、一个没来得及的告别？', maxLength:300, required:false },
  { id:'history-063', domain:'history', layer:'narrative', type:'shorttext',
    text:'你有没有一个"搁置了很久但总觉得自己有一天会去完成"的梦想或计划？是什么？它被搁置的真正原因是什么？', maxLength:300, required:false },
  { id:'history-064', domain:'history', layer:'narrative', type:'shorttext',
    text:'你心里有没有一个你想道歉但一直没有机会道歉的人？你想对 ta 说什么？', maxLength:250, required:false },
  { id:'history-065', domain:'history', layer:'narrative', type:'longtext',
    text:'你人生中最大的"未竟之事"是什么？不是指每天的任务清单，而是那种真正让你在意、让你偶尔会想起、让你觉得"这件事没做完"的事情', required:false },
  { id:'history-066', domain:'history', layer:'narrative', type:'shorttext',
    text:'如果你现在就可以完成一件"未完成的事"——不需要任何成本——你会完成哪一件？完成之后你会有什么感觉？', maxLength:250, required:false },

  // 对未来的预言信 (7题)
  { id:'history-067', domain:'history', layer:'narrative', type:'longtext',
    text:'给自己写一封"来自 10 年后的信"——10 年后的你，会对现在的你说什么？可能是警告、鼓励、或者一个只有你才懂的笑话', required:false },
  { id:'history-068', domain:'history', layer:'narrative', type:'longtext',
    text:'现在，给 10 年前的自己写一封信——告诉 ta 你所知道的、ta 还不知道的事。你会安慰 ta、警告 ta、还是感谢 ta？', required:false },
  { id:'history-069', domain:'history', layer:'narrative', type:'shorttext',
    text:'你希望 5 年后的你在做什么？越具体越好——在哪座城市、做什么工作、和谁在一起、每天是怎么过的', maxLength:300, required:false },
  { id:'history-070', domain:'history', layer:'narrative', type:'shorttext',
    text:'如果你要给自己的"墓志铭"写一句话——总结你希望你这一生代表什么——会是什么？', maxLength:150, required:false },
  { id:'history-071', domain:'history', layer:'narrative', type:'longtext',
    text:'假设 30 年后有人采访你，问"你这一生最大的成就是什么"——你希望到时候你怎么回答？现在的你离那个回答还有多远？', required:false },
  { id:'history-072', domain:'history', layer:'narrative', type:'shorttext',
    text:'你觉得未来的你会怎么评价现在的你——会感激现在的你做出的努力，还是会遗憾现在的你浪费了时间？', maxLength:250, required:false },
  { id:'history-073', domain:'history', layer:'narrative', type:'longtext',
    text:'你这一生最想留下一个什么样的"印记"——不是具体的东西，而是在某个地方、某个领域、某些人的生命里，你希望因为你的存在而变得不同', required:false },

  // 整合反思 (7题)
  { id:'history-074', domain:'history', layer:'narrative', type:'shorttext',
    text:'回顾你所写下的所有故事，你的人生主题词是什么——用一个词或短语总结你到目前为止的故事', maxLength:100, required:false },
  { id:'history-075', domain:'history', layer:'narrative', type:'shorttext',
    text:'在你的人生故事中，有没有一个"反复出现的困境"——你在不同阶段、不同情境下都被卡在类似的问题里？', maxLength:300, required:false },
  { id:'history-076', domain:'history', layer:'narrative', type:'longtext',
    text:'你认为你的"人生故事"是你自己写的，还是被环境/命运/他人书写的？请结合你的真实经历来讨论', required:false },
  { id:'history-077', domain:'history', layer:'narrative', type:'shorttext',
    text:'你身上有多少来自家庭的"编程"？有哪些观念/习惯/恐惧是你后来才发现"原来这是我从小被灌输的，不一定是我真正认同的"？', maxLength:300, required:false },
  { id:'history-078', domain:'history', layer:'narrative', type:'shorttext',
    text:'你觉得自己在人生的哪个阶段真正"成为自己"了——就是感到"啊，这就是我"？还是说，你还在成为的路上？', maxLength:250, required:false },
  { id:'history-079', domain:'history', layer:'narrative', type:'longtext',
    text:'如果你的人生是一部电影，现在播到了哪里？观众（你自己）对到目前为止的剧情满意吗？接下来的剧情你想怎么发展？你作为"导演"会怎么推进接下来的剧情？', required:false },
  { id:'history-080', domain:'history', layer:'narrative', type:'longtext',
    text:'经过这 80 道题，你对"自己的故事"有没有什么新的理解或感悟？如果有，请写下来——这是你送给未来自己的一份礼物', required:false },];
