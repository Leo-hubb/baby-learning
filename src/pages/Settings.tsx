import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppState } from '../store/useStore';
import { triggerInstall, isPWAInstalled, getInstallPrompt } from '../main';

export default function Settings() {
  const { state, resetProgress, exportData } = useAppState();
  const [parentMode, setParentMode] = useState(false);
  const [password, setPassword] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [resetConfirm, setResetConfirm] = useState<string | null>(null);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleParentLogin = () => {
    if (password === '1234') {
      setParentMode(true);
      setPassword('');
    } else {
      alert('密码错误');
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baby-learning-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = (module: string) => {
    if (resetConfirm === module) {
      resetProgress(module as any);
      setResetConfirm(null);
      alert('进度已重置');
    } else {
      setResetConfirm(module);
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-candy-blueDark to-candy-purpleDark bg-clip-text text-transparent">
        ⚙️ 设置
      </h2>

      {/* User info */}
      <div className="bg-white rounded-candy p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-candy-pink to-candy-purple rounded-full flex items-center justify-center text-2xl">
            👶
          </div>
          <div>
            <p className="font-bold text-gray-700">小宝贝</p>
            <p className="text-xs text-gray-400">ID: {state.userId.slice(0, 12)}...</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="bg-candy-yellow/20 rounded-xl p-2">
            <div className="text-xl font-extrabold text-candy-yellowDark">{state.stats.totalStars}</div>
            <div className="text-xs text-gray-500">星星</div>
          </div>
          <div className="bg-candy-green/20 rounded-xl p-2">
            <div className="text-xl font-extrabold text-candy-greenDark">{state.badges.length}</div>
            <div className="text-xs text-gray-500">徽章</div>
          </div>
          <div className="bg-candy-blue/20 rounded-xl p-2">
            <div className="text-xl font-extrabold text-candy-blueDark">{state.stats.consecutiveDays}</div>
            <div className="text-xs text-gray-500">连续天数</div>
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="bg-white rounded-candy p-4 mb-4 shadow-sm">
        <button
          onClick={() => setShowQR(!showQR)}
          className="w-full flex items-center justify-between min-h-[44px]"
        >
          <span className="font-bold text-gray-700">📱 扫码访问</span>
          <span className="text-gray-400">{showQR ? '▲' : '▼'}</span>
        </button>
        {showQR && (
          <div className="text-center mt-4 pt-4 border-t border-gray-100">
            <div className="inline-block p-4 bg-white rounded-candy border-2 border-candy-pink/30">
              <QRCodeSVG value={currentUrl} size={180} level="H" />
            </div>
            <p className="text-sm text-gray-500 mt-3">用手机扫码打开本页面</p>
            <p className="text-xs text-gray-400 mt-1 break-all">{currentUrl}</p>
          </div>
        )}
      </div>

      {/* Install App */}
      <div className="bg-gradient-to-r from-candy-pink/20 to-candy-purple/20 rounded-candy p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-4xl">📲</div>
          <div className="flex-1">
            <h3 className="font-extrabold text-gray-800">安装到桌面</h3>
            <p className="text-xs text-gray-500">一键安装，像App一样全屏使用，支持离线</p>
          </div>
          {isPWAInstalled() ? (
            <span className="bg-candy-green text-white text-xs font-bold px-3 py-2 rounded-xl">已安装 ✓</span>
          ) : getInstallPrompt() ? (
            <button onClick={triggerInstall} className="btn-pink text-sm py-2 px-4">立即安装</button>
          ) : (
            <span className="text-xs text-gray-400">请用浏览器打开</span>
          )}
        </div>
      </div>

      {/* Sound toggle */}
      <div className="bg-white rounded-candy p-4 mb-4 shadow-sm flex items-center justify-between">
        <span className="font-bold text-gray-700">🔊 音效</span>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`w-14 h-8 rounded-full transition-all min-h-[32px] ${soundEnabled ? 'bg-candy-green' : 'bg-gray-300'}`}
        >
          <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${soundEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Parent mode */}
      {!parentMode ? (
        <div className="bg-white rounded-candy p-4 mb-4 shadow-sm">
          <p className="font-bold text-gray-700 mb-3">👨‍👩‍👧 家长模式</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="请输入密码（默认1234）"
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm min-h-[44px]"
              onKeyDown={e => e.key === 'Enter' && handleParentLogin()}
            />
            <button onClick={handleParentLogin} className="btn-blue px-4 py-2 text-sm">进入</button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-candy p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-gray-700">👨‍👩‍👧 家长模式</span>
            <button onClick={() => setParentMode(false)} className="text-sm text-gray-400 min-h-[36px]">退出</button>
          </div>

          {/* Learning report */}
          <div className="bg-candy-blue/10 rounded-xl p-3 mb-4">
            <h4 className="font-bold text-sm text-gray-700 mb-2">📊 学习报告</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <p>总星星数：{state.stats.totalStars}</p>
              <p>已获徽章：{state.badges.length} 个</p>
              <p>连续学习：{state.stats.consecutiveDays} 天</p>
              <p>加减法练习：{state.stats.mathAdditionCount} 题</p>
              <p>逻辑挑战：{state.stats.logicQuestionCount} 题</p>
              <p>闯关完成：{Object.values(state.adventure).filter(a => a.completed).length} / 10 关</p>
            </div>
          </div>

          {/* Export data */}
          <button onClick={handleExport} className="w-full btn-green mb-2 text-sm">
            📥 导出学习数据
          </button>

          {/* Reset progress */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-bold">重置进度（危险操作）</p>
            {[
              { key: 'english', label: '🔤 英语乐园' },
              { key: 'literacy', label: '📖 识字花园' },
              { key: 'math', label: '🔢 数字王国' },
              { key: 'logic', label: '🧩 逻辑挑战' },
              { key: 'adventure', label: '🎮 闯关冒险' },
              { key: 'all', label: '🗑️ 全部数据' },
            ].map(m => (
              <button
                key={m.key}
                onClick={() => handleReset(m.key)}
                className={`w-full py-2 px-3 rounded-xl text-sm font-bold min-h-[44px] transition-all ${
                  resetConfirm === m.key ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500 hover:bg-red-100'
                }`}
              >
                {resetConfirm === m.key ? `确认重置${m.label}？再次点击确认` : `重置${m.label}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* About */}
      <div className="text-center text-xs text-gray-400 mt-8 pb-4">
        <p>🌈 宝贝学习乐园 v1.0</p>
        <p className="mt-1">为4岁左右儿童打造的综合学习平台</p>
        <p className="mt-1">数据存储于本地浏览器，支持云端同步</p>
      </div>
    </div>
  );
}
