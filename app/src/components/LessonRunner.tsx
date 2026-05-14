import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  X,
  Home as HomeIcon,
  RefreshCw,
  BookOpen,
  ChevronLeft,
  Trophy,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { LESSONS, type Lesson, type Step } from "../data/lessons";
import { playSound } from "../lib/audio";
import { cn, asset } from "../lib/utils";

type Props = {
  lessonId: keyof typeof LESSONS;
  onExit: () => void;
};

export function LessonRunner({ lessonId, onExit }: Props) {
  const lesson = LESSONS[lessonId];
  const [stepIndex, setStepIndex] = useState(0);
  const [, setDoneSteps] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);
  const step = lesson.steps[stepIndex];
  const isLast = stepIndex === lesson.steps.length - 1;

  function complete() {
    setDoneSteps((s) => new Set(s).add(stepIndex));
    playSound("pass");
    if (isLast) {
      setFinished(true);
      playSound("tada");
      [0, 220, 440].forEach((d) =>
        setTimeout(
          () =>
            confetti({
              particleCount: 140,
              spread: 100,
              startVelocity: 45,
              origin: { y: 0.55 },
            }),
          d,
        ),
      );
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  function goBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  const progress = (stepIndex + (finished ? 1 : 0)) / lesson.steps.length;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Sub-header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-ink-100">
        <div className="mx-auto max-w-5xl px-3 md:px-8 h-14 md:h-16 flex items-center gap-2 md:gap-4">
          <button onClick={onExit} className="btn-ghost !p-2.5" aria-label="Về trang chủ">
            <HomeIcon size={18} />
          </button>
          <div className="leading-tight">
            <div className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
              {lesson.number}
            </div>
            <div className="font-display font-extrabold text-ink-900 -mt-0.5">
              {lesson.title}
            </div>
          </div>

          <div className="flex-1 max-w-md mx-auto">
            <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-500 via-brand-400 to-accent-500"
                animate={{ width: `${Math.round(progress * 100)}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          <div className="text-xs text-ink-500 hidden sm:block">
            Bước {Math.min(stepIndex + 1, lesson.steps.length)}/{lesson.steps.length}
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 md:px-8 py-6 md:py-10">
        {!finished && (
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goBack}
              disabled={stepIndex === 0}
              className="btn-ghost text-sm disabled:opacity-30"
            >
              <ChevronLeft size={16} /> Quay lại
            </button>
            <div className="text-xs text-ink-400">
              Bước {stepIndex + 1} / {lesson.steps.length}
            </div>
          </div>
        )}

        {!finished && (
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <StepView step={step} onComplete={complete} />
            </motion.div>
          </AnimatePresence>
        )}

        {finished && <FinishedCard lesson={lesson} onExit={onExit} />}
      </main>
    </div>
  );
}

// ── StepView dispatcher ──────────────────────────────────────────────────────

function StepView({ step, onComplete }: { step: Step; onComplete: () => void }) {
  switch (step.kind) {
    case "intro":
      return <IntroView step={step} onNext={onComplete} />;
    case "theory":
      return <TheoryView step={step} onNext={onComplete} />;
    case "classify":
      return <ClassifyView step={step} onNext={onComplete} />;
    case "true-false":
      return <TrueFalseView step={step} onNext={onComplete} />;
    case "pick-symbol":
      return <PickSymbolView step={step} onNext={onComplete} />;
    case "free-answer":
      return <FreeAnswerView step={step} onNext={onComplete} />;
    case "multi-tick":
      return <MultiTickView step={step} onNext={onComplete} />;
    case "interval-match":
      return <IntervalMatchView step={step} onNext={onComplete} />;
    case "word-problem":
      return <WordProblemView step={step} onNext={onComplete} />;
  }
}

// ── Reusable card frame ───────────────────────────────────────────────────────

function Card({
  title,
  badge,
  children,
}: {
  title?: string;
  badge?: { icon: React.ReactNode; text: string; cls: string };
  children: React.ReactNode;
}) {
  return (
    <div className="card-surface p-5 md:p-7 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 size-40 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 size-40 rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />
      <div className="relative">
        {badge && (
          <div className={"chip mb-2.5 " + badge.cls}>
            {badge.icon} {badge.text}
          </div>
        )}
        {title && (
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink-900">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}

// ── Intro ─────────────────────────────────────────────────────────────────────

function IntroView({
  step,
  onNext,
}: {
  step: Extract<Step, { kind: "intro" }>;
  onNext: () => void;
}) {
  return (
    <Card
      title={step.title}
      badge={{
        icon: <Lightbulb size={14} />,
        text: "Giới thiệu",
        cls: "bg-accent-500/10 text-accent-600",
      }}
    >
      <p className="mt-3 text-ink-700 text-base leading-relaxed">{step.body}</p>
      {step.bullets && (
        <ul className="mt-4 space-y-1.5 text-ink-700 text-sm md:text-base">
          {step.bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-brand-600 font-bold">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex justify-end">
        <button onClick={onNext} className="btn-accent">
          Tiếp tục <ArrowRight size={16} />
        </button>
      </div>
    </Card>
  );
}

// ── Theory ────────────────────────────────────────────────────────────────────

function TheoryView({
  step,
  onNext,
}: {
  step: Extract<Step, { kind: "theory" }>;
  onNext: () => void;
}) {
  return (
    <Card
      title={step.title}
      badge={{
        icon: <BookOpen size={14} />,
        text: "Lý thuyết",
        cls: "bg-brand-500/10 text-brand-700",
      }}
    >
      <p className="mt-3 text-ink-700 text-base leading-relaxed">{step.body}</p>
      {step.formula && (
        <div className="mt-3 px-3 py-2.5 rounded-lg bg-white border border-brand-200 font-mono text-base text-ink-900 inline-block">
          {step.formula}
        </div>
      )}
      {step.bullets && (
        <ul className="mt-3 space-y-1.5 text-ink-700 text-sm md:text-base">
          {step.bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-brand-600 font-bold">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {step.note && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-accent-500/10 border border-accent-400/30 text-ink-700 text-sm">
          💡 {step.note}
        </div>
      )}
      <div className="mt-6 flex justify-end">
        <button onClick={onNext} className="btn-accent">
          Đã hiểu — tiếp tục <ArrowRight size={16} />
        </button>
      </div>
    </Card>
  );
}

// ── Classify (Bài 1) — drag-and-drop into 4 image boxes ──────────────────────

type ClassifyStep_ = Extract<Step, { kind: "classify" }>;

function ClassifyView({
  step,
  onNext,
}: {
  step: ClassifyStep_;
  onNext: () => void;
}) {
  /** placements[charId] = set of bucket ids the card has been correctly placed in */
  const [placements, setPlacements] = useState<Record<string, Set<string>>>(() => {
    const o: Record<string, Set<string>> = {};
    step.items.forEach((it) => (o[it.id] = new Set()));
    return o;
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [shaking, setShaking] = useState<string | null>(null);
  const [popped, setPopped] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const hintTimer = useRef<number | null>(null);

  const sensors = useSensors(
    // Lower distance + immediate touch activation for snappier drag on large screens.
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 80, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  // Build an index of which characters need to go in each bucket (for layout).
  const cardsInBucket: Record<string, ClassifyStep_["items"]> = useMemo(() => {
    const o: Record<string, ClassifyStep_["items"]> = {};
    step.buckets.forEach((b) => (o[b.id] = []));
    step.items.forEach((it) => {
      Object.keys(placements).forEach(() => {});
      it.targets.forEach(() => {});
    });
    Object.entries(placements).forEach(([charId, set]) => {
      const it = step.items.find((i) => i.id === charId);
      if (!it) return;
      set.forEach((bId) => {
        if (o[bId]) o[bId].push(it);
      });
    });
    return o;
  }, [placements, step.items, step.buckets]);

  // Dock items: characters that still need to be placed in at least one bucket.
  const dockItems = step.items.filter((it) => {
    const remaining = it.targets.length - placements[it.id].size;
    return remaining > 0;
  });
  // "None" characters — always shown in the dock as non-draggable info chips so
  // the student can see them and recognise they don't belong to any group.
  const noneItems = step.items.filter((it) => it.targets.length === 0);

  // Completed once every placement-required character has been placed.
  // The student confirms the "none" characters implicitly by pressing Next.
  const completed = step.items.every(
    (it) => placements[it.id].size === it.targets.length,
  );

  function flashHint(msg: string) {
    setHint(msg);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => setHint(null), 2800);
  }

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
    setHint(null);
  }

  function handleDragEnd(e: DragEndEvent) {
    const cardId = String(e.active.id);
    setActiveId(null);
    const bucketId = e.over?.id ? String(e.over.id) : null;
    if (!bucketId) return;
    const item = step.items.find((it) => it.id === cardId);
    if (!item) return;

    const already = placements[cardId].has(bucketId);
    const isTarget = item.targets.includes(bucketId);

    if (isTarget && !already) {
      // Correct
      playSound("pass");
      setPlacements((p) => {
        const next = { ...p };
        const s = new Set(p[cardId]);
        s.add(bucketId);
        next[cardId] = s;
        return next;
      });
      setPopped(cardId);
      setTimeout(() => setPopped(null), 400);
      confetti({
        particleCount: 22,
        spread: 60,
        startVelocity: 28,
        origin: { y: 0.6 },
        scalar: 0.7,
      });
    } else {
      // Wrong
      playSound("fail");
      setShaking(cardId);
      setTimeout(() => setShaking(null), 500);
      setMistakes((m) => m + 1);
      const bucketLabel =
        step.buckets.find((b) => b.id === bucketId)?.label ?? bucketId;
      if (already) {
        flashHint(`"${item.text}" đã được đặt vào ${bucketLabel} rồi.`);
      } else {
        flashHint(
          item.hint ??
            `"${item.text}" không thuộc nhóm ${bucketLabel}. Thử nhóm khác xem!`,
        );
      }
    }
  }

  function reset() {
    const o: Record<string, Set<string>> = {};
    step.items.forEach((it) => (o[it.id] = new Set()));
    setPlacements(o);
    setMistakes(0);
  }

  return (
    <Card
      badge={{
        icon: <Check size={14} />,
        text: "Kéo thẻ vào các ô",
        cls: "bg-brand-500/10 text-brand-700",
      }}
    >
      <p className="font-display text-lg md:text-xl font-extrabold text-ink-900">
        {step.prompt}
      </p>
      <p className="mt-1 text-sm text-ink-500">
        Một nhân vật có thể thuộc nhiều ô — kéo cùng một thẻ vào tất cả các ô
        phù hợp. Nhân vật không thuộc nhóm nào sẽ để lại trong khay.
      </p>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* 4 image buckets */}
        <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {step.buckets.map((b) => (
            <BucketBox
              key={b.id}
              bucketId={b.id}
              label={b.label}
              description={b.description}
              image={b.image}
              cards={cardsInBucket[b.id]}
              popped={popped}
            />
          ))}
        </div>

        {/* Dock */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="text-sm font-semibold text-ink-600 flex items-center gap-2">
              <Sparkles size={14} className="text-accent-500" />
              Khay nhân vật — kéo vào các ô phù hợp
            </div>
            <div className="text-xs text-ink-400">
              {dockItems.length} thẻ còn cần xếp
              {noneItems.length > 0 && (
                <>
                  {" · "}
                  <span className="text-ink-500">
                    {noneItems.length} thẻ không thuộc nhóm nào
                  </span>
                </>
              )}
            </div>
          </div>
          <div
            className="card-surface p-3 md:p-4 min-h-[110px]"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(236,238,245,0.85))",
            }}
          >
            <div className="flex flex-wrap gap-2 md:gap-2.5 justify-center">
              <AnimatePresence>
                {dockItems.map((it) => {
                  const remaining = it.targets.length - placements[it.id].size;
                  return (
                    <ClassifyDraggable
                      key={it.id}
                      id={it.id}
                      text={it.text}
                      remaining={remaining}
                      total={it.targets.length}
                      shaking={shaking === it.id}
                    />
                  );
                })}
                {/* Non-draggable info chips for characters that belong to no group. */}
                {noneItems.map((it) => (
                  <NoneChip key={it.id} text={it.text} />
                ))}
              </AnimatePresence>
              {dockItems.length === 0 && noneItems.length === 0 && (
                <div className="text-sm text-ink-400 py-4">
                  ✨ Khay trống!
                </div>
              )}
            </div>
            {noneItems.length > 0 && (
              <p className="mt-3 text-[11px] text-ink-500 text-center italic">
                💡 Các thẻ mờ ở trên không thuộc bất kì ô A/B/C/D nào — bấm
                "Tiếp tục" để xác nhận.
              </p>
            )}
          </div>
        </div>

        {/* Portal to document.body — escapes the card-surface backdrop-filter
             containing block so DragOverlay's position:fixed is relative to
             the viewport, not the card. */}
        {createPortal(
          <DragOverlay dropAnimation={null}>
            {activeId
              ? (() => {
                  const it = step.items.find((i) => i.id === activeId);
                  if (!it) return null;
                  return (
                    <div className="rounded-xl border border-ink-200 bg-white px-3 py-1.5 font-semibold shadow-glow text-ink-900 text-sm">
                      {it.text}
                    </div>
                  );
                })()
              : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>

      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 rounded-xl bg-accent-500/95 text-white text-sm px-3 py-2 shadow-glow flex items-start gap-2"
          >
            <Lightbulb size={16} className="shrink-0 mt-0.5" />
            <span>{hint}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex items-center justify-between gap-2">
        <div className="text-xs text-ink-500">
          Số lần đặt sai: <b className="text-rose-500">{mistakes}</b>
        </div>
        <div className="flex gap-2">
          {mistakes > 0 && !completed && (
            <button onClick={reset} className="btn-ghost text-sm">
              <RefreshCw size={14} /> Làm lại
            </button>
          )}
          {completed && (
            <button
              onClick={() => {
                playSound("tada");
                confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
                onNext();
              }}
              className="btn-accent"
            >
              Tiếp tục <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

function BucketBox({
  bucketId,
  label,
  description,
  image,
  cards,
  popped,
}: {
  bucketId: string;
  label: string;
  description?: string;
  image?: string;
  cards: ClassifyStep_["items"];
  popped: string | null;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: bucketId });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-2xl border-2 overflow-hidden flex flex-col bg-white transition shadow-soft",
        isOver
          ? "border-brand-500 ring-2 ring-brand-500/40 bg-brand-50/40"
          : "border-ink-200",
      )}
    >
      {image && (
        <div className="aspect-[16/9] bg-ink-50 overflow-hidden relative">
          <img src={asset(image)} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 px-2 py-1 bg-gradient-to-t from-black/70 to-transparent text-white text-xs font-bold">
            {label}
          </div>
        </div>
      )}
      <div className="p-2 flex-1 flex flex-col">
        {!image && <div className="font-bold text-ink-900 text-sm">{label}</div>}
        {description && (
          <div className="text-[11px] text-ink-500 leading-snug">
            {description}
          </div>
        )}
        <div className="mt-2 flex flex-wrap gap-1 min-h-[36px]">
          <AnimatePresence>
            {cards.map((c) => (
              <motion.span
                key={c.id}
                layout
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className={cn(
                  "inline-flex items-center rounded-full bg-mint-500/15 border border-mint-500/40 text-mint-500 px-2 py-0.5 text-[11px] font-semibold",
                  popped === c.id && "animate-pop-in",
                )}
              >
                {c.text}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** Non-draggable chip shown in the dock for characters that don't belong to any
 *  group — visual reminder that some items are intentionally not placed. */
function NoneChip({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 0.55, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.15 }}
      className="rounded-2xl border border-dashed border-ink-300 bg-ink-50 text-ink-500 px-3 py-1.5 text-sm font-medium select-none italic"
      style={{ userSelect: "none" }}
    >
      {text}
    </motion.div>
  );
}

function ClassifyDraggable({
  id,
  text,
  remaining,
  total,
  shaking,
}: {
  id: string;
  text: string;
  remaining: number;
  total: number;
  shaking: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });
  // Separate layers: outer motion wrapper handles enter/exit only, inner div is
  // the actual draggable so @dnd-kit transforms don't fight with framer-motion.
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.15 }}
    >
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{ touchAction: "none", userSelect: "none" }}
        className={cn(
          "rounded-2xl border bg-white text-ink-900 font-semibold shadow-soft transition-all",
          "flex items-center gap-2 px-3 py-1.5 text-sm cursor-grab active:cursor-grabbing",
          "border-ink-200 hover:-translate-y-0.5 hover:shadow-glow",
          isDragging && "opacity-50",
          shaking && "animate-shake border-rose-500",
        )}
      >
        <span>{text}</span>
        {total > 1 && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-700">
            {total - remaining}/{total}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ── True/False ────────────────────────────────────────────────────────────────

function TrueFalseView({
  step,
  onNext,
}: {
  step: Extract<Step, { kind: "true-false" }>;
  onNext: () => void;
}) {
  const [picks, setPicks] = useState<Record<string, boolean | null>>(() => {
    const o: Record<string, boolean | null> = {};
    step.statements.forEach((s) => (o[s.id] = null));
    return o;
  });
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = step.statements.every((s) => picks[s.id] !== null);
  const allOk =
    submitted && step.statements.every((s) => picks[s.id] === s.answer);

  function check() {
    setSubmitted(true);
    if (step.statements.every((s) => picks[s.id] === s.answer)) {
      playSound("pass");
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } else playSound("fail");
  }

  return (
    <Card
      badge={{
        icon: <Check size={14} />,
        text: "Đúng / Sai",
        cls: "bg-accent-500/10 text-accent-600",
      }}
    >
      <p className="font-display text-lg md:text-xl font-extrabold text-ink-900">
        {step.prompt}
      </p>

      <div className="mt-4 space-y-2.5">
        {step.statements.map((s) => {
          const pick = picks[s.id];
          const ok = submitted && pick === s.answer;
          const wrong = submitted && pick !== null && pick !== s.answer;
          return (
            <div
              key={s.id}
              className={
                "rounded-xl border p-3.5 transition " +
                (ok
                  ? "border-mint-500/50 bg-mint-500/5"
                  : wrong
                    ? "border-rose-500/50 bg-rose-500/5"
                    : "border-ink-200 bg-white")
              }
            >
              <div className="flex items-start gap-3">
                <p className="flex-1 text-ink-800">{s.text}</p>
                <div className="flex gap-1.5 shrink-0">
                  {[
                    { label: "Đúng", val: true },
                    { label: "Sai", val: false },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() =>
                        !submitted &&
                        setPicks((p) => ({ ...p, [s.id]: opt.val }))
                      }
                      disabled={submitted}
                      className={
                        "px-3 py-1.5 rounded-lg text-sm font-semibold border transition " +
                        (pick === opt.val
                          ? "bg-brand-500 text-white border-brand-500"
                          : "bg-white text-ink-700 border-ink-200 hover:border-brand-400")
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {submitted && s.explain && (
                <p
                  className={
                    "mt-2 text-xs " + (ok ? "text-mint-500" : "text-rose-500")
                  }
                >
                  {s.explain}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        {!submitted && (
          <button
            onClick={check}
            disabled={!allAnswered}
            className="btn-accent disabled:opacity-50"
          >
            Kiểm tra <Check size={16} />
          </button>
        )}
        {submitted && !allOk && (
          <button
            onClick={() => {
              setSubmitted(false);
              const o: Record<string, boolean | null> = {};
              step.statements.forEach((s) => (o[s.id] = null));
              setPicks(o);
            }}
            className="btn-ghost"
          >
            <RefreshCw size={14} /> Làm lại
          </button>
        )}
        {submitted && allOk && (
          <button onClick={onNext} className="btn-accent">
            Tiếp tục <ArrowRight size={16} />
          </button>
        )}
      </div>
    </Card>
  );
}

// ── Pick symbol (∈ / ∉) ───────────────────────────────────────────────────────

function PickSymbolView({
  step,
  onNext,
}: {
  step: Extract<Step, { kind: "pick-symbol" }>;
  onNext: () => void;
}) {
  const [picks, setPicks] = useState<Record<string, 0 | 1 | null>>(() => {
    const o: Record<string, 0 | 1 | null> = {};
    step.rows.forEach((r) => (o[r.id] = null));
    return o;
  });
  const [submitted, setSubmitted] = useState(false);
  const allAnswered = step.rows.every((r) => picks[r.id] !== null);
  const allOk =
    submitted && step.rows.every((r) => picks[r.id] === r.answer);

  function check() {
    setSubmitted(true);
    if (step.rows.every((r) => picks[r.id] === r.answer))
      playSound("pass");
    else playSound("fail");
  }

  return (
    <Card
      badge={{
        icon: <Check size={14} />,
        text: "Chọn kí hiệu",
        cls: "bg-brand-500/10 text-brand-700",
      }}
    >
      <p className="font-display text-lg md:text-xl font-extrabold text-ink-900">
        {step.prompt}
      </p>

      <div className="mt-4 space-y-2">
        {step.rows.map((r) => {
          const pick = picks[r.id];
          const ok = submitted && pick === r.answer;
          const wrong = submitted && pick !== null && pick !== r.answer;
          return (
            <div
              key={r.id}
              className={
                "rounded-xl border p-3 flex items-center gap-2 transition " +
                (ok
                  ? "border-mint-500/50 bg-mint-500/5"
                  : wrong
                    ? "border-rose-500/50 bg-rose-500/5"
                    : "border-ink-200 bg-white")
              }
            >
              <span className="font-semibold text-ink-900 min-w-[6rem]">{r.left}</span>
              <div className="flex gap-1.5">
                {step.options.map((sym, i) => (
                  <button
                    key={sym}
                    onClick={() =>
                      !submitted &&
                      setPicks((p) => ({ ...p, [r.id]: i as 0 | 1 }))
                    }
                    disabled={submitted}
                    className={
                      "size-9 rounded-lg text-base font-bold border transition " +
                      (pick === i
                        ? "bg-brand-500 text-white border-brand-500"
                        : "bg-white text-ink-700 border-ink-200 hover:border-brand-400")
                    }
                  >
                    {sym}
                  </button>
                ))}
              </div>
              <span className="font-semibold text-ink-900">{r.right}</span>
              <div className="ml-auto">
                {ok && <Check className="text-mint-500" size={18} />}
                {wrong && <X className="text-rose-500" size={18} />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        {!submitted && (
          <button
            onClick={check}
            disabled={!allAnswered}
            className="btn-accent disabled:opacity-50"
          >
            Kiểm tra <Check size={16} />
          </button>
        )}
        {submitted && !allOk && (
          <button
            onClick={() => {
              setSubmitted(false);
              const o: Record<string, 0 | 1 | null> = {};
              step.rows.forEach((r) => (o[r.id] = null));
              setPicks(o);
            }}
            className="btn-ghost"
          >
            <RefreshCw size={14} /> Làm lại
          </button>
        )}
        {submitted && allOk && (
          <button onClick={onNext} className="btn-accent">
            Tiếp tục <ArrowRight size={16} />
          </button>
        )}
      </div>
    </Card>
  );
}

// ── Free answer ───────────────────────────────────────────────────────────────

function parseTokens(raw: string): (string | number)[] {
  return raw
    .replace(/[{}\[\]]/g, "")
    .split(/[,;\n]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => {
      const n = Number(t);
      return Number.isFinite(n) && t !== "" ? n : t.toLowerCase();
    });
}

function sameSet(a: (string | number)[], b: (string | number)[]) {
  if (a.length !== b.length) return false;
  const sa = [...a].map(String).sort();
  const sb = [...b].map(String).sort();
  return sa.every((v, i) => v === sb[i]);
}

function FreeAnswerView({
  step,
  onNext,
}: {
  step: Extract<Step, { kind: "free-answer" }>;
  onNext: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  function check() {
    const r: Record<string, boolean> = {};
    let allOk = true;
    for (const f of step.fields) {
      const v = parseTokens(values[f.key] ?? "");
      const ok = f.answers.some((ans) =>
        f.single ? v.length === 1 && String(v[0]) === String(ans[0]) : sameSet(v, ans),
      );
      r[f.key] = ok;
      if (!ok) allOk = false;
    }
    setResults(r);
    setSubmitted(true);
    if (allOk) {
      playSound("pass");
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } else playSound("fail");
  }

  const allOk = submitted && step.fields.every((f) => results[f.key]);

  return (
    <Card
      badge={{
        icon: <Check size={14} />,
        text: "Điền kết quả",
        cls: "bg-accent-500/10 text-accent-600",
      }}
    >
      <p className="font-display text-lg md:text-xl font-extrabold text-ink-900">
        {step.prompt}
      </p>

      <div className="mt-4 space-y-3">
        {step.fields.map((f) => {
          const ok = results[f.key];
          return (
            <div key={f.key}>
              <label className="text-sm font-semibold text-ink-700">{f.label}</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  value={values[f.key] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                  placeholder={f.placeholder}
                  disabled={submitted && ok}
                  className={
                    "flex-1 rounded-xl border px-3 py-2 text-sm md:text-base font-mono outline-none transition " +
                    (submitted
                      ? ok
                        ? "border-mint-500 bg-mint-500/10"
                        : "border-rose-500 bg-rose-500/5"
                      : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20")
                  }
                />
                {submitted &&
                  (ok ? (
                    <Check className="text-mint-500" size={18} />
                  ) : (
                    <X className="text-rose-500" size={18} />
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        {!submitted && (
          <button onClick={check} className="btn-accent">
            Kiểm tra <Check size={16} />
          </button>
        )}
        {submitted && !allOk && (
          <button
            onClick={() => {
              setSubmitted(false);
              setResults({});
            }}
            className="btn-ghost"
          >
            <RefreshCw size={14} /> Sửa lại
          </button>
        )}
        {submitted && allOk && (
          <button onClick={onNext} className="btn-accent">
            Tiếp tục <ArrowRight size={16} />
          </button>
        )}
      </div>
    </Card>
  );
}

// ── Multi tick ────────────────────────────────────────────────────────────────

function MultiTickView({
  step,
  onNext,
}: {
  step: Extract<Step, { kind: "multi-tick" }>;
  onNext: () => void;
}) {
  const [ticked, setTicked] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  function toggle(id: string) {
    if (submitted) return;
    setTicked((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function check() {
    setSubmitted(true);
    const ok = step.options.every(
      (o) => ticked.has(o.id) === o.correct,
    );
    if (ok) {
      playSound("pass");
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } else playSound("fail");
  }

  const allOk =
    submitted && step.options.every((o) => ticked.has(o.id) === o.correct);

  return (
    <Card
      badge={{
        icon: <Check size={14} />,
        text: "Chọn nhiều",
        cls: "bg-mint-500/10 text-mint-500",
      }}
    >
      <p className="font-display text-lg md:text-xl font-extrabold text-ink-900">
        {step.prompt}
      </p>

      <div className="mt-4 space-y-2">
        {step.options.map((o) => {
          const on = ticked.has(o.id);
          const correctness = submitted ? on === o.correct : null;
          return (
            <button
              key={o.id}
              onClick={() => toggle(o.id)}
              disabled={submitted}
              className={
                "w-full text-left rounded-xl border p-3 flex items-center gap-3 transition " +
                (correctness === true
                  ? "border-mint-500/60 bg-mint-500/5"
                  : correctness === false
                    ? "border-rose-500/60 bg-rose-500/5"
                    : on
                      ? "border-brand-500 bg-brand-500/5"
                      : "border-ink-200 bg-white hover:border-brand-400")
              }
            >
              <span
                className={
                  "size-6 rounded-md border flex items-center justify-center " +
                  (on ? "bg-brand-500 border-brand-500 text-white" : "border-ink-300")
                }
              >
                {on && <Check size={14} />}
              </span>
              <span className="text-ink-800">{o.text}</span>
            </button>
          );
        })}
      </div>

      {submitted && step.explanation && (
        <p className="mt-3 text-sm text-ink-600 italic">{step.explanation}</p>
      )}

      <div className="mt-5 flex justify-end gap-2">
        {!submitted && (
          <button onClick={check} className="btn-accent">
            Kiểm tra <Check size={16} />
          </button>
        )}
        {submitted && !allOk && (
          <button
            onClick={() => {
              setSubmitted(false);
              setTicked(new Set());
            }}
            className="btn-ghost"
          >
            <RefreshCw size={14} /> Làm lại
          </button>
        )}
        {submitted && allOk && (
          <button onClick={onNext} className="btn-accent">
            Tiếp tục <ArrowRight size={16} />
          </button>
        )}
      </div>
    </Card>
  );
}

// ── Interval match ────────────────────────────────────────────────────────────

function IntervalMatchView({
  step,
  onNext,
}: {
  step: Extract<Step, { kind: "interval-match" }>;
  onNext: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  function normalize(s: string): string {
    return s.replace(/\s+/g, "").replace(/vc/gi, "∞");
  }

  function check() {
    const r: Record<string, boolean> = {};
    let allOk = true;
    for (const row of step.rows) {
      const got = normalize(values[row.id] ?? "");
      const ok = row.answers.some((a) => normalize(a) === got);
      r[row.id] = ok;
      if (!ok) allOk = false;
    }
    setResults(r);
    setSubmitted(true);
    if (allOk) {
      playSound("pass");
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } else playSound("fail");
  }

  const allOk = submitted && step.rows.every((r) => results[r.id]);

  return (
    <Card
      badge={{
        icon: <Check size={14} />,
        text: "Viết khoảng / đoạn",
        cls: "bg-accent-500/10 text-accent-600",
      }}
    >
      <p className="font-display text-lg md:text-xl font-extrabold text-ink-900">
        {step.prompt}
      </p>

      <div className="mt-4 space-y-3">
        {step.rows.map((row) => {
          const ok = results[row.id];
          return (
            <div key={row.id} className="rounded-xl border border-ink-200 bg-white p-3">
              <div className="text-sm text-ink-600 mb-1.5 font-mono">
                {row.description}
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={values[row.id] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [row.id]: e.target.value }))
                  }
                  placeholder="vd: (2;5)"
                  disabled={submitted && ok}
                  className={
                    "flex-1 rounded-lg border px-3 py-1.5 font-mono text-sm md:text-base outline-none transition " +
                    (submitted
                      ? ok
                        ? "border-mint-500 bg-mint-500/10"
                        : "border-rose-500 bg-rose-500/5"
                      : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20")
                  }
                />
                {submitted &&
                  (ok ? (
                    <Check className="text-mint-500" size={18} />
                  ) : (
                    <X className="text-rose-500" size={18} />
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        {!submitted && (
          <button onClick={check} className="btn-accent">
            Kiểm tra <Check size={16} />
          </button>
        )}
        {submitted && !allOk && (
          <button
            onClick={() => {
              setSubmitted(false);
              setResults({});
            }}
            className="btn-ghost"
          >
            <RefreshCw size={14} /> Sửa lại
          </button>
        )}
        {submitted && allOk && (
          <button onClick={onNext} className="btn-accent">
            Tiếp tục <ArrowRight size={16} />
          </button>
        )}
      </div>
    </Card>
  );
}

// ── Word problem ──────────────────────────────────────────────────────────────

function WordProblemView({
  step,
  onNext,
}: {
  step: Extract<Step, { kind: "word-problem" }>;
  onNext: () => void;
}) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const numeric = Number(value);
  const ok = submitted && numeric === step.answer;

  function check() {
    setSubmitted(true);
    if (Number(value) === step.answer) {
      playSound("pass");
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    } else playSound("fail");
  }

  return (
    <Card
      badge={{
        icon: <Lightbulb size={14} />,
        text: "Bài toán vận dụng",
        cls: "bg-brand-500/10 text-brand-700",
      }}
    >
      <p className="font-display text-lg md:text-xl font-extrabold text-ink-900">
        {step.prompt}
      </p>
      <p className="mt-3 text-ink-700 leading-relaxed">{step.setup}</p>

      <div className="mt-4 rounded-xl border border-ink-200 bg-white p-3.5">
        <label className="text-sm font-semibold text-ink-700">
          Số bạn tham gia cả hai môn (x) = ?
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={submitted && ok}
            className={
              "flex-1 rounded-lg border px-3 py-2 font-mono outline-none transition " +
              (submitted
                ? ok
                  ? "border-mint-500 bg-mint-500/10"
                  : "border-rose-500 bg-rose-500/5"
                : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20")
            }
            placeholder="vd: 3"
          />
          {step.unit && <span className="text-ink-500 text-sm">{step.unit}</span>}
          {submitted &&
            (ok ? (
              <Check className="text-mint-500" size={18} />
            ) : (
              <X className="text-rose-500" size={18} />
            ))}
        </div>
      </div>

      {showSolution && (
        <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50/60 p-3.5">
          <div className="text-xs font-bold text-brand-700 uppercase tracking-wide mb-1">
            Lời giải
          </div>
          <p className="text-ink-700 text-sm leading-relaxed">{step.solution}</p>
        </div>
      )}

      <div className="mt-5 flex justify-between gap-2">
        <button
          onClick={() => setShowSolution((v) => !v)}
          className="btn-ghost text-xs"
        >
          {showSolution ? "Ẩn lời giải" : "Xem lời giải"}
        </button>

        <div className="flex gap-2">
          {!submitted && (
            <button onClick={check} className="btn-accent">
              Kiểm tra <Check size={16} />
            </button>
          )}
          {submitted && !ok && (
            <button
              onClick={() => {
                setSubmitted(false);
                setValue("");
              }}
              className="btn-ghost"
            >
              <RefreshCw size={14} /> Thử lại
            </button>
          )}
          {submitted && ok && (
            <button onClick={onNext} className="btn-accent">
              Tiếp tục <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

// ── Finished ──────────────────────────────────────────────────────────────────

function FinishedCard({
  lesson,
  onExit,
}: {
  lesson: Lesson;
  onExit: () => void;
}) {
  useEffect(() => {
    confetti({ particleCount: 160, spread: 110, origin: { y: 0.45 } });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-surface p-6 md:p-8 text-center relative overflow-hidden"
    >
      <div className="absolute -top-12 -right-12 size-40 rounded-full bg-accent-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 size-40 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
      <div className="relative">
        <div className="mx-auto size-16 rounded-2xl bg-gradient-to-br from-accent-500 to-brand-600 text-white grid place-items-center shadow-glow">
          <Trophy size={28} />
        </div>
        <h2 className="mt-4 font-display text-3xl font-extrabold text-ink-900">
          Hoàn thành {lesson.number}!
        </h2>
        <p className="mt-2 text-ink-600">
          Bạn đã đi hết {lesson.steps.length} bước của bài "{lesson.title}". Hãy quay
          lại trang chủ để chọn bài tiếp theo.
        </p>
        <button onClick={onExit} className="btn-accent mt-6 mx-auto">
          <HomeIcon size={16} /> Về trang chủ
        </button>
      </div>
    </motion.div>
  );
}

