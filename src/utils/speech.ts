// ============================================
// 宝贝学习乐园 - 完整语音系统
// ============================================

// 语音状态
let speechEnabled = true;
let speechRate = 0.9;
let speechPitch = 1.1;
let isInitialized = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let speechQueue: Array<{ text: string; lang: 'en-US' | 'zh-CN'; rate?: number; pitch?: number; onEnd?: () => void }> = [];
let isSpeaking = false;

// 语音鼓励短语（中文）
const praisePhrases = [
  '太棒了！',
  '真厉害！',
  '答对啦！',
  '你真聪明！',
  '非常好！',
  '继续加油！',
  '好样的！',
  '完美！',
];

const encouragePhrases = [
  '没关系，再试试。',
  '别灰心，再来一次。',
  '想一想，你可以的。',
  '差一点点，再试试。',
];

// 初始化语音（需要用户交互后调用，解决浏览器自动播放限制）
export function initSpeech() {
  if (isInitialized) return;
  if (!('speechSynthesis' in window)) {
    console.warn('当前浏览器不支持语音合成');
    return;
  }
  // 预加载语音列表
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
  isInitialized = true;
  console.log('语音系统已初始化');
}

// 设置语音开关
export function setSpeechEnabled(enabled: boolean) {
  speechEnabled = enabled;
  if (!enabled) {
    stopSpeaking();
  }
}

export function getSpeechEnabled() {
  return speechEnabled;
}

// 设置语速
export function setSpeechRate(rate: number) {
  speechRate = Math.max(0.5, Math.min(2, rate));
}

export function getSpeechRate() {
  return speechRate;
}

// 核心朗读函数
export function speak(
  text: string,
  lang: 'en-US' | 'zh-CN' = 'zh-CN',
  rate?: number,
  pitch?: number
): Promise<void> {
  return new Promise((resolve) => {
    if (!speechEnabled) {
      resolve();
      return;
    }
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }
    if (!text || text.trim() === '') {
      resolve();
      return;
    }

    // 取消之前的语音
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate || speechRate;
    utterance.pitch = pitch || speechPitch;
    utterance.volume = 1;

    // 尝试选择合适的语音
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const matchingVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }

    utterance.onend = () => {
      isSpeaking = false;
      resolve();
      processQueue();
    };
    utterance.onerror = (e) => {
      isSpeaking = false;
      console.warn('语音播放错误:', e);
      resolve();
      processQueue();
    };

    currentUtterance = utterance;
    isSpeaking = true;
    window.speechSynthesis.speak(utterance);
  });
}

// 语音队列（按顺序播放）
function processQueue() {
  if (speechQueue.length > 0 && !isSpeaking) {
    const item = speechQueue.shift()!;
    speak(item.text, item.lang, item.rate, item.pitch).then(() => {
      item.onEnd?.();
    });
  }
}

export function queueSpeak(
  text: string,
  lang: 'en-US' | 'zh-CN' = 'zh-CN',
  onEnd?: () => void
) {
  if (!speechEnabled) return;
  speechQueue.push({ text, lang, onEnd });
  if (!isSpeaking) {
    processQueue();
  }
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  speechQueue = [];
  isSpeaking = false;
}

// ============================================
// 语音鼓励
// ============================================

export function speakPraise() {
  if (!speechEnabled) return;
  const phrase = praisePhrases[Math.floor(Math.random() * praisePhrases.length)];
  speak(phrase, 'zh-CN', 1.0, 1.2);
}

export function speakEncourage() {
  if (!speechEnabled) return;
  const phrase = encouragePhrases[Math.floor(Math.random() * encouragePhrases.length)];
  speak(phrase, 'zh-CN', 0.9, 1.0);
}

// ============================================
// 中文数字/算式朗读
// ============================================

const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

export function numberToChinese(n: number): string {
  if (n <= 10) return chineseNumbers[n];
  if (n < 20) return '十' + chineseNumbers[n - 10];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  if (ones === 0) return chineseNumbers[tens] + '十';
  return chineseNumbers[tens] + '十' + chineseNumbers[ones];
}

export function readMathQuestion(a: number, b: number, operator: '+' | '-'): string {
  const opText = operator === '+' ? '加' : '减';
  return `${numberToChinese(a)} ${opText} ${numberToChinese(b)} 等于几？`;
}

export function readNumber(n: number): string {
  return numberToChinese(n);
}

// ============================================
// 模块欢迎语
// ============================================

export function speakWelcome(module: string) {
  if (!speechEnabled) return;
  const welcomes: Record<string, string> = {
    english: '欢迎来到英语乐园，我们一起学英语吧！',
    literacy: '欢迎来到识字花园，我们一起学汉字吧！',
    math: '欢迎来到数字王国，我们一起学数学吧！',
    logic: '欢迎来到逻辑挑战，动动脑筋吧！',
    adventure: '欢迎来到闯关冒险，准备好挑战了吗？',
  };
  speak(welcomes[module] || '欢迎来到宝贝学习乐园！', 'zh-CN', 0.95, 1.15);
}

export function speakLevelStart(level: number) {
  if (!speechEnabled) return;
  speak(`第${numberToChinese(level)}关，开始！`, 'zh-CN', 1.0, 1.2);
}

export function speakLevelComplete(stars: number) {
  if (!speechEnabled) return;
  speak(`恭喜你完成了！获得${numberToChinese(stars)}颗星星！`, 'zh-CN', 1.0, 1.2);
}

// ============================================
// 音效（Web Audio API）
// ============================================

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  // 恢复被暂停的 AudioContext（浏览器自动播放策略）
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCorrectSound() {
  if (!speechEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(523.25, ctx.currentTime);
  osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
  osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

export function playWrongSound() {
  if (!speechEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

export function playStarSound() {
  if (!speechEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.setValueAtTime(1108.73, ctx.currentTime + 0.08);
  osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.16);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

export function playClickSound() {
  if (!speechEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
}
