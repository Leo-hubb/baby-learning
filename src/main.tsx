import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// 隐藏启动画面
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.classList.add('hidden');
      setTimeout(() => splash.remove(), 600);
    }
  }, 800);
});

// 注册 Service Worker（PWA 离线支持）
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('PWA Service Worker 注册成功:', registration.scope);
        // 检查更新
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // 有新版本可用
                console.log('发现新版本，刷新后生效');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.warn('Service Worker 注册失败:', error);
      });
  });
}

// 监听安装事件（用于自定义安装提示）
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
window.addEventListener('beforeinstallprompt', (e: Event) => {
  e.preventDefault();
  deferredPrompt = e as BeforeInstallPromptEvent;
  window.dispatchEvent(new CustomEvent('pwa-install-available'));
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  window.dispatchEvent(new CustomEvent('pwa-installed'));
});

// 导出安装提示函数供组件使用
export function getInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferredPrompt;
}

export function triggerInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('用户接受了安装');
      }
      deferredPrompt = null;
    });
  }
}

export function isPWAInstalled() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
