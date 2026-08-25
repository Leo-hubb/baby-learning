import { useAppState } from '../store/useStore';
import { badgeDefinitions } from '../data/badges';

export default function Badges() {
  const { state } = useAppState();
  const earnedCount = state.badges.length;

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-candy-yellowDark via-candy-pinkDark to-candy-purpleDark bg-clip-text text-transparent">
        🏅 徽章墙
      </h2>
      <p className="text-center text-gray-500 text-sm mb-6">已获得 {earnedCount} / {badgeDefinitions.length} 个徽章</p>

      {/* Progress bar */}
      <div className="h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-candy-yellow via-candy-pink to-candy-purple transition-all duration-500"
          style={{ width: `${(earnedCount / badgeDefinitions.length) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badgeDefinitions.map(badge => {
          const earned = state.badges.includes(badge.badgeId);
          const earnedAt = earned ? state.badges.indexOf(badge.badgeId) : -1;
          return (
            <div
              key={badge.badgeId}
              className={`p-4 rounded-candy text-center transition-all ${
                earned
                  ? 'bg-gradient-to-br from-candy-yellow/50 to-candy-pink/50 shadow-lg ring-2 ring-candy-yellow'
                  : 'bg-gray-100 opacity-60'
              }`}
            >
              <div className={`text-5xl mb-2 ${earned ? 'animate-float' : 'grayscale'}`}>
                {earned ? badge.icon : '🔒'}
              </div>
              <h3 className={`font-extrabold text-sm ${earned ? 'text-gray-800' : 'text-gray-400'}`}>
                {badge.name}
              </h3>
              <p className={`text-xs mt-1 ${earned ? 'text-gray-500' : 'text-gray-400'}`}>
                {badge.description}
              </p>
              {earned && (
                <p className="text-xs text-candy-yellowDark mt-2 font-bold">✓ 已获得</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
