import type { MathQuestion } from '../types';

// 数字认知 0-20
export const numberCards = Array.from({ length: 21 }, (_, i) => ({
  number: i,
  emoji: i <= 10 ? '⭐'.repeat(i) : '🎈',
  word: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'][i],
}));

// 生成10以内加减法题目
export function generateMathQuestion(type: 'addition' | 'subtraction'): MathQuestion {
  let a: number, b: number, answer: number;
  if (type === 'addition') {
    a = Math.floor(Math.random() * 6) + 1; // 1-6
    b = Math.floor(Math.random() * (10 - a + 1)); // 0 to 10-a
    answer = a + b;
  } else {
    a = Math.floor(Math.random() * 10) + 1; // 1-10
    b = Math.floor(Math.random() * a); // 0 to a-1
    answer = a - b;
  }
  // 生成干扰项
  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 7) - 3; // -3 to 3
    const opt = answer + offset;
    if (opt >= 0 && opt <= 20 && opt !== answer) options.add(opt);
  }
  const optionArr = Array.from(options).sort(() => Math.random() - 0.5);
  return {
    type,
    question: type === 'addition' ? `${a} + ${b} = ?` : `${a} - ${b} = ?`,
    answer,
    options: optionArr,
    emoji: type === 'addition' ? '➕' : '➖',
  };
}

// 数数游戏题目
export function generateCountingQuestion(): MathQuestion {
  const count = Math.floor(Math.random() * 20) + 1; // 1-20
  const emojis = ['🍎', '🍌', '⭐', '🎈', '🐱', '🐶', '🌸', '🍓'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  const options = new Set<number>([count]);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 5) - 2;
    const opt = count + offset;
    if (opt >= 1 && opt <= 20 && opt !== count) options.add(opt);
  }
  return {
    type: 'counting',
    question: `数一数有多少个${emoji}？`,
    answer: count,
    options: Array.from(options).sort(() => Math.random() - 0.5),
    emoji: emoji.repeat(count),
  };
}
