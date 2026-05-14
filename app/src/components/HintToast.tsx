import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

export function HintToast({ hint }: { hint: string | null }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <AnimatePresence>
        {hint && (
          <motion.div
            key={hint}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className="max-w-md card-surface !bg-accent-500/95 !border-accent-400 text-white px-4 py-3 flex items-start gap-2.5 shadow-glow"
          >
            <Lightbulb size={18} className="shrink-0 mt-0.5" />
            <div className="text-sm font-medium">{hint}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
