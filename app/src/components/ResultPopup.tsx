import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import type { Definition } from "../data/gameData";
import { asset } from "../lib/utils";

type Props = {
  open: boolean;
  title: string;
  text: string;
  definition: Definition;
  effect: "intersect" | "union" | "difference" | "math";
  nextLabel: string;
  onNext: () => void;
};

export function ResultPopup({
  open,
  title,
  text,
  definition,
  nextLabel,
  onNext,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center p-3 md:p-6 pointer-events-none"
        >
          <div className="absolute inset-0 bg-ink-900/15" />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="card-surface relative w-full max-w-2xl p-5 md:p-6 pointer-events-auto max-h-[72vh] overflow-y-auto"
          >
            <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink-900">
              {title}
            </h2>
            <p className="mt-1.5 text-ink-600 text-sm md:text-base leading-relaxed">
              {text}
            </p>

            <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50/60 p-3.5 md:p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-700 uppercase tracking-wide">
                <BookOpen size={14} /> Định nghĩa
              </div>
              <div className="mt-1.5 flex flex-col md:flex-row md:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-ink-700 text-sm md:text-[15px] leading-relaxed">
                    {definition.body}
                  </p>
                  <div className="mt-2 px-3 py-2 rounded-lg bg-white border border-brand-100 font-mono text-sm md:text-[15px] text-ink-900 break-words">
                    {definition.formula}
                  </div>
                </div>
                {definition.image && (
                  <div className="shrink-0 flex flex-col items-center md:w-44">
                    <img
                      src={asset(definition.image)}
                      alt={definition.imageCaption ?? "Minh hoạ tập hợp"}
                      className="w-full max-w-[180px] h-auto rounded-lg bg-white border border-brand-100 p-2"
                    />
                    {definition.imageCaption && (
                      <div className="text-xs font-semibold text-brand-700 mt-1">
                        {definition.imageCaption}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={onNext} className="btn-accent">
                {nextLabel} <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
