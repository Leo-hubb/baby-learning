import type { AdventureQuestion, ModuleType } from '../types';
import { getAllUnits } from './english';
import { getAllChars } from './literacy';

// 英语听音选图
function generateEnglishQuestion(): AdventureQuestion {
  const units = getAllUnits();
  const unit = units[Math.floor(Math.random() * units.length)];
  const word = unit.words[Math.floor(Math.random() * unit.words.length)];
  const options = [word.emoji];
  const otherWords = unit.words.filter(w => w.word !== word.word);
  while (options.length < 4 && otherWords.length > 0) {
    const idx = Math.floor(Math.random() * otherWords.length);
    if (!options.includes(otherWords[idx].emoji)) options.push(otherWords[idx].emoji);
    otherWords.splice(idx, 1);
  }
  while (options.length < 4) {
    const randomEmoji = ['🍎', '🐱', '🚗', '⭐', '🌸', '🎈', '🐶', '📖'][Math.floor(Math.random() * 8)];
    if (!options.includes(randomEmoji)) options.push(randomEmoji);
  }
  options.sort(() => Math.random() - 0.5);
  return {
    module: 'english',
    type: 'listen_select',
    question: `听发音，选正确的图片`,
    options,
    answer: options.indexOf(word.emoji),
    emoji: '🔊',
    audioText: word.word,
    audioLang: 'en-US',
  };
}

// 汉字听音选字
function generateLiteracyQuestion(): AdventureQuestion {
  const chars = getAllChars();
  const char = chars[Math.floor(Math.random() * chars.length)];
  const options = [char.char];
  while (options.length < 4) {
    const c = chars[Math.floor(Math.random() * chars.length)].char;
    if (!options.includes(c)) options.push(c);
  }
  options.sort(() => Math.random() - 0.5);
  return {
    module: 'literacy',
    type: 'listen_char',
    question: '听读音，选正确的汉字',
    options,
    answer: options.indexOf(char.char),
    emoji: '🔊',
    audioText: char.char,
    audioLang: 'zh-CN',
  };
}

// 数字/加减法
function generateMathQuestion(): AdventureQuestion {
  const isAddition = Math.random() > 0.5;
  let a: number, b: number, answer: number;
  if (isAddition) {
    a = Math.floor(Math.random() * 6) + 1;
    b = Math.floor(Math.random() * (10 - a + 1));
    answer = a + b;
  } else {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * a);
    answer = a - b;
  }
  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const opt = answer + Math.floor(Math.random() * 7) - 3;
    if (opt >= 0 && opt <= 20 && opt !== answer) options.add(opt);
  }
  const optArr = Array.from(options).sort(() => Math.random() - 0.5);
  return {
    module: 'math',
    type: isAddition ? 'addition' : 'subtraction',
    question: isAddition ? `${a} + ${b} = ?` : `${a} - ${b} = ?`,
    options: optArr.map(String),
    answer: optArr.indexOf(answer),
    emoji: isAddition ? '➕' : '➖',
  };
}

// 逻辑题
function generateLogicQuestion(): AdventureQuestion {
  const shapes = ['🔴', '🔵', '🟡', '🟢', '🟣', '⭐', '❤️', '🌸'];
  const patternLen = Math.random() > 0.5 ? 2 : 3;
  const pattern: string[] = [];
  for (let i = 0; i < patternLen; i++) {
    pattern.push(shapes[Math.floor(Math.random() * shapes.length)]);
  }
  const showLen = 4;
  const sequence = Array.from({ length: showLen }, (_, i) => pattern[i % patternLen]);
  const answer = pattern[showLen % patternLen];
  const options = [answer];
  while (options.length < 4) {
    const s = shapes[Math.floor(Math.random() * shapes.length)];
    if (!options.includes(s)) options.push(s);
  }
  options.sort(() => Math.random() - 0.5);
  return {
    module: 'logic',
    type: 'pattern',
    question: `找规律：${sequence.join(' ')} ?`,
    options,
    answer: options.indexOf(answer),
    emoji: '🧩',
  };
}

const generators: Record<ModuleType, () => AdventureQuestion> = {
  english: generateEnglishQuestion,
  literacy: generateLiteracyQuestion,
  math: generateMathQuestion,
  logic: generateLogicQuestion,
  adventure: generateMathQuestion, // fallback
};

export function generateAdventureQuestions(level: number, count: number = 10): AdventureQuestion[] {
  const modules: ModuleType[] = ['english', 'literacy', 'math', 'logic'];
  const questions: AdventureQuestion[] = [];
  // Ensure at least 3 modules represented
  const shuffledModules = [...modules].sort(() => Math.random() - 0.5);
  for (let i = 0; i < count; i++) {
    const mod = i < 4 ? shuffledModules[i % 4] : modules[Math.floor(Math.random() * modules.length)];
    questions.push(generators[mod]());
  }
  return questions;
}
