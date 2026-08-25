import { useEffect, useRef } from 'react';
import { initSpeech, speak } from '../utils/speech';

// 全局语音初始化组件
// 解决浏览器自动播放限制：用户首次交互后激活语音系统
export default function SpeechInit() {
  const initialized = useRef(false);

  useEffect(() => {
    const activateSpeech = () => {
      if (initialized.current) return;
      initialized.current = true;
      initSpeech();
      // 播放一个极短的静音来解锁音频
      speak('', 'zh-CN');
      // 移除监听器
      document.removeEventListener('click', activateSpeech);
      document.removeEventListener('touchstart', activateSpeech);
      document.removeEventListener('keydown', activateSpeech);
    };

    // 在用户首次交互时激活
    document.addEventListener('click', activateSpeech, { once: true });
    document.addEventListener('touchstart', activateSpeech, { once: true });
    document.addEventListener('keydown', activateSpeech, { once: true });

    // 也尝试立即初始化（某些浏览器允许）
    initSpeech();

    return () => {
      document.removeEventListener('click', activateSpeech);
      document.removeEventListener('touchstart', activateSpeech);
      document.removeEventListener('keydown', activateSpeech);
    };
  }, []);

  return null;
}
