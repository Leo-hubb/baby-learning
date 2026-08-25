import type { Badge } from '../types';

export const badgeDefinitions: Badge[] = [
  { badgeId: 'first_adventure', name: '初次闯关', description: '完成第1关', icon: '🎯' },
  { badgeId: 'english_level1', name: '英语小达人', description: '英语乐园完成Level 1全部单元', icon: '🔤' },
  { badgeId: 'english_master', name: '英语大师', description: '英语乐园完成全部3个级别', icon: '🏆' },
  { badgeId: 'literacy_100', name: '识字小能手', description: '掌握100个汉字', icon: '📖' },
  { badgeId: 'literacy_300', name: '识字百事通', description: '掌握300个汉字', icon: '📚' },
  { badgeId: 'literacy_all', name: '识字状元', description: '掌握全部汉字', icon: '👑' },
  { badgeId: 'math_genius', name: '数学小天才', description: '完成所有数字认知和20道加减法', icon: '🔢' },
  { badgeId: 'logic_master', name: '逻辑大师', description: '逻辑挑战完成50道题', icon: '🧩' },
  { badgeId: 'streak_7', name: '全勤之星', description: '连续7天登录学习', icon: '🌟' },
  { badgeId: 'stars_100', name: '星星收藏家', description: '累计获得100颗星星', icon: '⭐' },
  { badgeId: 'adventure_all', name: '闯关英雄', description: '完成全部10个闯关关卡', icon: '🦸' },
  { badgeId: 'perfect_level', name: '完美主义', description: '任意关卡获得13颗星（全对）', icon: '💎' },
];

export function getBadgeById(id: string): Badge | undefined {
  return badgeDefinitions.find(b => b.badgeId === id);
}
