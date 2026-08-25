import { useState, useEffect } from 'react';
import { useAppState } from '../store/useStore';
import { numberCards, generateMathQuestion, generateCountingQuestion } from '../data/math';
import { speak, playCorrectSound, playWrongSound } from '../utils/speech';
import type { MathQuestion } from '../types';
import StarBurst from '../components/StarBurst';

type Tab = 'numbers' | 'addition' | 'counting';

export default function Math() {
  const { state, updateProgress, addStars, incrementStat } = useAppState();
  const [tab, setTab] = useState<Tab>('numbers');
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [question, setQuestion] = useState<MathQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [starTrigger, setStarTrigger] = useState(0);

  const numbersDone = state.progress['math:numbers']?.status === 'completed';

  const generateQuestion = (type: 'addition' | 'subtraction' | 'counting') => {
    const q = type === 'counting' ? generateCountingQuestion() : generateMathQuestion(type);
    setQuestion(q);
    setSelected(null);
    setShowResult(false);
  };

  useEffect(() => {
    if (tab === 'addition') generateQuestion(globalThis.Math.random() > 0.5 ? 'addition' : 'subtraction');
    if (tab === 'counting') generateQuestion('counting');
  }, [tab]);

  const handleNumberClick = (num: number) => {
    setCurrentNumber(num);
    speak(String(num), 'zh-CN');
  };

  const handleAnswer = (idx: number) => {
    if (showResult || !question) return;
    setSelected(idx);
    setShowResult(true);
    const correct = question.options[idx] === question.answer;
    setTotalAnswered(t => t + 1);
    if (correct) {
      playCorrectSound();
      setStreak(s => s + 1);
      const newBadges = addStars(1);
      setStarTrigger(t => t + 1);
      if (question.type === 'addition' || question.type === 'subtraction') {
        incrementStat('mathAdditionCount', 1);
      }
      if (streak + 1 >= 5) {
        addStars(2);
        setStreak(0);
      }
    } else {
      playWrongSound();
      setStreak(0);
    }
    setTimeout(() => {
      if (tab === 'addition') generateQuestion(globalThis.Math.random() > 0.5 ? 'addition' : 'subtraction');
      if (tab === 'counting') generateQuestion('counting');
    }, 1200);
  };

  // Mark numbers as completed when all 0-20 clicked
  const [clickedNumbers, setClickedNumbers] = useState<Set<number>>(new Set());
  const handleNumberLearn = (num: number) => {
    handleNumberClick(num);
    const newSet = new Set(clickedNumbers).add(num);
    setClickedNumbers(newSet);
    if (newSet.size >= 21) {
      updateProgress('math', 'numbers', { status: 'completed' });
    }
  };

  return (
    <div>
      <StarBurst trigger={starTrigger} />
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-candy-blueDark to-candy-purpleDark bg-clip-text text-transparent">
        🔢 数字王国
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { key: 'numbers', label: '数字认知', icon: '🔢' },
          { key: 'addition', label: '加减法', icon: '➕' },
          { key: 'counting', label: '数一数', icon: '🎯' },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm min-h-[44px] transition-all ${
              tab === t.key ? 'bg-candy-blueDark text-white shadow-lg' : 'bg-white text-gray-500'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Number learning */}
      {tab === 'numbers' && (
        <div>
          {currentNumber !== null ? (
            <div className="text-center">
              <button onClick={() => setCurrentNumber(null)} className="mb-4 text-candy-blueDark font-bold min-h-[44px]">← 返回</button>
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-candy-blue to-candy-purple rounded-candy shadow-lg flex flex-col items-center justify-center">
                <span className="text-9xl font-extrabold text-white">{currentNumber}</span>
              </div>
              <div className="mt-4 text-3xl">{numberCards[currentNumber].emoji}</div>
              <p className="text-xl font-bold text-gray-600 mt-2">{numberCards[currentNumber].word}</p>
              <button onClick={() => speak(String(currentNumber), 'zh-CN')} className="btn-blue mt-4">
                🔊 再听一次
              </button>
            </div>
          ) : (
            <>
              <p className="text-center text-gray-500 text-sm mb-4">点击数字卡片学习（已学 {clickedNumbers.size}/21）</p>
              <div className="grid grid-cols-5 md:grid-cols-7 gap-2">
                {numberCards.map(n => (
                  <button
                    key={n.number}
                    onClick={() => handleNumberLearn(n.number)}
                    className={`aspect-square rounded-2xl text-2xl font-extrabold transition-all active:scale-95 flex items-center justify-center ${
                      clickedNumbers.has(n.number) ? 'bg-candy-blue text-white shadow-md' : 'bg-white shadow-md hover:shadow-lg text-gray-700'
                    }`}
                  >
                    {n.number}
                  </button>
                ))}
              </div>
              {numbersDone && <p className="text-center text-candy-greenDark font-bold mt-4">🎉 全部数字学完啦！</p>}
            </>
          )}
        </div>
      )}

      {/* Addition/Subtraction */}
      {tab === 'addition' && question && (
        <div>
          <div className="flex justify-between mb-4">
            <span className="text-sm font-bold text-gray-500">连续答对：{streak} 🔥</span>
            <span className="text-sm font-bold text-candy-yellowDark">已答：{totalAnswered}</span>
          </div>
          <div className="text-center mb-8">
            <div className="text-6xl font-extrabold text-candy-blueDark mb-2">{question.question}</div>
            <div className="text-4xl">{question.emoji}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={`p-6 rounded-2xl text-4xl font-extrabold min-h-[80px] transition-all active:scale-95 ${
                  showResult && opt === question.answer ? 'bg-candy-green ring-4 ring-candy-greenDark text-white' :
                  showResult && idx === selected ? 'bg-candy-pink ring-4 ring-candy-pinkDark' :
                  'bg-white shadow-md hover:bg-candy-blue/10 text-gray-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {streak >= 5 && <p className="text-center text-candy-yellowDark font-bold mt-4 animate-bounce">🔥 连对5题！+2⭐</p>}
        </div>
      )}

      {/* Counting game */}
      {tab === 'counting' && question && (
        <div>
          <div className="flex justify-between mb-4">
            <span className="text-sm font-bold text-gray-500">连续答对：{streak} 🔥</span>
            <span className="text-sm font-bold text-candy-yellowDark">已答：{totalAnswered}</span>
          </div>
          <div className="bg-white rounded-candy p-6 mb-6 shadow-md min-h-[120px] flex flex-wrap items-center justify-center gap-1">
            <span className="text-3xl break-all">{question.emoji}</span>
          </div>
          <p className="text-center text-gray-500 text-sm mb-4">{question.question}</p>
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={`p-6 rounded-2xl text-4xl font-extrabold min-h-[80px] transition-all active:scale-95 ${
                  showResult && opt === question.answer ? 'bg-candy-green ring-4 ring-candy-greenDark text-white' :
                  showResult && idx === selected ? 'bg-candy-pink ring-4 ring-candy-pinkDark' :
                  'bg-white shadow-md hover:bg-candy-blue/10 text-gray-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
