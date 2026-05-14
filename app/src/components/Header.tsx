import { Volume2, VolumeX, HelpCircle, Sigma, Home, Lightbulb, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  levelIndex: number;
  totalLevels: number;
  progress: number;
  combo: number;
  muted: boolean;
  hintsLeft: number;
  mistakesLeft: number;
  onToggleMute: () => void;
  onHelp: () => void;
  onHome: () => void;
};

export function Header({
  levelIndex,
  totalLevels,
  progress,
  combo,
  muted,
  hintsLeft,
  mistakesLeft,
  onToggleMute,
  onHelp,
  onHome,
}: Props) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-ink-100">
      <div className="mx-auto max-w-7xl px-3 md:px-8 h-16 flex items-center gap-2 md:gap-4">
        <button
          onClick={onHome}
          className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition"
          aria-label="Về trang chủ"
        >
          <div className="grid place-items-center size-9 rounded-xl bg-ink-900 text-white shadow-soft">
            <Sigma size={18} />
          </div>
          <div className="leading-tight text-left">
            <div className="font-display font-extrabold tracking-tight text-ink-900">
              Tập Hợp Lab
            </div>
            <div className="text-[11px] text-ink-400 -mt-0.5 hidden sm:block">
              Toán 10 · Chủ đề Tập hợp
            </div>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-2 ml-2">
          <span className="chip bg-ink-100 text-ink-700">
            Màn {levelIndex + 1} / {totalLevels}
          </span>
        </div>

        <div className="flex-1 max-w-2xl mx-auto">
          <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 via-brand-400 to-accent-500"
              initial={false}
              animate={{ width: `${Math.round(progress * 100)}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1.5">
          <span className="chip bg-amber-100 text-amber-700 border border-amber-200" title="Gợi ý còn lại">
            <Lightbulb size={12} /> {hintsLeft}
          </span>
          <span
            className={
              "chip border " +
              (mistakesLeft <= 1
                ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                : "bg-ink-100 text-ink-700 border-ink-200")
            }
            title="Số lần thả sai cho phép còn lại"
          >
            <AlertTriangle size={12} /> {mistakesLeft}
          </span>
        </div>

        <motion.div
          key={combo}
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          className="chip bg-accent-500/10 text-accent-600 hidden sm:inline-flex"
        >
          🔥 Combo {combo}
        </motion.div>

        <button onClick={onToggleMute} className="btn-ghost !p-2.5" aria-label="Mute">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button onClick={onHelp} className="btn-ghost !p-2.5 hidden sm:inline-flex" aria-label="Help">
          <HelpCircle size={18} />
        </button>
        <button onClick={onHome} className="btn-ghost !p-2.5" aria-label="Home">
          <Home size={18} />
        </button>
      </div>
    </header>
  );
}
