import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  closeable?: boolean;
};

export function Modal({ open, onClose, title, children, closeable = true }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-ink-900/60 backdrop-blur-md p-4"
          onClick={closeable ? onClose : undefined}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="card-surface w-full max-w-lg p-6 md:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              {title && (
                <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink-900">
                  {title}
                </h2>
              )}
              {closeable && onClose && (
                <button onClick={onClose} className="btn-ghost !p-2" aria-label="Đóng">
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="mt-3">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
