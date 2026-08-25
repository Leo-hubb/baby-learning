import { useState } from 'react';
import { useAppState } from '../store/useStore';
import { englishLevels, getUnitById } from '../data/english';
import { speak, playCorrectSound, playWrongSound, playStarSound } from '../utils/speech';
import type { EnglishUnit } from '../types';
import StarBurst from '../components/StarBurst';
import Confetti from '../components/Confetti';

type View = 'levels' | 'units' | 'learn';
type LearnStep = 'words' | 'sentences' | 'game';

export default function English() {
  const { state, updateProgress, addStars } = useAppState();
  const [view, setView] = useState<View>('levels');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [currentUnit, setCurrentUnit] = useState<EnglishUnit | null>(null);
  const [step, setStep] = useState<LearnStep>('words');
  const [clickedWords, setClickedWords] = useState<Set<string>>(new Set());
  const [sentenceRead, setSentenceRead] = useState(false);
  const [starTrigger, setStarTrigger] = useState(0);
  const [confetti, setConfetti] = useState(false);

  // Check if level is unlocked
  const isLevelUnlocked = (level: number) => {
    if (level === 1) return true;
    const prevLevel = englishLevels.find(l => l.level === level - 1);
    if (!prevLevel) return false;
    return prevLevel.units.every(u => {
      const p = state.progress[`english:${u.id}`];
      return p && (p.status === 'completed' || p.status === 'mastered');
    });
  };

  const isUnitUnlocked = (unit: EnglishUnit) => {
    if (unit.unitNumber === 1) return true;
    const prev = currentUnit?.level ? englishLevels.find(l => l.level === currentUnit.level)?.units.find(u => u.unitNumber === unit.unitNumber - 1) : undefined;
    if (!prev) return true;
    const p = state.progress[`english:${prev.id}`];
    return p && (p.status === 'completed' || p.status === 'mastered');
  };

  const startUnit = (unit: EnglishUnit) => {
    setCurrentUnit(unit);
    setStep('words');
    setClickedWords(new Set());
    setSentenceRead(false);
    setView('learn');
  };

  const handleWordClick = (word: string) => {
    speak(word, 'en-US');
    setClickedWords(prev => new Set(prev).add(word));
  };

  const allWordsClicked = currentUnit ? currentUnit.words.every(w => clickedWords.has(w.word)) : false;

  const handleSentenceClick = (sentence: string) => {
    speak(sentence, 'en-US', 0.85);
    setSentenceRead(true);
  };

  // Game component
  const GameSection = () => {
    const [gameScore, setGameScore] = useState(0);
    const [gameDone, setGameDone] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    if (!currentUnit) return null;

    // Build questions based on game type
    const questions = currentUnit.words.map(w => {
      const options = [w.emoji];
      const others = currentUnit.words.filter(x => x.word !== w.word);
      while (options.length < 4 && others.length > 0) {
        const idx = Math.floor(Math.random() * others.length);
        if (!options.includes(others[idx].emoji)) options.push(others[idx].emoji);
        others.splice(idx, 1);
      }
      while (options.length < 4) {
        const e = ['🍎', '🐱', '🚗', '⭐', '🌸', '🎈'][Math.floor(Math.random() * 6)];
        if (!options.includes(e)) options.push(e);
      }
      options.sort(() => Math.random() - 0.5);
      return { word: w.word, emoji: w.emoji, options, answer: options.indexOf(w.emoji) };
    });

    const totalQ = Math.min(questions.length, 5);
    const q = questions[currentQ % questions.length];

    const handleSelect = (idx: number) => {
      if (showResult) return;
      setSelected(idx);
      setShowResult(true);
      const correct = idx === q.answer;
      if (correct) {
        playCorrectSound();
        setGameScore(prev => prev + 20);
      } else {
        playWrongSound();
      }
      setTimeout(() => {
        if (currentQ + 1 >= totalQ) {
          setGameDone(true);
          const finalScore = gameScore + (correct ? 20 : 0);
          if (finalScore >= 80 && allWordsClicked && sentenceRead) {
            updateProgress('english', currentUnit.id, { status: 'completed', score: finalScore, stars: 3 });
            addStars(3);
            setStarTrigger(t => t + 1);
            setConfetti(true);
          } else {
            updateProgress('english', currentUnit.id, { status: 'in_progress', score: finalScore });
          }
        } else {
          setCurrentQ(prev => prev + 1);
          setSelected(null);
          setShowResult(false);
        }
      }, 1200);
    };

    if (gameDone) {
      return (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-extrabold text-candy-pinkDark mb-2">游戏结束！</h3>
          <p className="text-xl font-bold mb-4">得分：{gameScore} / 100</p>
          {gameScore >= 80 ? (
            <p className="text-candy-greenDark font-bold text-lg">太棒了！单元完成！⭐⭐⭐</p>
          ) : (
            <p className="text-gray-500">再试一次，需要80分以上哦～</p>
          )}
          <button onClick={() => setView('units')} className="btn-pink mt-6">返回单元列表</button>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-gray-500">第 {currentQ + 1}/{totalQ} 题</span>
          <span className="text-sm font-bold text-candy-yellowDark">得分：{gameScore}</span>
        </div>
        <div className="text-center mb-6">
          <button onClick={() => speak(q.word, 'en-US')} className="text-5xl p-4 bg-candy-blue rounded-full hover:scale-105 transition-transform min-h-[60px] min-w-[60px]">
            🔊
          </button>
          <p className="mt-2 text-gray-500 text-sm">点击喇叭听发音，选正确图片</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showResult}
              className={`p-6 rounded-2xl text-5xl min-h-[80px] transition-all active:scale-95 ${
                showResult && idx === q.answer ? 'bg-candy-green ring-4 ring-candy-greenDark' :
                showResult && idx === selected ? 'bg-candy-pink ring-4 ring-candy-pinkDark' :
                'bg-white hover:bg-candy-blue/20 shadow-md'
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
  if (view === 'levels') {
    return (
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-candy-pinkDark to-candy-purpleDark bg-clip-text text-transparent">
          🔤 英语乐园
        </h2>
        <div className="space-y-4">
          {englishLevels.map(level => {
            const unlocked = isLevelUnlocked(level.level);
            const completedCount = level.units.filter(u => {
              const p = state.progress[`english:${u.id}`];
              return p && (p.status === 'completed' || p.status === 'mastered');
            }).length;
            return (
              <button
                key={level.level}
                onClick={() => { if (unlocked) { setSelectedLevel(level.level); setView('units'); } }}
                disabled={!unlocked}
                className={`w-full p-5 rounded-candy text-left transition-all active:scale-98 ${
                  unlocked ? 'bg-gradient-to-r from-candy-pink to-candy-purple shadow-lg hover:shadow-xl' : 'bg-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-white">{level.name}</h3>
                    <p className="text-white/80 text-sm">10个主题单元</p>
                  </div>
                  <div className="text-right">
                    {unlocked ? (
                      <>
                        <div className="text-3xl font-extrabold text-white">{completedCount}/10</div>
                        <div className="text-white/70 text-xs">已完成</div>
                      </>
                    ) : (
                      <div className="text-4xl">🔒</div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'units') {
    const level = englishLevels.find(l => l.level === selectedLevel)!;
    return (
      <div>
        <button onClick={() => setView('levels')} className="mb-4 text-candy-blueDark font-bold flex items-center gap-1 min-h-[44px]">
          ← 返回级别
        </button>
        <h2 className="text-2xl font-extrabold text-center mb-6 text-candy-pinkDark">{level.name}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {level.units.map(unit => {
            const p = state.progress[`english:${unit.id}`];
            const completed = p && (p.status === 'completed' || p.status === 'mastered');
            const unlocked = isUnitUnlocked(unit);
            return (
              <button
                key={unit.id}
                onClick={() => unlocked && startUnit(unit)}
                disabled={!unlocked}
                className={`p-4 rounded-candy text-center transition-all active:scale-95 min-h-[100px] ${
                  completed ? 'bg-candy-green/30 ring-2 ring-candy-green' :
                  unlocked ? 'bg-white shadow-md hover:shadow-lg' : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="text-3xl mb-1">{unlocked ? (completed ? '✅' : '📚') : '🔒'}</div>
                <div className="font-bold text-sm text-gray-700">U{unit.unitNumber}</div>
                <div className="text-xs text-gray-500">{unit.titleCn}</div>
                {completed && <div className="text-candy-yellowDark text-xs mt-1">⭐⭐⭐</div>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Learn view
  if (!currentUnit) return null;
  return (
    <div>
      <StarBurst trigger={starTrigger} />
      <Confetti show={confetti} onDone={() => setConfetti(false)} />
      <button onClick={() => setView('units')} className="mb-4 text-candy-blueDark font-bold flex items-center gap-1 min-h-[44px]">
        ← 返回单元
      </button>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-candy-pinkDark">Unit {currentUnit.unitNumber}: {currentUnit.title}</h2>
        <p className="text-gray-500">{currentUnit.titleCn}</p>
      </div>

      {/* Step tabs */}
      <div className="flex gap-2 mb-6">
        {(['words', 'sentences', 'game'] as LearnStep[]).map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm min-h-[44px] transition-all ${
              step === s ? 'bg-candy-pinkDark text-white shadow-lg' : 'bg-white text-gray-500'
            }`}
          >
            {i + 1}. {s === 'words' ? '单词' : s === 'sentences' ? '句型' : '游戏'}
          </button>
        ))}
      </div>

      {step === 'words' && (
        <div>
          <p className="text-center text-gray-500 mb-4 text-sm">点击卡片听发音，全部点击后进入下一步</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {currentUnit.words.map(w => (
              <button
                key={w.word}
                onClick={() => handleWordClick(w.word)}
                className={`p-4 rounded-candy text-center transition-all active:scale-95 min-h-[120px] ${
                  clickedWords.has(w.word) ? 'bg-candy-green/20 ring-2 ring-candy-green' : 'bg-white shadow-md hover:shadow-lg'
                }`}
              >
                <div className="text-5xl mb-2">{w.emoji}</div>
                <div className="font-extrabold text-lg text-gray-800">{w.word}</div>
                {w.phonetic && <div className="text-xs text-gray-400">{w.phonetic}</div>}
                {clickedWords.has(w.word) && <div className="text-candy-greenDark text-xs mt-1">✓ 已学</div>}
              </button>
            ))}
          </div>
          {allWordsClicked && (
            <div className="text-center mt-6">
              <button onClick={() => setStep('sentences')} className="btn-green">
                单词学完啦！下一步 →
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'sentences' && (
        <div className="space-y-4">
          <p className="text-center text-gray-500 text-sm">点击句子听发音</p>
          {currentUnit.sentences.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSentenceClick(s)}
              className="w-full p-5 bg-gradient-to-r from-candy-blue to-candy-purple rounded-candy text-white text-xl font-bold shadow-lg active:scale-98 transition-all min-h-[80px]"
            >
              🔊 {s}
            </button>
          ))}
          {sentenceRead && (
            <div className="text-center mt-4">
              <button onClick={() => setStep('game')} className="btn-purple">
                开始游戏！🎮
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'game' && <GameSection />}
    </div>
  );
}
