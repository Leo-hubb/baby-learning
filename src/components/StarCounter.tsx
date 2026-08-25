import { useAppState } from '../store/useStore';

export default function StarCounter() {
  const { state } = useAppState();
  return (
    <div className="md:hidden fixed top-3 right-3 z-40 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md flex items-center gap-1.5 min-h-[36px]">
      <span className="text-lg">⭐</span>
      <span className="font-extrabold text-candy-yellowDark text-sm">{state.stats.totalStars}</span>
    </div>
  );
}
