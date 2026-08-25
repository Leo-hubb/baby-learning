import type { LogicQuestion } from '../types';

const shapes = ['🔴', '🔵', '🟡', '🟢', '🟣', '⬛', '🔶', '⭐', '❤️', '🌸'];
const shapeNames = ['圆形', '圆形', '圆形', '圆形', '圆形', '方形', '菱形', '星星', '爱心', '花朵'];

// 找规律题目
function generatePattern(difficulty: number): LogicQuestion {
  const len = 3 + Math.min(difficulty, 3); // 3-6 items shown
  const patternLen = difficulty > 2 ? 3 : 2; // 2 or 3 element repeating pattern
  const pattern: string[] = [];
  const usedIdx = new Set<number>();
  for (let i = 0; i < patternLen; i++) {
    let idx;
    do { idx = Math.floor(Math.random() * shapes.length); } while (usedIdx.has(idx) && usedIdx.size < shapes.length);
    usedIdx.add(idx);
    pattern.push(shapes[idx]);
  }
  const sequence: string[] = [];
  for (let i = 0; i < len; i++) sequence.push(pattern[i % patternLen]);
  const answer = pattern[len % patternLen];
  // options
  const options = [answer];
  while (options.length < 4) {
    const s = shapes[Math.floor(Math.random() * shapes.length)];
    if (!options.includes(s)) options.push(s);
  }
  options.sort(() => Math.random() - 0.5);
  return {
    type: 'pattern',
    description: '找规律，下一个是什么？',
    sequence,
    options,
    answer: options.indexOf(answer),
    difficulty,
  };
}

// 图形配对题目
function generateMatching(difficulty: number): LogicQuestion {
  const targetIdx = Math.floor(Math.random() * shapes.length);
  const target = shapes[targetIdx];
  const options = [target];
  while (options.length < 4) {
    const s = shapes[Math.floor(Math.random() * shapes.length)];
    if (!options.includes(s)) options.push(s);
  }
  options.sort(() => Math.random() - 0.5);
  return {
    type: 'matching',
    description: `找出和 ${target} 一样的图形`,
    options,
    answer: options.indexOf(target),
    difficulty,
  };
}

// 排序题目
function generateSorting(difficulty: number): LogicQuestion {
  const sizes = ['🔵', '⚪', '🔵', '⚪']; // placeholder
  const count = 3 + Math.min(difficulty, 2); // 3-5 items
  const numbers = Array.from({ length: count }, (_, i) => i + 1);
  const shuffled = [...numbers].sort(() => Math.random() - 0.5);
  // For sorting, we ask which comes first/last
  const isAscending = Math.random() > 0.5;
  const answer = isAscending ? Math.min(...numbers) : Math.max(...numbers);
  const options = [...new Set([answer, ...shuffled.slice(0, 3)])].slice(0, 4);
  while (options.length < 4) {
    const n = Math.floor(Math.random() * 10) + 1;
    if (!options.includes(n)) options.push(n);
  }
  options.sort(() => Math.random() - 0.5);
  const display = shuffled.map(n => `${n}️⃣`).join(' ');
  return {
    type: 'sorting',
    description: `${display}\n${isAscending ? '从小到大，第一个是？' : '从大到小，第一个是？'}`,
    options: options.map(String),
    answer: options.indexOf(answer),
    difficulty,
  };
}

export function generateLogicQuestion(difficulty: number = 1): LogicQuestion {
  const types = ['pattern', 'matching', 'sorting'] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  switch (type) {
    case 'pattern': return generatePattern(difficulty);
    case 'matching': return generateMatching(difficulty);
    case 'sorting': return generateSorting(difficulty);
  }
}

export function getDifficulty(questionCount: number): number {
  if (questionCount < 20) return 1;
  if (questionCount < 50) return 2;
  return 3;
}
