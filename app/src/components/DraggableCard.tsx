import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

type Props = {
  id: string;
  text: string;
  placed?: boolean;
  shaking?: boolean;
  popped?: boolean;
  compact?: boolean;
};

export function DraggableCard({ id, text, placed, shaking, popped, compact }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: placed,
  });

  // Outer motion wrapper handles enter/exit; inner div is the actual draggable
  // — separating them prevents framer-motion `layout` from fighting @dnd-kit
  // transforms (which made cards feel laggy / hard to grab on larger screens).
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.15 }}
    >
      <div
        ref={setNodeRef}
        {...(!placed ? listeners : {})}
        {...attributes}
        style={{ touchAction: "none", userSelect: "none" }}
        className={cn(
          "rounded-2xl border bg-white text-ink-900 font-semibold shadow-soft transition-all",
          "flex items-center justify-center gap-1.5",
          compact ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2.5 text-sm md:text-base",
          placed
            ? "border-mint-500/50 bg-mint-500/5 cursor-default"
            : "border-ink-200 hover:-translate-y-0.5 hover:shadow-glow cursor-grab active:cursor-grabbing",
          isDragging && "opacity-50",
          shaking && "animate-shake border-rose-500",
          popped && "animate-pop-in",
        )}
      >
        <span>{text}</span>
      </div>
    </motion.div>
  );
}
