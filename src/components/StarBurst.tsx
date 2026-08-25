import { useState, useEffect } from 'react';

interface StarBurstProps {
  trigger: number; // change this to trigger
  x?: number;
  y?: number;
}

export default function StarBurst({ trigger }: StarBurstProps) {
  const [stars, setStars] = useState<Array<{ id: number; angle: number; emoji: string }>>([]);

  useEffect(() => {
    if (trigger > 0) {
      const emojis = ['⭐', '🌟', '✨', '💫'];
      const newStars = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        angle: (i / 8) * 360,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      }));
      setStars(newStars);
      const timer = setTimeout(() => setStars([]), 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (stars.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[90] flex items-center justify-center">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute text-3xl star-float"
          style={{
            transform: `rotate(${s.angle}deg) translateY(-30px)`,
            animationDelay: `${Math.random() * 0.2}s`,
          }}
        >
          {s.emoji}
        </div>
      ))}
    </div>
  );
}
