import { useEffect, useState } from 'react';

interface ConfettiProps {
  show: boolean;
  onDone?: () => void;
}

const colors = ['#FFB6C1', '#87CEEB', '#FFFACD', '#98FB98', '#DDA0DD', '#FFD700', '#FF69B4'];

export default function Confetti({ show, onDone }: ConfettiProps) {
  const [pieces, setPieces] = useState<Array<{ id: number; left: number; delay: number; color: string; size: number }>>([]);

  useEffect(() => {
    if (show) {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
      }));
      setPieces(newPieces);
      const timer = setTimeout(() => {
        setPieces([]);
        onDone?.();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onDone]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
