import { useState, useEffect } from 'react';
import { useAppState } from '../store/useStore';
import { generateLogicQuestion, getDifficulty } from '../data/logic';
import { playCorrectSound, playWrongSound } from '../utils/speech';
import type { LogicQuestion } from '../types';
import StarBurst from '../components/StarBurst';

export default function Logic() {
  const { state, addStars, incrementStat } = useAppState();
  const [question, setQuestion] = useState<LogicQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [starTrigger, setStarTrigger] = useState(0);

  const difficulty = getDifficulty(state.stats.logicQuestionCount);

  useEffect(() => {
    setQuestion(generateLogicQuestion(difficulty));
  }, []);

  const nextQuestion = () => {
    const diff = getDifficulty(state.stats.logicQuestionCount + totalAnswered);
    setQuestion(generateLogicQuestion(diff));
    setSelected(null);
    setShowResult(false);
  };

  const handleAnswer = (idx: number) => {
    if (showResult || !question) return;
    setSelected(idx);
    setShowResult(true);
    const correct = idx === question.answer;
    setTotalAnswered(t => t + 1);
    incrementStat('logicQuestionCount', 1);
    if (correct) {
      playCorrectSound();
      setStreak(s => s + 1);
      addStars(1);
      setStarTrigger(t => t + 1);
      if (streak + 1 >= 10) {
        addStars(5);
        setStreak(0);
      }
    } else {
      playWrongSound();
      setStreak(0);
    }
    setTimeout(nextQuestion, 1500);
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case 'pattern': return '找规律';
      case 'matching': return '图形配对';
      case 'sorting': return '排序题';
      default: return '';
    }
  };

  return (
    <div>
      <StarBurst trigger={starTrigger} />
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-4 bg-gradient-to-r from-candy-yellowDark to-candy-pinkDark bg-clip-text text-transparent">
        🧩 逻辑挑战
      </h2>

      {/* Stats bar */}
      <div className="flex justify-around bg-white/70 rounded-candy p-3 mb-6">
        <div className="text-center">
          <div className="text-2xl font-extrabold text-candy-yellowDark">{totalAnswered}</div>
          <div className="text-xs text-gray-500">已答题</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-extrabold text-candy-pinkDark">{streak}🔥</div>
          <div className="text-xs text-gray-500">连对</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-extrabold text-candy-purpleDark">Lv.{difficulty}</div>
          <div className="text-xs text-gray-500">难度</div>
        </div>
      </div>

      {question && (
        <div>
          <div className="text-center mb-2">
            <span className="inline-block bg-candy-yellow text-gray-700 text-sm font-bold px-3 py-1 rounded-full">
              {typeLabel(question.type)}
            </span>
          </div>

          {/* Pattern display */}
          {question.type === 'pattern' && question.sequence && (
            <div className="bg-white rounded-candy p-6 mb-6 shadow-md text-center">
              <div className="text-4xl flex items-center justify-center gap-2 flex-wrap">
                {question.sequence.map((s, i) => (
                  <span key={i} className="inline-block">{s}</span>
                ))}
                <span className="text-4xl text-candy-pinkDark font-bold animate-pulse">?</span>
              </div>
            </div>
          )}

          {question.type === 'matching' && (
            <div className="bg-white rounded-candy p-6 mb-6 shadow-md text-center">
              <p className="text-lg font-bold text-gray-700 mb-2">{question.description}</p>
            </div>
          )}

          {question.type === 'sorting' && (
            <div className="bg-white rounded-candy p-6 mb-6 shadow-md text-center">
              <p className="text-lg font-bold text-gray-700 whitespace-pre-line">{question.description}</p>
            </div>
          )}

          {/* Options */}
          <div className={`grid gap-3 ${question.type === 'sorting' ? 'grid-cols-2' : 'grid-cols-2'}`}>
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={`p-6 rounded-2xl text-4xl font-bold min-h-[80px] transition-all active:scale-95 flex items-center justify-center ${
                  showResult && idx === question.answer ? 'bg-candy-green ring-4 ring-candy-greenDark text-white' :
                  showResult && idx === selected ? 'bg-candy-pink ring-4 ring-candy-pinkDark' :
                  'bg-white shadow-md hover:bg-candy-yellow/20 text-gray-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {showResult && selected === question.answer && (
            <p className="text-center text-candy-greenDark font-extrabold text-xl mt-4 animate-bounce">🎉 答对啦！</p>
          )}
          {showResult && selected !== question.answer && (
            <p className="text-center text-candy-pinkDark font-bold text-lg mt-4">正确答案是：{question.options[question.answer]}</p>
          )}
          {streak >= 10 && <p className="text-center text-candy-yellowDark font-bold mt-2 animate-bounce">🏆 连对10题！+5⭐ 徽章解锁！</p>}
        </div>
      )}
    </div>
  );
}
