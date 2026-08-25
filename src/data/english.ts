import type { EnglishLevel, EnglishUnit } from '../types';

// 主题模板：每个级别10个单元
const themes = [
  { en: 'Family', cn: '家庭', words: [
    { word: 'father', emoji: '👨', phonetic: '/ˈfɑːðər/' },
    { word: 'mother', emoji: '👩', phonetic: '/ˈmʌðər/' },
    { word: 'brother', emoji: '👦', phonetic: '/ˈbrʌðər/' },
    { word: 'sister', emoji: '👧', phonetic: '/ˈsɪstər/' },
    { word: 'grandpa', emoji: '👴', phonetic: '/ˈɡrænpɑː/' },
    { word: 'grandma', emoji: '👵', phonetic: '/ˈɡrænmɑː/' },
  ], sentences: ['This is my father.', 'I love my family.'] },
  { en: 'Animals', cn: '动物', words: [
    { word: 'cat', emoji: '🐱', phonetic: '/kæt/' },
    { word: 'dog', emoji: '🐶', phonetic: '/dɒɡ/' },
    { word: 'bird', emoji: '🐦', phonetic: '/bɜːrd/' },
    { word: 'fish', emoji: '🐟', phonetic: '/fɪʃ/' },
    { word: 'rabbit', emoji: '🐰', phonetic: '/ˈræbɪt/' },
    { word: 'bear', emoji: '🐻', phonetic: '/ber/' },
  ], sentences: ['This is a cat.', 'I like dogs.'] },
  { en: 'Food', cn: '食物', words: [
    { word: 'apple', emoji: '🍎', phonetic: '/ˈæpl/' },
    { word: 'banana', emoji: '🍌', phonetic: '/bəˈnænə/' },
    { word: 'bread', emoji: '🍞', phonetic: '/bred/' },
    { word: 'milk', emoji: '🥛', phonetic: '/mɪlk/' },
    { word: 'cake', emoji: '🍰', phonetic: '/keɪk/' },
    { word: 'egg', emoji: '🥚', phonetic: '/eɡ/' },
  ], sentences: ['I like apples.', 'Do you like milk?'] },
  { en: 'Colors', cn: '颜色', words: [
    { word: 'red', emoji: '🔴', phonetic: '/red/' },
    { word: 'blue', emoji: '🔵', phonetic: '/bluː/' },
    { word: 'yellow', emoji: '🟡', phonetic: '/ˈjeloʊ/' },
    { word: 'green', emoji: '🟢', phonetic: '/ɡriːn/' },
    { word: 'purple', emoji: '🟣', phonetic: '/ˈpɜːrpl/' },
    { word: 'orange', emoji: '🟠', phonetic: '/ˈɔːrɪndʒ/' },
  ], sentences: ['I like red.', 'The sky is blue.'] },
  { en: 'Numbers', cn: '数字', words: [
    { word: 'one', emoji: '1️⃣', phonetic: '/wʌn/' },
    { word: 'two', emoji: '2️⃣', phonetic: '/tuː/' },
    { word: 'three', emoji: '3️⃣', phonetic: '/θriː/' },
    { word: 'four', emoji: '4️⃣', phonetic: '/fɔːr/' },
    { word: 'five', emoji: '5️⃣', phonetic: '/faɪv/' },
    { word: 'six', emoji: '6️⃣', phonetic: '/sɪks/' },
  ], sentences: ['I have two apples.', 'One, two, three!'] },
  { en: 'Body', cn: '身体', words: [
    { word: 'head', emoji: '👤', phonetic: '/hed/' },
    { word: 'eye', emoji: '👁️', phonetic: '/aɪ/' },
    { word: 'nose', emoji: '👃', phonetic: '/noʊz/' },
    { word: 'mouth', emoji: '👄', phonetic: '/maʊθ/' },
    { word: 'hand', emoji: '✋', phonetic: '/hænd/' },
    { word: 'foot', emoji: '🦶', phonetic: '/fʊt/' },
  ], sentences: ['This is my eye.', 'Touch your nose.'] },
  { en: 'School', cn: '学校', words: [
    { word: 'book', emoji: '📖', phonetic: '/bʊk/' },
    { word: 'pen', emoji: '🖊️', phonetic: '/pen/' },
    { word: 'bag', emoji: '🎒', phonetic: '/bæɡ/' },
    { word: 'desk', emoji: '🪑', phonetic: '/desk/' },
    { word: 'teacher', emoji: '👩‍🏫', phonetic: '/ˈtiːtʃər/' },
    { word: 'pencil', emoji: '✏️', phonetic: '/ˈpensl/' },
  ], sentences: ['This is my book.', 'I have a pencil.'] },
  { en: 'Toys', cn: '玩具', words: [
    { word: 'ball', emoji: '⚽', phonetic: '/bɔːl/' },
    { word: 'doll', emoji: '🪆', phonetic: '/dɒl/' },
    { word: 'car', emoji: '🚗', phonetic: '/kɑːr/' },
    { word: 'block', emoji: '🧱', phonetic: '/blɒk/' },
    { word: 'kite', emoji: '🪁', phonetic: '/kaɪt/' },
    { word: 'teddy', emoji: '🧸', phonetic: '/ˈtedi/' },
  ], sentences: ['I have a ball.', 'This is my toy car.'] },
  { en: 'Nature', cn: '自然', words: [
    { word: 'sun', emoji: '☀️', phonetic: '/sʌn/' },
    { word: 'moon', emoji: '🌙', phonetic: '/muːn/' },
    { word: 'star', emoji: '⭐', phonetic: '/stɑːr/' },
    { word: 'tree', emoji: '🌳', phonetic: '/triː/' },
    { word: 'flower', emoji: '🌸', phonetic: '/ˈflaʊər/' },
    { word: 'cloud', emoji: '☁️', phonetic: '/klaʊd/' },
  ], sentences: ['The sun is bright.', 'I see a star.'] },
  { en: 'Transport', cn: '交通', words: [
    { word: 'bus', emoji: '🚌', phonetic: '/bʌs/' },
    { word: 'train', emoji: '🚂', phonetic: '/treɪn/' },
    { word: 'plane', emoji: '✈️', phonetic: '/pleɪn/' },
    { word: 'boat', emoji: '⛵', phonetic: '/boʊt/' },
    { word: 'bike', emoji: '🚲', phonetic: '/baɪk/' },
    { word: 'taxi', emoji: '🚕', phonetic: '/ˈtæksi/' },
  ], sentences: ['I go by bus.', 'The plane is fast.'] },
];

const gameTypes: Array<'listen_select' | 'drag_match' | 'memory'> = ['listen_select', 'drag_match', 'memory'];

function buildLevel(level: number, offset: number): EnglishLevel {
  const units: EnglishUnit[] = themes.map((t, i) => ({
    id: `L${level}-U${i + 1}`,
    level,
    unitNumber: i + 1,
    title: t.en,
    titleCn: t.cn,
    words: t.words,
    sentences: t.sentences,
    gameType: gameTypes[(i + offset) % 3],
  }));
  return { level, name: `Level ${level}`, units };
}

export const englishLevels: EnglishLevel[] = [
  buildLevel(1, 0),
  buildLevel(2, 1),
  buildLevel(3, 2),
];

export function getAllUnits(): EnglishUnit[] {
  return englishLevels.flatMap(l => l.units);
}

export function getUnitById(id: string): EnglishUnit | undefined {
  return getAllUnits().find(u => u.id === id);
}

export function getLevelUnits(level: number): EnglishUnit[] {
  return englishLevels.find(l => l.level === level)?.units || [];
}
