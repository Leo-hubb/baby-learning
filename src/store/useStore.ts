import { useState, useEffect, useCallback } from 'react';
import type { AppState, ProgressItem, AdventureProgress, ModuleType, ItemStatus } from '../types';
import { badgeDefinitions } from '../data/badges';
import { englishLevels } from '../data/english';
import { literacyLevels, getTotalCharCount } from '../data/literacy';

const STORAGE_KEY = 'baby_learning_state';
const SYNC_FLAG_KEY = 'baby_learning_pending_sync';

// 生成匿名用户ID
function generateUserId(): string {
  return 'anon_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function getInitialState(): AppState {
  const today = new Date().toISOString().split('T')[0];
  return {
    userId: generateUserId(),
    progress: {},
    adventure: {},
    badges: [],
    stats: {
      totalStars: 0,
      consecutiveDays: 1,
      lastActiveDate: today,
      mathAdditionCount: 0,
      logicQuestionCount: 0,
    },
    lastSynced: 0,
  };
}

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as AppState;
      // Update consecutive days
      const today = new Date().toISOString().split('T')[0];
      if (parsed.stats.lastActiveDate !== today) {
        const lastDate = new Date(parsed.stats.lastActiveDate);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          parsed.stats.consecutiveDays += 1;
        } else if (diffDays > 1) {
          parsed.stats.consecutiveDays = 1;
        }
        parsed.stats.lastActiveDate = today;
      }
      return { ...getInitialState(), ...parsed };
    }
  } catch (e) {
    console.error('Failed to load state', e);
  }
  return getInitialState();
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(SYNC_FLAG_KEY, 'true');
  } catch (e) {
    console.error('Failed to save state', e);
  }
}

// 全局状态（简单的发布订阅模式）
let globalState: AppState = loadState();
const listeners = new Set<(state: AppState) => void>();

function notify() {
  saveState(globalState);
  listeners.forEach(l => l(globalState));
}

function checkBadges(state: AppState): string[] {
  const newBadges: string[] = [];
  const has = (id: string) => state.badges.includes(id);

  // 初次闯关
  const adventureCompleted = Object.values(state.adventure).filter(a => a.completed).length;
  if (adventureCompleted >= 1 && !has('first_adventure')) newBadges.push('first_adventure');

  // 英语小达人 - Level 1 全部完成
  const level1Units = englishLevels[0].units;
  const level1Completed = level1Units.every(u => {
    const p = state.progress[`english:${u.id}`];
    return p && (p.status === 'completed' || p.status === 'mastered');
  });
  if (level1Completed && !has('english_level1')) newBadges.push('english_level1');

  // 英语大师 - 全部3级
  const allEnglishCompleted = englishLevels.every(level =>
    level.units.every(u => {
      const p = state.progress[`english:${u.id}`];
      return p && (p.status === 'completed' || p.status === 'mastered');
    })
  );
  if (allEnglishCompleted && !has('english_master')) newBadges.push('english_master');

  // 识字徽章
  const masteredChars = Object.values(state.progress).filter(
    p => p.module === 'literacy' && p.status === 'mastered'
  ).length;
  if (masteredChars >= 20 && !has('literacy_100')) newBadges.push('literacy_100');
  if (masteredChars >= 60 && !has('literacy_300')) newBadges.push('literacy_300');
  if (masteredChars >= getTotalCharCount() && !has('literacy_all')) newBadges.push('literacy_all');

  // 数学小天才
  const mathNumbersDone = state.progress['math:numbers']?.status === 'completed';
  if (mathNumbersDone && state.stats.mathAdditionCount >= 20 && !has('math_genius')) {
    newBadges.push('math_genius');
  }

  // 逻辑大师
  if (state.stats.logicQuestionCount >= 50 && !has('logic_master')) {
    newBadges.push('logic_master');
  }

  // 全勤之星
  if (state.stats.consecutiveDays >= 7 && !has('streak_7')) newBadges.push('streak_7');

  // 星星收藏家
  if (state.stats.totalStars >= 100 && !has('stars_100')) newBadges.push('stars_100');

  // 闯关英雄
  if (adventureCompleted >= 10 && !has('adventure_all')) newBadges.push('adventure_all');

  // 完美主义
  const perfectLevel = Object.values(state.adventure).some(a => a.starsEarned >= 13);
  if (perfectLevel && !has('perfect_level')) newBadges.push('perfect_level');

  return newBadges;
}

export function useAppState() {
  const [state, setState] = useState<AppState>(globalState);

  useEffect(() => {
    const listener = (s: AppState) => setState({ ...s });
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const updateProgress = useCallback((module: ModuleType, itemId: string, updates: Partial<ProgressItem>) => {
    const key = `${module}:${itemId}`;
    const existing = globalState.progress[key];
    const base = existing || { module, itemId, status: 'in_progress' as ItemStatus, score: 0, stars: 0 };
    globalState = {
      ...globalState,
      progress: {
        ...globalState.progress,
        [key]: { ...base, ...updates, updatedAt: Date.now() },
      },
    };
    notify();
  }, []);

  const addStars = useCallback((count: number) => {
    globalState = {
      ...globalState,
      stats: { ...globalState.stats, totalStars: globalState.stats.totalStars + count },
    };
    const newBadges = checkBadges(globalState);
    if (newBadges.length > 0) {
      globalState = { ...globalState, badges: [...globalState.badges, ...newBadges] };
    }
    notify();
    return newBadges;
  }, []);

  const updateAdventure = useCallback((level: number, updates: Partial<AdventureProgress>) => {
    const existing = globalState.adventure[level];
    const base = existing || { level, starsEarned: 0, completed: false };
    globalState = {
      ...globalState,
      adventure: {
        ...globalState.adventure,
        [level]: { ...base, ...updates },
      },
    };
    const newBadges = checkBadges(globalState);
    if (newBadges.length > 0) {
      globalState = { ...globalState, badges: [...globalState.badges, ...newBadges] };
    }
    notify();
    return newBadges;
  }, []);

  const incrementStat = useCallback((key: keyof AppState['stats'], amount: number = 1) => {
    globalState = {
      ...globalState,
      stats: { ...globalState.stats, [key]: (globalState.stats[key] as number) + amount },
    };
    const newBadges = checkBadges(globalState);
    if (newBadges.length > 0) {
      globalState = { ...globalState, badges: [...globalState.badges, ...newBadges] };
    }
    notify();
    return newBadges;
  }, []);

  const resetProgress = useCallback((module?: ModuleType) => {
    if (module) {
      const newProgress = { ...globalState.progress };
      Object.keys(newProgress).forEach(key => {
        if (key.startsWith(`${module}:`)) delete newProgress[key];
      });
      globalState = { ...globalState, progress: newProgress };
    } else {
      globalState = { ...getInitialState(), userId: globalState.userId };
    }
    notify();
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify(globalState, null, 2);
  }, []);

  return {
    state,
    updateProgress,
    addStars,
    updateAdventure,
    incrementStat,
    resetProgress,
    exportData,
  };
}

export function getState(): AppState {
  return globalState;
}
