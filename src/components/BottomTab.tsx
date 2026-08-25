import { NavLink, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/english', label: '英语', icon: '🔤' },
  { path: '/literacy', label: '识字', icon: '📖' },
  { path: '/math', label: '数学', icon: '🔢' },
  { path: '/logic', label: '逻辑', icon: '🧩' },
  { path: '/adventure', label: '闯关', icon: '🎮' },
];

export default function BottomTab() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-white/95 backdrop-blur-sm border-t-2 border-candy-pink/30 shadow-lg z-50 flex items-center px-1"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {tabs.map(tab => {
        const active = location.pathname.startsWith(tab.path);
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={`tab-item ${active ? 'text-candy-pinkDark' : 'text-gray-400'}`}
          >
            <span className={`text-2xl transition-transform ${active ? 'scale-110' : ''}`}>{tab.icon}</span>
            <span className="text-[11px] font-semibold mt-0.5">{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
