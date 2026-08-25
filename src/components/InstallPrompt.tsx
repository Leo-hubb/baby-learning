import { useState, useEffect } from 'react';
import { triggerInstall, isPWAInstalled } from '../main';

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 已安装则不显示
    if (isPWAInstalled()) return;

    // 检查是否已关闭过
    if (localStorage.getItem('pwa_install_dismissed')) return;

    // 检测 iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    setIsIOS(ios);

    // 监听安装可用事件
    const handleAvailable = () => setShow(true);
    const handleInstalled = () => setShow(false);

    window.addEventListener('pwa-install-available', handleAvailable);
    window.addEventListener('pwa-installed', handleInstalled);

    // Android/Chrome: 延迟显示（等 beforeinstallprompt 触发）
    // iOS: 直接显示引导
    if (ios) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('pwa-install-available', handleAvailable);
        window.removeEventListener('pwa-installed', handleInstalled);
      };
    }

    // 非iOS：如果5秒内没触发 beforeinstallprompt，也显示一个通用提示
    const timer = setTimeout(() => {
      if (!dismissed) setShow(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('pwa-install-available', handleAvailable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, [dismissed]);

  const handleInstall = () => {
    triggerInstall();
    setShow(false);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('pwa_install_dismissed', '1');
  };

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] md:top-4 md:left-[236px] md:right-4 md:max-w-md md:mx-auto">
      <div className="bg-white shadow-xl rounded-b-2xl md:rounded-2xl border-b-2 md:border-2 border-candy-pink/30 p-4 mx-2 md:mx-0">
        <div className="flex items-start gap-3">
          <div className="text-4xl flex-shrink-0">📱</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-gray-800 text-sm">安装到桌面</h3>
            {isIOS ? (
              <p className="text-xs text-gray-500 mt-1">
                点击 Safari 底部分享按钮 <span className="inline-block">⎋</span>，选择「添加到主屏幕」
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                一键安装，像App一样全屏使用，支持离线学习
              </p>
            )}
            <div className="flex gap-2 mt-3">
              {!isIOS && (
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-candy-pinkDark text-white text-xs font-bold py-2 rounded-xl min-h-[36px] active:scale-95 transition-transform"
                >
                  立即安装
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="px-3 bg-gray-100 text-gray-500 text-xs font-bold py-2 rounded-xl min-h-[36px] active:scale-95 transition-transform"
              >
                稍后
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-300 hover:text-gray-500 text-lg flex-shrink-0 min-h-[24px] min-w-[24px]"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
