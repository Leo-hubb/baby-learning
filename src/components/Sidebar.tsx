import { NavLink, useLocation } from 'react-router-dom';
import { useAppState } from '../store/useStore';

const navItems = [
  { path: '/english', label: '英语乐园', icon: '🔤', color: 'bg-candy-pink' },
  { path: '/literacy', label: '识字花园', icon: '📖', color: 'bg-candy-green' },
  { path: '/math', label: '数字王国', icon: '🔢', color: 'bg-candy-blue' },
  { path: '/logic', label: '逻辑挑战', icon: '🧩', color: 'bg-candy-yellow' },
  { path: '/adventure', label: '闯关冒险', icon: '🎮', color: 'bg-candy-purple' },
];

export default function Sidebar() {
  const { state } = useAppState();
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-[220px] h-screen fixed left-0 top-0 bg-white/80 backdrop-blur-sm border-r-2 border-candy-pink/30 shadow-lg z-50">
      {/* Logo */}
      <div className="p-4 text-center border-b border-gray-100">
        <div className="text-4xl mb-1 animate-float">🌈</div>
        <h1 className="text-lg font-extrabold bg-gradient-to-r from-candy-pinkDark via-candy-purpleDark to-candy-blueDark bg-clip-text text-transparent">
          宝贝学习乐园
        </h1>
      </div>

      {/* Star count */}
      <div className="mx-3 mt-3 p-3 bg-gradient-to-r from-candy-yellow to-candy-yellow/50 rounded-2xl text-center shadow-sm">
        <div className="text-2xl">⭐</div>
        <div className="text-xl font-extrabold text-candy-yellowDark">{state.stats.totalStars}</div>
        <div className="text-xs text-gray-500">星星总数</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-3 rounded-2xl min-h-[44px] transition-all duration-200 active:scale-95 ${
              location.pathname.startsWith(item.path)
                ? `${item.color} shadow-md font-bold text-gray-800`
                : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom links */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        <NavLink to="/badges" className="flex items-center gap-2 px-3 py-2 rounded-xl min-h-[44px] hover:bg-gray-50 text-gray-600 text-sm">
          <span className="text-xl">🏅</span> 徽章墙
        </NavLink>
        <NavLink to="/settings" className="flex items-center gap-2 px-3 py-2 rounded-xl min-h-[44px] hover:bg-gray-50 text-gray-600 text-sm">
          <span className="text-xl">⚙️</span> 设置
        </NavLink>
      </div>
    </aside>
  );
}
