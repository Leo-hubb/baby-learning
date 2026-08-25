import { useState, useEffect } from 'react';
import { useAppState } from '../store/useStore';
import { generateAdventureQuestions } from '../data/adventure';
import { speak, playCorrectSound, playWrongSound } from '../utils/speech';
import type { AdventureQuestion } from '../types';
import StarBurst from '../components/StarBurst';
import Confetti from '../components/Confetti';

type View = 'levels' | 'playing' | 'result';

export default function Adventure() {
  const { state, updateAdventure, addStars } = useAppState();
  const [view, setView] = useState<View>('levels');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [questions, setQuestions] = useState<AdventureQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedStars, setEarnedStars] = useState(0);
  const [starTrigger, setStarTrigger] = useState(0);
  const [confetti, setConfetti] = useState(false);

  const isLevelUnlocked = (level: number) => {
    if (level === 1) return true;
    const prev = state.adventure[level - 1];
    return prev?.completed;
  };

  const startLevel = (level: number) => {
    setCurrentLevel(level);
    setQuestions(generateAdventureQuestions(level, 10));
    setQIndex(0);
    setCorrectCount(0);
    setSelected(null);
    setShowResult(false);
    setView('playing');
  };

  const playAudio = (q: AdventureQuestion) => {
    if (q.audioText && q.audioLang) {
      speak(q.audioText, q.audioLang);
    }
  };

  useEffect(() => {
    if (view === 'playing' && questions[qIndex]?.audioText) {
      const timer = setTimeout(() => playAudio(questions[qIndex]), 300);
      return () => clearTimeout(timer);
    }
  }, [qIndex, view, questions]);

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    const q = questions[qIndex];
    const correct = idx === q.answer;
    if (correct) {
      playCorrectSound();
      setCorrectCount(c => c + 1);
    } else {
      playWrongSound();
    }
    setTimeout(() => {
      if (qIndex + 1 >= questions.length) {
        // Level complete
        const finalCorrect = correctCount + (correct ? 1 : 0);
        const stars = finalCorrect + (finalCorrect === 10 ? 3 : 0);
        setEarnedStars(stars);
        addStars(stars);
        setStarTrigger(t => t + 1);
        const prevStars = state.adventure[currentLevel]?.starsEarned || 0;
        const newBadges = updateAdventure(currentLevel, {
          starsEarned: Math.max(prevStars, stars),
          completed: true,
          completedAt: Date.now(),
        });
        if (newBadges.length > 0 || stars >= 13) setConfetti(true);
        setView('result');
      } else {
        setQIndex(i => i + 1);
        setSelected(null);
        setShowResult(false);
      }
    }, 1200);
  };

  const moduleColor = (module: string) => {
    switch (module) {
      case 'english': return 'bg-candy-pink';
      case 'literacy': return 'bg-candy-green';
      case 'math': return 'bg-candy-blue';
      case 'logic': return 'bg-candy-yellow';
      default: return 'bg-gray-200';
    }
  };

  const moduleLabel = (module: string) => {
    switch (module) {
      case 'english': return '英语';
      case 'literacy': return '识字';
      case 'math': return '数学';
      case 'logic': return '逻辑';
      default: return '';
    }
  };

  // ===== RENDER =====
  if (view === 'levels') {
    return (
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-candy-purpleDark to-candy-pinkDark bg-clip-text text-transparent">
          🎮 闯关冒险
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">混合四大模块题目，挑战10个关卡！</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(level => {
            const unlocked = isLevelUnlocked(level);
            const progress = state.adventure[level];
            const stars = progress?.starsEarned || 0;
            return (
              <button
                key={level}
                onClick={() => unlocked && startLevel(level)}
                disabled={!unlocked}
                className={`p-4 rounded-candy text-center transition-all active:scale-95 min-h-[120px] ${
                  progress?.completed ? 'bg-gradient-to-br from-candy-purple to-candy-pink shadow-lg' :
                  unlocked ? 'bg-white shadow-md hover:shadow-lg' : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="text-4xl mb-1">{unlocked ? (progress?.completed ? '🏆' : '🎯') : '🔒'}</div>
                <div className="font-extrabold text-lg text-gray-700">第 {level} 关</div>
                {stars > 0 && (
                  <div className="text-candy-yellowDark text-sm mt-1">
                    {'⭐'.repeat(Math.min(stars, 5))}
                    {stars > 5 && <span className="text-xs"> +{stars - 5}</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'result') {
    return (
      <div className="text-center py-8">
        <StarBurst trigger={starTrigger} />
        <Confetti show={confetti} onDone={() => setConfetti(false)} />
        <div className="text-7xl mb-4 animate-bounce">{earnedStars >= 10 ? '🏆' : '🎉'}</div>
        <h2 className="text-3xl font-extrabold text-candy-purpleDark mb-2">第 {currentLevel} 关完成！</h2>
        <div className="text-5xl my-4">{'⭐'.repeat(Math.min(earnedStars, 5))}{earnedStars > 5 && <span className="text-2xl">+{earnedStars - 5}</span>}</div>
        <p className="text-xl font-bold text-gray-600 mb-2">答对 {correctCount} / 10 题</p>
        <p className="text-candy-yellowDark font-bold text-lg">获得 {earnedStars} 颗星星！</p>
        {earnedStars >= 13 && <p className="text-candy-pinkDark font-extrabold mt-2 animate-pulse">💎 完美通关！全对奖励+3⭐</p>}
        <div className="flex gap-3 justify-center mt-8">
          <button onClick={() => startLevel(currentLevel)} className="btn-blue">再玩一次</button>
          {currentLevel < 10 && isLevelUnlocked(currentLevel + 1) && (
            <button onClick={() => startLevel(currentLevel + 1)} className="btn-purple">下一关 →</button>
          )}
          <button onClick={() => setView('levels')} className="btn-pink">关卡列表</button>
        </div>
      </div>
    );
  }

  // Playing view
  const q = questions[qIndex];
  if (!q) return null;

  return (
    <div>
      <StarBurst trigger={starTrigger} />
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setView('levels')} className="text-gray-400 text-sm font-bold min-h-[36px]">✕ 退出</button>
        <span className="text-sm font-bold text-gray-500">第 {currentLevel} 关 · {qIndex + 1}/10</span>
        <span className="text-sm font-bold text-candy-greenDark">✓ {correctCount}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-candy-purple to-candy-pink transition-all duration-300" style={{ width: `${(qIndex / 10) * 100}%` }} />
      </div>

      {/* Module tag */}
      <div className="text-center mb-4">
        <span className={`inline-block ${moduleColor(q.module)} text-gray-700 text-sm font-bold px-3 py-1 rounded-full`}>
          {moduleLabel(q.module)}
        </span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-candy p-6 mb-6 shadow-md text-center min-h-[100px] flex items-center justify-center">
        {q.audioText ? (
          <button onClick={() => playAudio(q)} className="text-5xl p-3 bg-candy-blue rounded-full min-h-[60px] min-w-[60px]">
            🔊
          </button>
        ) : (
          <p className="text-2xl font-bold text-gray-700">{q.question}</p>
        )}
      </div>
      {q.audioText && <p className="text-center text-gray-400 text-sm mb-4">{q.question}</p>}

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            disabled={showResult}
            className={`p-5 rounded-2xl text-3xl font-bold min-h-[80px] transition-all active:scale-95 flex items-center justify-center ${
              showResult && idx === q.answer ? 'bg-candy-green ring-4 ring-candy-greenDark text-white' :
              showResult && idx === selected ? 'bg-candy-pink ring-4 ring-candy-pinkDark' :
              'bg-white shadow-md hover:shadow-lg text-gray-700'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
