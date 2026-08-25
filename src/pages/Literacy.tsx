import { useState, useEffect, useRef } from 'react';
import { useAppState } from '../store/useStore';
import { literacyLevels, getLevelChars, getTotalCharCount } from '../data/literacy';
import { speak, playCorrectSound, playWrongSound, playStarSound } from '../utils/speech';
import type { ChineseChar } from '../types';
import StarBurst from '../components/StarBurst';
import Confetti from '../components/Confetti';

type View = 'levels' | 'chars' | 'learn' | 'review';

export default function Literacy() {
  const { state, updateProgress, addStars } = useAppState();
  const [view, setView] = useState<View>('levels');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [currentChar, setCurrentChar] = useState<ChineseChar | null>(null);
  const [charIndex, setCharIndex] = useState(0);
  const [learnStep, setLearnStep] = useState(0); // 0:card 1:stroke 2:words 3:example 4:practice
  const [practiceAnswer, setPracticeAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [starTrigger, setStarTrigger] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [strokeAnimKey, setStrokeAnimKey] = useState(0);

  const masteredCount = Object.values(state.progress).filter(
    p => p.module === 'literacy' && p.status === 'mastered'
  ).length;

  const isLevelUnlocked = (level: number) => {
    if (level === 1) return true;
    const prevChars = getLevelChars(level - 1);
    const mastered = prevChars.filter(c => {
      const p = state.progress[`literacy:${c.char}`];
      return p?.status === 'mastered';
    }).length;
    return mastered >= Math.floor(prevChars.length * 0.8);
  };

  const startLearn = (char: ChineseChar, idx: number) => {
    setCurrentChar(char);
    setCharIndex(idx);
    setLearnStep(0);
    setPracticeAnswer(null);
    setShowResult(false);
    setStrokeAnimKey(k => k + 1);
    setView('learn');
  };

  const handleCharClick = () => {
    if (currentChar) speak(currentChar.char, 'zh-CN');
  };

  // Generate practice question
  const getPracticeQuestion = () => {
    if (!currentChar) return null;
    const allChars = getLevelChars(selectedLevel);
    const options = [currentChar.char];
    while (options.length < 4) {
      const c = allChars[Math.floor(Math.random() * allChars.length)].char;
      if (!options.includes(c)) options.push(c);
    }
    options.sort(() => Math.random() - 0.5);
    return { options, answer: options.indexOf(currentChar.char) };
  };

  const handlePracticeSelect = (idx: number) => {
    if (showResult || !currentChar) return;
    setPracticeAnswer(idx);
    setShowResult(true);
    const q = getPracticeQuestion();
    if (!q) return;
    const correct = idx === q.answer;
    if (correct) {
      playCorrectSound();
      updateProgress('literacy', currentChar.char, { status: 'mastered', score: 1 });
      const newBadges = addStars(2);
      setStarTrigger(t => t + 1);
      if (newBadges.length > 0) setConfetti(true);
    } else {
      playWrongSound();
      updateProgress('literacy', currentChar.char, { status: 'in_progress' });
    }
  };

  const nextChar = () => {
    const chars = getLevelChars(selectedLevel);
    if (charIndex + 1 < chars.length) {
      startLearn(chars[charIndex + 1], charIndex + 1);
    } else {
      setView('chars');
    }
  };

  // Stroke order animation (simplified - shows character with drawing effect)
  const StrokeAnimation = () => {
    const [phase, setPhase] = useState(0);
    useEffect(() => {
      setPhase(0);
      const timer = setInterval(() => {
        setPhase(p => {
          if (p >= 100) { clearInterval(timer); return 100; }
          return p + 5;
        });
      }, 50);
      return () => clearInterval(timer);
    }, [strokeAnimKey]);

    return (
      <div className="relative w-40 h-40 mx-auto bg-white rounded-candy shadow-inner border-4 border-dashed border-candy-blue/40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl font-bold text-gray-200 select-none">{currentChar?.char}</span>
        </div>
        <div
          className="absolute inset-0 bg-candy-yellow/30 transition-all duration-100"
          style={{ clipPath: `inset(0 ${100 - phase}% 0 0)` }}
        />
        <span className="relative text-8xl font-bold text-candy-purpleDark z-10">{currentChar?.char}</span>
        <button
          onClick={() => setStrokeAnimKey(k => k + 1)}
          className="absolute bottom-1 right-1 bg-candy-blue text-white text-xs px-2 py-1 rounded-full min-h-[30px]"
        >
          🔄 重播
        </button>
      </div>
    );
  };

  // Review mode
  const ReviewMode = () => {
    const masteredChars = getLevelChars(selectedLevel).filter(c => {
      const p = state.progress[`literacy:${c.char}`];
      return p?.status === 'mastered';
    });
    const [reviewChars, setReviewChars] = useState<ChineseChar[]>([]);
    const [reviewIdx, setReviewIdx] = useState(0);
    const [reviewAnswer, setReviewAnswer] = useState<number | null>(null);
    const [reviewShow, setReviewShow] = useState(false);
    const [reviewScore, setReviewScore] = useState(0);
    const [reviewDone, setReviewDone] = useState(false);

    useEffect(() => {
      const shuffled = [...masteredChars].sort(() => Math.random() - 0.5).slice(0, 10);
      setReviewChars(shuffled);
    }, []);

    if (masteredChars.length < 3) {
      return (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-500">还没有足够的已学汉字，先去学习吧！</p>
          <button onClick={() => setView('levels')} className="btn-green mt-4">去学习</button>
        </div>
      );
    }

    if (reviewDone || reviewChars.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-extrabold text-candy-greenDark mb-2">复习完成！</h3>
          <p className="text-xl font-bold">答对 {reviewScore} / {reviewChars.length} 题</p>
          {reviewScore === reviewChars.length && (
            <p className="text-candy-yellowDark font-bold mt-2">⭐ 全部正确！奖励星星！</p>
          )}
          <button onClick={() => setView('levels')} className="btn-pink mt-6">返回</button>
        </div>
      );
    }

    const current = reviewChars[reviewIdx];
    const allChars = getLevelChars(selectedLevel);
    const options = [current.char];
    while (options.length < 4) {
      const c = allChars[Math.floor(Math.random() * allChars.length)].char;
      if (!options.includes(c)) options.push(c);
    }
    options.sort(() => Math.random() - 0.5);
    const answerIdx = options.indexOf(current.char);

    const handleSelect = (idx: number) => {
      if (reviewShow) return;
      setReviewAnswer(idx);
      setReviewShow(true);
      if (idx === answerIdx) {
        playCorrectSound();
        setReviewScore(s => s + 1);
      } else {
        playWrongSound();
      }
      setTimeout(() => {
        if (reviewIdx + 1 >= reviewChars.length) {
          setReviewDone(true);
          if (reviewScore + (idx === answerIdx ? 1 : 0) === reviewChars.length) {
            addStars(5);
            setStarTrigger(t => t + 1);
          }
        } else {
          setReviewIdx(i => i + 1);
          setReviewAnswer(null);
          setReviewShow(false);
        }
      }, 1200);
    };

    return (
      <div>
        <div className="flex justify-between mb-4">
          <span className="text-sm font-bold text-gray-500">第 {reviewIdx + 1}/{reviewChars.length} 题</span>
          <span className="text-sm font-bold text-candy-greenDark">答对：{reviewScore}</span>
        </div>
        <div className="text-center mb-6">
          <button onClick={() => speak(current.char, 'zh-CN')} className="text-5xl p-4 bg-candy-green rounded-full min-h-[60px] min-w-[60px]">
            🔊
          </button>
          <p className="mt-2 text-gray-500 text-sm">听读音，选正确的汉字</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={reviewShow}
              className={`p-6 rounded-2xl text-4xl font-bold min-h-[80px] transition-all active:scale-95 ${
                reviewShow && idx === answerIdx ? 'bg-candy-green ring-4 ring-candy-greenDark' :
                reviewShow && idx === reviewAnswer ? 'bg-candy-pink ring-4 ring-candy-pinkDark' :
                'bg-white shadow-md hover:bg-candy-green/10'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ===== RENDER =====
  if (view === 'review') {
    return (
      <div>
        <StarBurst trigger={starTrigger} />
        <button onClick={() => setView('levels')} className="mb-4 text-candy-blueDark font-bold min-h-[44px]">← 返回</button>
        <h2 className="text-2xl font-extrabold text-center mb-6 text-candy-greenDark">📝 今日复习</h2>
        <ReviewMode />
      </div>
    );
  }

  if (view === 'levels') {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-candy-greenDark to-candy-blueDark bg-clip-text text-transparent">
            📖 识字花园
          </h2>
          <button onClick={() => setView('review')} className="btn-yellow text-sm py-2 px-4">
            📝 复习
          </button>
        </div>
        <div className="bg-white/70 rounded-candy p-4 mb-4 text-center">
          <span className="text-sm text-gray-500">已掌握</span>
          <span className="text-2xl font-extrabold text-candy-greenDark mx-2">{masteredCount}</span>
          <span className="text-sm text-gray-500">/ {getTotalCharCount()} 个汉字</span>
        </div>
        <div className="space-y-4">
          {literacyLevels.map(level => {
            const unlocked = isLevelUnlocked(level.level);
            const levelMastered = level.chars.filter(c => state.progress[`literacy:${c.char}`]?.status === 'mastered').length;
            return (
              <button
                key={level.level}
                onClick={() => { if (unlocked) { setSelectedLevel(level.level); setView('chars'); } }}
                disabled={!unlocked}
                className={`w-full p-5 rounded-candy text-left transition-all ${
                  unlocked ? 'bg-gradient-to-r from-candy-green to-candy-blue shadow-lg' : 'bg-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-white">{level.name}</h3>
                    <p className="text-white/80 text-sm">{level.chars.length}个汉字</p>
                  </div>
                  {unlocked ? (
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-white">{levelMastered}/{level.chars.length}</div>
                      <div className="text-white/70 text-xs">已掌握</div>
                    </div>
                  ) : (
                    <div className="text-4xl">🔒</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'chars') {
    const chars = getLevelChars(selectedLevel);
    return (
      <div>
        <button onClick={() => setView('levels')} className="mb-4 text-candy-blueDark font-bold min-h-[44px]">← 返回级别</button>
        <h2 className="text-2xl font-extrabold text-center mb-6 text-candy-greenDark">第{selectedLevel}级</h2>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {chars.map((c, idx) => {
            const p = state.progress[`literacy:${c.char}`];
            const mastered = p?.status === 'mastered';
            return (
              <button
                key={c.char}
                onClick={() => startLearn(c, idx)}
                className={`aspect-square rounded-2xl text-3xl font-bold transition-all active:scale-95 flex flex-col items-center justify-center ${
                  mastered ? 'bg-candy-green text-white shadow-md' : 'bg-white shadow-md hover:shadow-lg text-gray-700'
                }`}
              >
                {c.char}
                {mastered && <span className="text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Learn view
  if (!currentChar) return null;
  const practiceQ = getPracticeQuestion();
  const steps = ['汉字', '笔顺', '组词', '例句', '练习'];

  return (
    <div>
      <StarBurst trigger={starTrigger} />
      <Confetti show={confetti} onDone={() => setConfetti(false)} />
      <button onClick={() => setView('chars')} className="mb-4 text-candy-blueDark font-bold min-h-[44px]">← 返回字表</button>

      {/* Step indicator */}
      <div className="flex gap-1 mb-6">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => { setLearnStep(i); setShowResult(false); setPracticeAnswer(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold min-h-[40px] transition-all ${
              learnStep === i ? 'bg-candy-greenDark text-white' : 'bg-white text-gray-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {learnStep === 0 && (
        <div className="text-center">
          <button onClick={handleCharClick} className="w-48 h-48 mx-auto bg-gradient-to-br from-candy-green to-candy-blue rounded-candy shadow-lg flex flex-col items-center justify-center active:scale-95 transition-all">
            <span className="text-8xl font-bold text-white mb-2">{currentChar.char}</span>
            <span className="text-white/90 text-lg font-bold">{currentChar.pinyin}</span>
          </button>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <span className="bg-white px-3 py-1 rounded-full">部首：{currentChar.radical}</span>
            <span className="bg-white px-3 py-1 rounded-full">{currentChar.strokes}画</span>
          </div>
          <p className="text-gray-400 text-sm mt-4">👆 点击汉字听发音</p>
          <button onClick={() => setLearnStep(1)} className="btn-green mt-6">下一步 →</button>
        </div>
      )}

      {learnStep === 1 && (
        <div className="text-center">
          <p className="text-gray-500 mb-4 text-sm">看笔顺动画，学习写字</p>
          <StrokeAnimation />
          <p className="text-gray-400 text-sm mt-4">{currentChar.char} 共 {currentChar.strokes} 画</p>
          <button onClick={() => setLearnStep(2)} className="btn-green mt-6">下一步 →</button>
        </div>
      )}

      {learnStep === 2 && (
        <div className="space-y-3">
          <p className="text-center text-gray-500 text-sm mb-4">常用组词（点击听发音）</p>
          {currentChar.words.map((w, i) => (
            <button
              key={i}
              onClick={() => speak(w, 'zh-CN')}
              className="w-full p-4 bg-gradient-to-r from-candy-green/30 to-candy-blue/30 rounded-candy text-xl font-bold text-gray-700 shadow-sm active:scale-98 transition-all min-h-[60px]"
            >
              🔊 {w}
            </button>
          ))}
          <div className="text-center mt-4">
            <button onClick={() => setLearnStep(3)} className="btn-green">下一步 →</button>
          </div>
        </div>
      )}

      {learnStep === 3 && (
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">例句（点击听发音）</p>
          <button
            onClick={() => speak(currentChar.example, 'zh-CN', 0.85)}
            className="w-full p-6 bg-gradient-to-r from-candy-yellow to-candy-pink rounded-candy text-xl font-bold text-gray-700 shadow-lg active:scale-98 transition-all min-h-[100px]"
          >
            🔊 {currentChar.example}
          </button>
          <button onClick={() => setLearnStep(4)} className="btn-purple mt-6">开始练习！✏️</button>
        </div>
      )}

      {learnStep === 4 && practiceQ && (
        <div>
          <div className="text-center mb-6">
            <button onClick={() => speak(currentChar.char, 'zh-CN')} className="text-5xl p-4 bg-candy-green rounded-full min-h-[60px] min-w-[60px]">
              🔊
            </button>
            <p className="mt-2 text-gray-500 text-sm">听读音，选正确的汉字</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {practiceQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handlePracticeSelect(idx)}
                disabled={showResult}
                className={`p-6 rounded-2xl text-4xl font-bold min-h-[80px] transition-all active:scale-95 ${
                  showResult && idx === practiceQ.answer ? 'bg-candy-green ring-4 ring-candy-greenDark text-white' :
                  showResult && idx === practiceAnswer ? 'bg-candy-pink ring-4 ring-candy-pinkDark' :
                  'bg-white shadow-md hover:bg-candy-green/10'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {showResult && (
            <div className="text-center mt-6">
              {practiceAnswer === practiceQ.answer ? (
                <>
                  <p className="text-candy-greenDark font-extrabold text-xl mb-4">🎉 答对啦！掌握了「{currentChar.char}」</p>
                  <button onClick={nextChar} className="btn-green">下一个字 →</button>
                </>
              ) : (
                <>
                  <p className="text-candy-pinkDark font-bold text-lg mb-4">再想想，正确答案是「{currentChar.char}」</p>
                  <button onClick={() => { setShowResult(false); setPracticeAnswer(null); }} className="btn-blue">再试一次</button>
                  <button onClick={nextChar} className="btn-gray ml-2 bg-gray-300 text-gray-600">跳过</button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
