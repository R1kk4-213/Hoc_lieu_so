import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, RotateCcw, Home as HomeIcon } from "lucide-react";

import { Header } from "./components/Header";
import { Home, type ChapterId } from "./components/Home";
import { LessonRunner } from "./components/LessonRunner";
import { Venn } from "./components/Venn";
import { DraggableCard } from "./components/DraggableCard";
import { Modal } from "./components/Modal";
import { HintToast } from "./components/HintToast";
import { ProblemPanel } from "./components/ProblemPanel";
import { ResultPopup } from "./components/ResultPopup";
import { FillInChallenge } from "./components/FillInChallenge";
import { DiscoveryQuestion } from "./components/DiscoveryQuestion";
import {
  gameData,
  MAX_HINTS_PER_LEVEL,
  MAX_MISTAKES_PER_LEVEL,
  type CardItem,
  type ZoneKey,
} from "./data/gameData";
import { isMuted, playSound, setMuted, unlockAudio } from "./lib/audio";

type Screen = "home" | "operations" | "lesson";

type Placement = Record<string, ZoneKey | null>;

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [lessonId, setLessonId] = useState<"bai1" | "bai2" | "bai3" | "bai4" | "bai5" | "bai7">(
    "bai1",
  );
  const [levelIndex, setLevelIndex] = useState(0);
  const [placements, setPlacements] = useState<Placement>({});
  const [shaking, setShaking] = useState<string | null>(null);
  const [popped, setPopped] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [combo, setCombo] = useState(0);
  const [muted, setMutedState] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showFillIn, setShowFillIn] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [showHomeConfirm, setShowHomeConfirm] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [fillInDone, setFillInDone] = useState(false);
  const [discoveryDone, setDiscoveryDone] = useState(false);
  const hintTimer = useRef<number | null>(null);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const sensors = useSensors(
    // Low activation distance makes pickup feel instant on desktop;
    // short touch delay keeps mobile snappy without false-positive scrolls.
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 80, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const level = gameData[levelIndex];
  const isMathLevel = level.effect === "math";

  const shuffledItems = useMemo(() => {
    const items = [...level.items];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelIndex, shuffleSeed]);

  // Reset per-level state
  useEffect(() => {
    const initial: Placement = {};
    level.items.forEach((it) => (initial[it.id] = null));
    setPlacements(initial);
    setHintsUsed(0);
    setMistakes(0);
    setFillInDone(false);
    setDiscoveryDone(false);
    setShowResult(false);
    setShowFillIn(false);
    setShowDiscovery(false);
    setShowRetry(false);
    // Math-only levels (no drag): open fill-in straight away
    if (isMathLevel && level.fillIn) {
      const t = setTimeout(() => setShowFillIn(true), 350);
      return () => clearTimeout(t);
    }
  }, [levelIndex, level, shuffleSeed, isMathLevel]);

  const placedCount = Object.values(placements).filter(Boolean).length;
  const dragComplete =
    level.items.length > 0 && placedCount === level.items.length;

  const progress = useMemo(() => {
    const total = gameData.reduce((a, lv) => a + lv.items.length || 1, 0);
    const past = gameData.slice(0, levelIndex).reduce((a, lv) => a + (lv.items.length || 1), 0);
    const current = isMathLevel ? (fillInDone ? 1 : 0) : placedCount;
    return (past + current) / total;
  }, [levelIndex, placedCount, fillInDone, isMathLevel]);

  // Flow:
  //   • Math-only levels: fill-in → result.
  //   • Other levels: drag-complete → discovery popup → result.
  useEffect(() => {
    // Math-only path
    if (isMathLevel) {
      if (fillInDone && !showResult) {
        const t = setTimeout(() => {
          playSound("tada");
          setShowResult(true);
          confetti({
            particleCount: 120,
            spread: 90,
            startVelocity: 45,
            origin: { y: 0.6 },
            scalar: 0.9,
          });
        }, 350);
        return () => clearTimeout(t);
      }
      return;
    }

    // Drag-based path (Màn 1-3)
    if (!dragComplete) return;
    if (level.discovery && !discoveryDone && !showDiscovery) {
      const t = setTimeout(() => setShowDiscovery(true), 450);
      return () => clearTimeout(t);
    }
    const ready = level.discovery ? discoveryDone : true;
    if (ready && !showResult) {
      const t = setTimeout(() => {
        playSound("tada");
        setShowResult(true);
        confetti({
          particleCount: 120,
          spread: 90,
          startVelocity: 45,
          origin: { y: 0.6 },
          scalar: 0.9,
        });
      }, 350);
      return () => clearTimeout(t);
    }
  }, [
    isMathLevel,
    fillInDone,
    dragComplete,
    discoveryDone,
    showDiscovery,
    showResult,
    level.discovery,
  ]);

  function flashHint(item: CardItem) {
    if (hintsUsed >= MAX_HINTS_PER_LEVEL) {
      setHint(
        `Hết gợi ý cho màn này (đã dùng ${MAX_HINTS_PER_LEVEL}/${MAX_HINTS_PER_LEVEL}) — bạn tự suy luận nhé!`,
      );
    } else {
      setHint(item.hint);
      setHintsUsed((n) => n + 1);
    }
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
    const zone = e.over?.id ? (String(e.over.id) as ZoneKey) : null;
    const item = level.items.find((it) => it.id === cardId);
    if (!item || !zone) return;

    if (zone === item.target) {
      playSound("pass");
      setPlacements((p) => ({ ...p, [cardId]: zone }));
      setPopped(cardId);
      setTimeout(() => setPopped(null), 400);
      setCombo((c) => c + 1);
      confetti({
        particleCount: 24,
        spread: 60,
        startVelocity: 30,
        origin: { y: 0.55 },
        scalar: 0.7,
      });
    } else {
      playSound("fail");
      setCombo(0);
      setShaking(cardId);
      setTimeout(() => setShaking(null), 500);
      flashHint(item);
      const m = mistakes + 1;
      setMistakes(m);
      if (m >= MAX_MISTAKES_PER_LEVEL) {
        setTimeout(() => setShowRetry(true), 600);
      }
    }
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  }

  function startOperationsGame() {
    unlockAudio();
    setScreen("operations");
    setLevelIndex(0);
    setCombo(0);
    setShuffleSeed((s) => s + 1);
  }

  function pickChapter(id: ChapterId) {
    unlockAudio();
    if (id === "operations") {
      startOperationsGame();
    } else {
      setLessonId(id);
      setScreen("lesson");
    }
  }

  function nextLevel() {
    setShowResult(false);
    if (levelIndex + 1 < gameData.length) {
      setLevelIndex((i) => i + 1);
    } else {
      // Final level done → celebrate, then return to home
      [0, 200, 400].forEach((delay) =>
        setTimeout(
          () => confetti({ particleCount: 160, spread: 110, origin: { y: 0.4 } }),
          delay,
        ),
      );
      playSound("tada");
      setTimeout(() => goHome(), 800);
    }
  }

  function retryLevel() {
    setShowRetry(false);
    setShuffleSeed((s) => s + 1);
  }

  function goHome() {
    setShowHomeConfirm(false);
    setScreen("home");
    setLevelIndex(0);
    setCombo(0);
  }

  const zoneCards: Record<ZoneKey, CardItem[]> = { A: [], AB: [], B: [] };
  Object.entries(placements).forEach(([id, z]) => {
    if (!z) return;
    const it = level.items.find((i) => i.id === id);
    if (it) zoneCards[z].push(it);
  });

  const dockItems = shuffledItems.filter((it) => !placements[it.id]);

  useEffect(() => {
    setMuted(isMuted());
  }, []);

  const hintsLeft = Math.max(0, MAX_HINTS_PER_LEVEL - hintsUsed);
  const mistakesLeft = Math.max(0, MAX_MISTAKES_PER_LEVEL - mistakes);

  // ── Render ──
  if (screen === "home") {
    return (
      <div className="min-h-screen relative">
        <Backdrop />
        <Home onPick={pickChapter} />
      </div>
    );
  }

  if (screen === "lesson") {
    return (
      <div className="min-h-screen relative">
        <Backdrop />
        <LessonRunner lessonId={lessonId} onExit={goHome} />
      </div>
    );
  }

  // Operations game (Bài 6)
  return (
    <div className="min-h-screen flex flex-col relative">
      <Backdrop />

      <Header
        levelIndex={levelIndex}
        totalLevels={gameData.length}
        progress={progress}
        combo={combo}
        muted={muted}
        hintsLeft={hintsLeft}
        mistakesLeft={mistakesLeft}
        onToggleMute={toggleMute}
        onHelp={() => setShowHelp(true)}
        onHome={() => setShowHomeConfirm(true)}
      />

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4 md:mb-6">
              <div>
                <div className="chip bg-ink-100 text-ink-600">
                  Chủ đề · {level.topic}
                </div>
                <h2 className="mt-2 font-display text-3xl md:text-4xl font-extrabold text-ink-900 tracking-tight">
                  Màn {levelIndex + 1}: {level.title}
                </h2>
              </div>
              {!isMathLevel && (
                <div className="text-sm text-ink-500">
                  Đã đặt{" "}
                  <span className="font-bold text-ink-900">{placedCount}</span> /{" "}
                  {level.items.length} thẻ
                </div>
              )}
            </div>

            <ProblemPanel scenario={level.scenario} />

            {!isMathLevel && (
              <>
                {/* Venn stage */}
                <div
                  className="card-surface p-4 md:p-6 lg:p-8 relative overflow-hidden"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, rgba(71,99,255,0.06), rgba(255,155,28,0.04) 60%, rgba(34,201,147,0.05))",
                  }}
                >
                  <div className="absolute -top-10 right-10 size-40 rounded-full bg-brand-500/10 blur-2xl pointer-events-none" />
                  <div className="absolute bottom-0 -left-10 size-40 rounded-full bg-accent-500/10 blur-2xl pointer-events-none" />
                  <Venn
                    labelA={level.labelA}
                    labelB={level.labelB}
                    effect={level.effect}
                    completed={dragComplete}
                  >
                    {{
                      A: zoneCards.A.map((it) => (
                        <DraggableCard key={it.id} id={it.id} text={it.text} placed popped={popped === it.id} compact />
                      )),
                      AB: zoneCards.AB.map((it) => (
                        <DraggableCard key={it.id} id={it.id} text={it.text} placed popped={popped === it.id} compact />
                      )),
                      B: zoneCards.B.map((it) => (
                        <DraggableCard key={it.id} id={it.id} text={it.text} placed popped={popped === it.id} compact />
                      )),
                    }}
                  </Venn>
                </div>

                {/* Dock */}
                <div className="mt-5 md:mt-7">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="text-sm font-semibold text-ink-600 flex items-center gap-2">
                      <Sparkles size={14} className="text-accent-500" />
                      Khay thẻ — kéo vào đúng vùng
                    </div>
                    <div className="text-xs text-ink-400">{dockItems.length} thẻ còn lại</div>
                  </div>
                  <div
                    className="card-surface p-3 md:p-4 min-h-[110px]"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(236,238,245,0.85))",
                    }}
                  >
                    <div className="flex flex-wrap gap-2.5 md:gap-3 justify-center thin-scroll">
                      <AnimatePresence>
                        {dockItems.map((it) => (
                          <DraggableCard
                            key={it.id}
                            id={it.id}
                            text={it.text}
                            shaking={shaking === it.id}
                          />
                        ))}
                      </AnimatePresence>
                      {dockItems.length === 0 && (
                        <div className="text-sm text-ink-400 py-4">
                          ✨ Khay trống — chuyển sang câu hỏi khám phá!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {isMathLevel && (
              <div
                className="card-surface p-6 md:p-8 relative overflow-hidden"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(71,99,255,0.10), rgba(34,201,147,0.08) 50%, rgba(255,155,28,0.08))",
                }}
              >
                <div className="absolute -top-12 -right-12 size-48 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 size-48 rounded-full bg-accent-500/15 blur-3xl pointer-events-none" />
                <div className="relative text-center">
                  <div className="chip bg-brand-500/15 text-brand-700 mx-auto">
                    🧮 Thử thách điền kết quả
                  </div>
                  <p className="mt-3 text-ink-700 max-w-xl mx-auto leading-relaxed">
                    Đây là màn cuối — hãy điền các tập hợp D ∩ E, D ∪ E và D \ E
                    vào ô bên dưới. Mẹo: dùng tập định nghĩa D = {"{"}1, 2, 3, 4, 5{"}"}{" "}
                    và E = {"{"}3, 4, 5, 6, 7{"}"}.
                  </p>
                  {!showFillIn && !fillInDone && (
                    <button onClick={() => setShowFillIn(true)} className="btn-accent mt-5 mx-auto">
                      Mở câu hỏi <Sparkles size={16} />
                    </button>
                  )}
                  {fillInDone && (
                    <div className="mt-5 chip bg-mint-500/20 text-mint-500 mx-auto">
                      ✅ Đã làm xong — đang mở tổng kết...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {createPortal(
          <DragOverlay dropAnimation={null}>
            {activeId
              ? (() => {
                  const item = level.items.find((i) => i.id === activeId);
                  if (!item) return null;
                  return (
                    <div className="rounded-2xl border border-ink-200 bg-white px-3.5 py-2.5 font-semibold shadow-glow text-ink-900">
                      {item.text}
                    </div>
                  );
                })()
              : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>

      <HintToast hint={hint} />

      {/* Discovery question (Màn 1-3) */}
      <DiscoveryQuestion
        open={showDiscovery}
        question={level.discovery ?? null}
        onPass={() => {
          setShowDiscovery(false);
          setDiscoveryDone(true);
        }}
      />

      {/* Fill-in (Màn 4 only) */}
      <FillInChallenge
        open={showFillIn}
        group={level.fillIn ?? null}
        onPass={() => {
          setShowFillIn(false);
          setFillInDone(true);
        }}
      />

      <ResultPopup
        open={showResult}
        title={level.popupTitle}
        text={level.popupText}
        definition={level.definition}
        effect={level.effect}
        nextLabel={levelIndex + 1 < gameData.length ? "Sang màn tiếp theo" : "Nhận chứng chỉ"}
        onNext={nextLevel}
      />

      <Modal open={showHelp} onClose={() => setShowHelp(false)} title="Hướng dẫn nhanh">
        <ul className="space-y-2 text-ink-600 text-sm leading-relaxed">
          <li>• Kéo thẻ trong khay vào đúng vùng A, A∩B hoặc B trên sơ đồ Venn.</li>
          <li>• Sau khi xếp xong, một câu hỏi khám phá sẽ xuất hiện.</li>
          <li>• Tiếp theo, định nghĩa toán học chính thức được hiển thị.</li>
          <li>• Mỗi màn tối đa <b>{MAX_HINTS_PER_LEVEL} gợi ý</b>. Thả sai <b>{MAX_MISTAKES_PER_LEVEL} lần</b> phải làm lại màn.</li>
          <li>• Hoàn thành cả 4 màn để nhận chứng chỉ và về trang chủ.</li>
        </ul>
      </Modal>

      <Modal open={showRetry} closeable={false} title="Bạn đã thả sai quá nhiều lần">
        <p className="text-ink-600 leading-relaxed">
          Đừng nản — học sai mới nhớ lâu! Hãy chơi lại màn này từ đầu để chinh phục nhé.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={goHome} className="btn-ghost">
            <HomeIcon size={16} /> Về trang chủ
          </button>
          <button onClick={retryLevel} className="btn-accent">
            <RotateCcw size={16} /> Làm lại màn này
          </button>
        </div>
      </Modal>

      <Modal
        open={showHomeConfirm}
        onClose={() => setShowHomeConfirm(false)}
        title="Thoát về trang chủ?"
      >
        <p className="text-ink-600">
          Tiến trình màn hiện tại sẽ không được lưu. Bạn vẫn muốn về trang chủ?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={() => setShowHomeConfirm(false)} className="btn-ghost">
            Ở lại
          </button>
          <button onClick={goHome} className="btn-primary">
            <HomeIcon size={16} /> Về trang chủ
          </button>
        </div>
      </Modal>
    </div>
  );
}

function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-24 -left-24 size-[28rem] rounded-full bg-brand-400/15 blur-3xl" />
      <div className="absolute top-1/3 -right-24 size-[24rem] rounded-full bg-accent-400/15 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 size-[26rem] rounded-full bg-rose-500/10 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(17,20,42,0.06) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
    </div>
  );
}
