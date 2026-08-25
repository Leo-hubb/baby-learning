import type { LiteracyLevel, ChineseChar } from '../types';

// 汉字库：按难度分6级，每级精选常用汉字
// 完整600字可在此基础上扩展，数据结构已支持
const charData: ChineseChar[][] = [
  // Level 1 - 最基础数字、人体、自然
  [
    { char: '一', pinyin: 'yī', radical: '一', strokes: 1, words: ['一个', '第一', '一起'], example: '我有一个苹果。' },
    { char: '二', pinyin: 'èr', radical: '二', strokes: 2, words: ['二月', '第二', '二手'], example: '我有二只手。' },
    { char: '三', pinyin: 'sān', radical: '一', strokes: 3, words: ['三个', '三角', '三月'], example: '树上有三只鸟。' },
    { char: '人', pinyin: 'rén', radical: '人', strokes: 2, words: ['大人', '人们', '工人'], example: '他是一个好人。' },
    { char: '口', pinyin: 'kǒu', radical: '口', strokes: 3, words: ['开口', '门口', '口水'], example: '请张开嘴巴。' },
    { char: '手', pinyin: 'shǒu', radical: '手', strokes: 4, words: ['小手', '手指', '双手'], example: '用手摸摸头。' },
    { char: '目', pinyin: 'mù', radical: '目', strokes: 5, words: ['目光', '目的', '耳目'], example: '用眼睛看东西。' },
    { char: '耳', pinyin: 'ěr', radical: '耳', strokes: 6, words: ['耳朵', '木耳', '耳机'], example: '用耳朵听声音。' },
    { char: '日', pinyin: 'rì', radical: '日', strokes: 4, words: ['日子', '日出', '生日'], example: '今天是我的生日。' },
    { char: '月', pinyin: 'yuè', radical: '月', strokes: 4, words: ['月亮', '月光', '一月'], example: '月亮圆圆的。' },
    { char: '水', pinyin: 'shuǐ', radical: '水', strokes: 4, words: ['水果', '喝水', '口水'], example: '我要喝水。' },
    { char: '火', pinyin: 'huǒ', radical: '火', strokes: 4, words: ['火车', '大火', '火山'], example: '火车开得很快。' },
    { char: '山', pinyin: 'shān', radical: '山', strokes: 3, words: ['大山', '山上', '爬山'], example: '我们去爬山。' },
    { char: '石', pinyin: 'shí', radical: '石', strokes: 5, words: ['石头', '石子', '宝石'], example: '地上有一块石头。' },
    { char: '田', pinyin: 'tián', radical: '田', strokes: 5, words: ['田地', '田野', '稻田'], example: '田野里有稻子。' },
    { char: '土', pinyin: 'tǔ', radical: '土', strokes: 3, words: ['土地', '泥土', '土豆'], example: '泥土里有虫子。' },
    { char: '大', pinyin: 'dà', radical: '大', strokes: 3, words: ['大人', '大门', '大小'], example: '大象很大。' },
    { char: '小', pinyin: 'xiǎo', radical: '小', strokes: 3, words: ['小鸟', '小手', '大小'], example: '小鸟在飞。' },
    { char: '上', pinyin: 'shàng', radical: '一', strokes: 3, words: ['上面', '上学', '天上'], example: '我去上学。' },
    { char: '下', pinyin: 'xià', radical: '一', strokes: 3, words: ['下面', '下雨', '上下'], example: '今天下雨了。' },
  ],
  // Level 2 - 常见动物、植物、动作
  [
    { char: '天', pinyin: 'tiān', radical: '大', strokes: 4, words: ['天空', '今天', '天气'], example: '今天天气很好。' },
    { char: '地', pinyin: 'dì', radical: '土', strokes: 6, words: ['土地', '地方', '地球'], example: '地上有花。' },
    { char: '花', pinyin: 'huā', radical: '艹', strokes: 7, words: ['花朵', '花园', '开花'], example: '花园里有很多花。' },
    { char: '草', pinyin: 'cǎo', radical: '艹', strokes: 9, words: ['小草', '草地', '青草'], example: '小草绿绿的。' },
    { char: '树', pinyin: 'shù', radical: '木', strokes: 9, words: ['大树', '树叶', '种树'], example: '树上有小鸟。' },
    { char: '木', pinyin: 'mù', radical: '木', strokes: 4, words: ['木头', '树木', '木马'], example: '这是木头做的。' },
    { char: '鸟', pinyin: 'niǎo', radical: '鸟', strokes: 5, words: ['小鸟', '鸟儿', '飞鸟'], example: '小鸟在唱歌。' },
    { char: '鱼', pinyin: 'yú', radical: '鱼', strokes: 8, words: ['小鱼', '鱼儿', '金鱼'], example: '水里有小鱼。' },
    { char: '虫', pinyin: 'chóng', radical: '虫', strokes: 6, words: ['虫子', '小虫', '毛毛虫'], example: '地上有小虫子。' },
    { char: '马', pinyin: 'mǎ', radical: '马', strokes: 3, words: ['小马', '马车', '木马'], example: '小马跑得很快。' },
    { char: '牛', pinyin: 'niú', radical: '牛', strokes: 4, words: ['小牛', '牛奶', '水牛'], example: '牛在吃草。' },
    { char: '羊', pinyin: 'yáng', radical: '羊', strokes: 6, words: ['小羊', '山羊', '羊毛'], example: '小羊咩咩叫。' },
    { char: '狗', pinyin: 'gǒu', radical: '犭', strokes: 8, words: ['小狗', '狗狗', '黑狗'], example: '小狗汪汪叫。' },
    { char: '猫', pinyin: 'māo', radical: '犭', strokes: 11, words: ['小猫', '猫咪', '花猫'], example: '小猫喵喵叫。' },
    { char: '来', pinyin: 'lái', radical: '木', strokes: 7, words: ['过来', '回来', '来到'], example: '快过来这里。' },
    { char: '去', pinyin: 'qù', radical: '厶', strokes: 5, words: ['出去', '回去', '过去'], example: '我要出去玩。' },
    { char: '走', pinyin: 'zǒu', radical: '走', strokes: 7, words: ['走路', '走开', '行走'], example: '我们走路去学校。' },
    { char: '跑', pinyin: 'pǎo', radical: '足', strokes: 12, words: ['跑步', '奔跑', '快跑'], example: '他在跑步。' },
    { char: '飞', pinyin: 'fēi', radical: '飞', strokes: 3, words: ['飞机', '飞鸟', '起飞'], example: '小鸟在天上飞。' },
    { char: '看', pinyin: 'kàn', radical: '目', strokes: 9, words: ['看见', '看书', '看看'], example: '我在看书。' },
  ],
  // Level 3 - 家庭、食物、日常
  [
    { char: '我', pinyin: 'wǒ', radical: '戈', strokes: 7, words: ['我们', '我的', '自我'], example: '我是一个小朋友。' },
    { char: '你', pinyin: 'nǐ', radical: '亻', strokes: 7, words: ['你们', '你的', '你好'], example: '你好，很高兴认识你。' },
    { char: '他', pinyin: 'tā', radical: '亻', strokes: 5, words: ['他们', '他的', '其他'], example: '他是我的好朋友。' },
    { char: '爸', pinyin: 'bà', radical: '父', strokes: 8, words: ['爸爸', '老爸', '爸妈'], example: '爸爸在工作。' },
    { char: '妈', pinyin: 'mā', radical: '女', strokes: 6, words: ['妈妈', '老妈', '妈咪'], example: '妈妈在做饭。' },
    { char: '哥', pinyin: 'gē', radical: '口', strokes: 10, words: ['哥哥', '大哥', '哥们'], example: '哥哥比我大。' },
    { char: '姐', pinyin: 'jiě', radical: '女', strokes: 8, words: ['姐姐', '大姐', '姐妹'], example: '姐姐在唱歌。' },
    { char: '弟', pinyin: 'dì', radical: '弓', strokes: 7, words: ['弟弟', '兄弟', '小弟'], example: '弟弟很小。' },
    { char: '妹', pinyin: 'mèi', radical: '女', strokes: 8, words: ['妹妹', '姐妹', '小妹'], example: '妹妹很可爱。' },
    { char: '家', pinyin: 'jiā', radical: '宀', strokes: 10, words: ['家里', '大家', '回家'], example: '我爱我的家。' },
    { char: '吃', pinyin: 'chī', radical: '口', strokes: 6, words: ['吃饭', '吃东西', '好吃'], example: '我在吃饭。' },
    { char: '喝', pinyin: 'hē', radical: '口', strokes: 12, words: ['喝水', '喝茶', '喝汤'], example: '我要喝水。' },
    { char: '饭', pinyin: 'fàn', radical: '饣', strokes: 7, words: ['吃饭', '米饭', '早饭'], example: '米饭真香。' },
    { char: '菜', pinyin: 'cài', radical: '艹', strokes: 11, words: ['白菜', '青菜', '种菜'], example: '多吃蔬菜身体好。' },
    { char: '肉', pinyin: 'ròu', radical: '肉', strokes: 6, words: ['猪肉', '牛肉', '鸡肉'], example: '我喜欢吃鸡肉。' },
    { char: '果', pinyin: 'guǒ', radical: '木', strokes: 8, words: ['水果', '苹果', '果园'], example: '苹果是红色的。' },
    { char: '书', pinyin: 'shū', radical: '乙', strokes: 4, words: ['看书', '书本', '读书'], example: '我喜欢看书。' },
    { char: '笔', pinyin: 'bǐ', radical: '竹', strokes: 10, words: ['铅笔', '毛笔', '画笔'], example: '我用铅笔写字。' },
    { char: '字', pinyin: 'zì', radical: '宀', strokes: 6, words: ['写字', '汉字', '文字'], example: '我在学写字。' },
    { char: '学', pinyin: 'xué', radical: '子', strokes: 8, words: ['学习', '学校', '上学'], example: '我爱学习。' },
  ],
  // Level 4 - 动作、形容词、方位
  [
    { char: '好', pinyin: 'hǎo', radical: '女', strokes: 6, words: ['你好', '好人', '好看'], example: '你好，小朋友！' },
    { char: '多', pinyin: 'duō', radical: '夕', strokes: 6, words: ['很多', '多少', '多么'], example: '天上有很多星星。' },
    { char: '少', pinyin: 'shǎo', radical: '小', strokes: 4, words: ['多少', '少数', '减少'], example: '这里的人很少。' },
    { char: '长', pinyin: 'cháng', radical: '长', strokes: 4, words: ['很长', '长短', '长大'], example: '蛇的身体很长。' },
    { char: '短', pinyin: 'duǎn', radical: '矢', strokes: 12, words: ['很短', '长短', '短裤'], example: '兔子的尾巴短。' },
    { char: '高', pinyin: 'gāo', radical: '高', strokes: 10, words: ['很高', '高大', '高山'], example: '长颈鹿很高。' },
    { char: '低', pinyin: 'dī', radical: '亻', strokes: 7, words: ['低头', '高低', '降低'], example: '请低头看。' },
    { char: '快', pinyin: 'kuài', radical: '忄', strokes: 7, words: ['很快', '快乐', '加快'], example: '汽车开得很快。' },
    { char: '慢', pinyin: 'màn', radical: '忄', strokes: 14, words: ['很慢', '快慢', '慢跑'], example: '乌龟走得很慢。' },
    { char: '新', pinyin: 'xīn', radical: '斤', strokes: 13, words: ['新书', '新年', '新鲜'], example: '我有一本新书。' },
    { char: '旧', pinyin: 'jiù', radical: '日', strokes: 5, words: ['旧书', '新旧', '破旧'], example: '这是一本旧书。' },
    { char: '红', pinyin: 'hóng', radical: '纟', strokes: 6, words: ['红色', '红花', '红旗'], example: '苹果是红色的。' },
    { char: '白', pinyin: 'bái', radical: '白', strokes: 5, words: ['白色', '白云', '雪白'], example: '天上有白云。' },
    { char: '黑', pinyin: 'hēi', radical: '黑', strokes: 12, words: ['黑色', '黑夜', '黑板'], example: '晚上天很黑。' },
    { char: '黄', pinyin: 'huáng', radical: '黄', strokes: 11, words: ['黄色', '黄花', '金黄'], example: '香蕉是黄色的。' },
    { char: '绿', pinyin: 'lǜ', radical: '纟', strokes: 11, words: ['绿色', '绿叶', '草绿'], example: '树叶是绿色的。' },
    { char: '蓝', pinyin: 'lán', radical: '艹', strokes: 13, words: ['蓝色', '蓝天', '深蓝'], example: '天空是蓝色的。' },
    { char: '左', pinyin: 'zuǒ', radical: '工', strokes: 5, words: ['左边', '左右', '左手'], example: '举起你的左手。' },
    { char: '右', pinyin: 'yòu', radical: '口', strokes: 5, words: ['右边', '左右', '右手'], example: '举起你的右手。' },
    { char: '前', pinyin: 'qián', radical: '刂', strokes: 9, words: ['前面', '前后', '以前'], example: '前面有一只猫。' },
  ],
  // Level 5 - 时间、天气、交通
  [
    { char: '时', pinyin: 'shí', radical: '日', strokes: 7, words: ['时间', '小时', '有时'], example: '现在是什么时间？' },
    { char: '间', pinyin: 'jiān', radical: '门', strokes: 7, words: ['中间', '房间', '时间'], example: '房间里有一张床。' },
    { char: '年', pinyin: 'nián', radical: '干', strokes: 6, words: ['今年', '新年', '去年'], example: '今年我五岁了。' },
    { char: '今', pinyin: 'jīn', radical: '人', strokes: 4, words: ['今天', '今年', '今后'], example: '今天是星期一。' },
    { char: '明', pinyin: 'míng', radical: '日', strokes: 8, words: ['明天', '明白', '明亮'], example: '明天我们去公园。' },
    { char: '昨', pinyin: 'zuó', radical: '日', strokes: 9, words: ['昨天', '昨晚', '昨日'], example: '昨天下雨了。' },
    { char: '早', pinyin: 'zǎo', radical: '日', strokes: 6, words: ['早上', '早晨', '很早'], example: '早上好！' },
    { char: '晚', pinyin: 'wǎn', radical: '日', strokes: 11, words: ['晚上', '夜晚', '晚饭'], example: '晚上好！' },
    { char: '风', pinyin: 'fēng', radical: '风', strokes: 4, words: ['大风', '风车', '风景'], example: '今天风很大。' },
    { char: '雨', pinyin: 'yǔ', radical: '雨', strokes: 8, words: ['下雨', '雨伞', '大雨'], example: '下雨了，带伞。' },
    { char: '雪', pinyin: 'xuě', radical: '雨', strokes: 11, words: ['下雪', '雪花', '白雪'], example: '冬天下雪了。' },
    { char: '云', pinyin: 'yún', radical: '二', strokes: 4, words: ['白云', '云朵', '乌云'], example: '天上有白云。' },
    { char: '车', pinyin: 'chē', radical: '车', strokes: 4, words: ['汽车', '火车', '自行车'], example: '汽车开得很快。' },
    { char: '船', pinyin: 'chuán', radical: '舟', strokes: 11, words: ['小船', '轮船', '帆船'], example: '小船在水上漂。' },
    { char: '飞', pinyin: 'fēi', radical: '飞', strokes: 3, words: ['飞机', '飞鸟', '起飞'], example: '飞机在天上飞。' },
    { char: '路', pinyin: 'lù', radical: '足', strokes: 13, words: ['马路', '道路', '走路'], example: '过马路要小心。' },
    { char: '桥', pinyin: 'qiáo', radical: '木', strokes: 10, words: ['大桥', '小桥', '石桥'], example: '河上有一座桥。' },
    { char: '城', pinyin: 'chéng', radical: '土', strokes: 9, words: ['城市', '长城', '城里'], example: '城市里有很多人。' },
    { char: '市', pinyin: 'shì', radical: '巾', strokes: 5, words: ['城市', '超市', '市场'], example: '我和妈妈去超市。' },
    { char: '公', pinyin: 'gōng', radical: '八', strokes: 4, words: ['公园', '公共', '公鸡'], example: '我们去公园玩。' },
  ],
  // Level 6 - 综合提升
  [
    { char: '园', pinyin: 'yuán', radical: '囗', strokes: 7, words: ['公园', '花园', '幼儿园'], example: '幼儿园里有很多小朋友。' },
    { char: '玩', pinyin: 'wán', radical: '王', strokes: 8, words: ['玩耍', '玩具', '好玩'], example: '我喜欢玩玩具。' },
    { char: '笑', pinyin: 'xiào', radical: '竹', strokes: 10, words: ['微笑', '笑声', '笑话'], example: '小朋友开心地笑了。' },
    { char: '哭', pinyin: 'kū', radical: '口', strokes: 10, words: ['哭泣', '大哭', '哭声'], example: '小弟弟哭了。' },
    { char: '唱', pinyin: 'chàng', radical: '口', strokes: 11, words: ['唱歌', '合唱', '演唱'], example: '我喜欢唱歌。' },
    { char: '跳', pinyin: 'tiào', radical: '足', strokes: 13, words: ['跳舞', '跳跃', '跳绳'], example: '小兔子在跳舞。' },
    { char: '画', pinyin: 'huà', radical: '田', strokes: 8, words: ['画画', '图画', '画家'], example: '我在画画。' },
    { char: '读', pinyin: 'dú', radical: '讠', strokes: 10, words: ['读书', '阅读', '朗读'], example: '我在读书。' },
    { char: '写', pinyin: 'xiě', radical: '冖', strokes: 5, words: ['写字', '书写', '写作'], example: '我在写字。' },
    { char: '算', pinyin: 'suàn', radical: '竹', strokes: 14, words: ['计算', '算术', '打算'], example: '我会算数了。' },
    { char: '数', pinyin: 'shù', radical: '攵', strokes: 13, words: ['数学', '数字', '数数'], example: '我喜欢数学。' },
    { char: '朋', pinyin: 'péng', radical: '月', strokes: 8, words: ['朋友', '亲朋好友'], example: '他是我的好朋友。' },
    { char: '友', pinyin: 'yǒu', radical: '又', strokes: 4, words: ['朋友', '友好', '友情'], example: '我们是好朋友。' },
    { char: '爱', pinyin: 'ài', radical: '爫', strokes: 10, words: ['爱心', '可爱', '热爱'], example: '我爱爸爸妈妈。' },
    { char: '心', pinyin: 'xīn', radical: '心', strokes: 4, words: ['小心', '开心', '爱心'], example: '过马路要小心。' },
    { char: '想', pinyin: 'xiǎng', radical: '心', strokes: 13, words: ['想念', '想法', '理想'], example: '我想去公园玩。' },
    { char: '能', pinyin: 'néng', radical: '月', strokes: 10, words: ['能够', '能力', '可能'], example: '我能自己穿衣服。' },
    { char: '会', pinyin: 'huì', radical: '人', strokes: 6, words: ['学会', '开会', '机会'], example: '我会骑自行车了。' },
    { char: '要', pinyin: 'yào', radical: '覀', strokes: 9, words: ['需要', '重要', '想要'], example: '我要吃苹果。' },
    { char: '把', pinyin: 'bǎ', radical: '扌', strokes: 7, words: ['把手', '把握', '一把'], example: '请把书给我。' },
  ],
];

export const literacyLevels: LiteracyLevel[] = charData.map((chars, i) => ({
  level: i + 1,
  name: `第${i + 1}级`,
  chars,
}));

export function getAllChars() {
  return charData.flat();
}

export function getCharByIndex(level: number, index: number): ChineseChar | undefined {
  return charData[level - 1]?.[index];
}

export function getLevelChars(level: number): ChineseChar[] {
  return charData[level - 1] || [];
}

export function getTotalCharCount(): number {
  return charData.reduce((sum, level) => sum + level.length, 0);
}
