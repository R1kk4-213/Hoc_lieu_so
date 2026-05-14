import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import type { ZoneKey } from "../data/gameData";

type Props = {
  labelA: string;
  labelB: string;
  effect: "intersect" | "union" | "difference" | "math";
  completed: boolean;
  children: {
    A: ReactNode;
    AB: ReactNode;
    B: ReactNode;
  };
};

function Zone({
  id,
  className,
  children,
  hideOnDifference,
  completed,
  effect,
}: {
  id: ZoneKey;
  className: string;
  children: ReactNode;
  hideOnDifference?: boolean;
  completed: boolean;
  effect: Props["effect"];
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const dim =
    completed && effect === "difference" && hideOnDifference ? "opacity-20" : "";
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "absolute flex flex-wrap content-center justify-center gap-1.5 p-2 rounded-3xl transition",
        isOver && "ring-2 ring-brand-500/70 ring-offset-2 ring-offset-white bg-white/40",
        className,
        dim,
      )}
      data-zone={id}
    >
      {children}
    </div>
  );
}

// Geometry — enlarged so cards stay inside the circles
const VB_W = 880;
const VB_H = 520;
const CY = 260;
const R = 235;
const CX_A = 295;
const CX_B = 585;
const INTER_X = (CX_A + CX_B) / 2; // 440
const HALF_GAP = (CX_B - CX_A) / 2; // 145
const INTER_DY = Math.sqrt(R * R - HALF_GAP * HALF_GAP); // ≈ 185.0

export function Venn({ labelA, labelB, effect, completed, children }: Props) {
  const intersectGlow =
    completed && effect === "union"
      ? "drop-shadow(0 0 22px rgba(255,155,28,.55))"
      : "none";

  return (
    <div className="relative w-full max-w-[920px] mx-auto">
      {/* Label tags */}
      <div className="hidden sm:flex absolute -top-2 left-4 z-20">
        <span className="chip bg-brand-500/10 text-brand-700 border border-brand-200">
          A · {labelA}
        </span>
      </div>
      <div className="hidden sm:flex absolute -top-2 right-4 z-20">
        <span className="chip bg-accent-500/10 text-accent-600 border border-accent-400/40">
          B · {labelB}
        </span>
      </div>

      <div className="relative w-full" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
        <motion.svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="absolute inset-0 w-full h-full"
          style={{ filter: intersectGlow }}
          aria-hidden
        >
          <defs>
            <radialGradient id="gradA" cx="35%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#94b1ff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#4763ff" stopOpacity="0.55" />
            </radialGradient>
            <radialGradient id="gradB" cx="65%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#ffb547" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#f37e00" stopOpacity="0.55" />
            </radialGradient>
            <clipPath id="vennClipA">
              <circle cx={CX_A} cy={CY} r={R} />
            </clipPath>
          </defs>
          <motion.circle
            cx={CX_A}
            cy={CY}
            r={R}
            fill="url(#gradA)"
            style={{ mixBlendMode: "multiply" }}
            animate={{ opacity: completed && effect === "difference" ? 1 : 0.85 }}
          />
          <motion.circle
            cx={CX_B}
            cy={CY}
            r={R}
            fill="url(#gradB)"
            style={{ mixBlendMode: "multiply" }}
            animate={{ opacity: completed && effect === "difference" ? 0.1 : 0.85 }}
            transition={{ duration: 0.6 }}
          />

          {/* Intersection lens highlight — shown when intersect level is completed */}
          {completed && effect === "intersect" && (
            <motion.g
              clipPath="url(#vennClipA)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <circle cx={CX_B} cy={CY} r={R} fill="#ef4444" fillOpacity="0.55" />
            </motion.g>
          )}

          {/* Outlines */}
          <circle cx={CX_A} cy={CY} r={R} fill="none" stroke="#2f43eb" strokeOpacity="0.4" strokeWidth="2.5" />
          <circle cx={CX_B} cy={CY} r={R} fill="none" stroke="#f37e00" strokeOpacity="0.4" strokeWidth="2.5" />

          {/* Intersection arc outline emphasized when intersect-complete */}
          {completed && effect === "intersect" && (
            <>
              <path
                d={`M ${INTER_X} ${CY - INTER_DY} A ${R} ${R} 0 0 1 ${INTER_X} ${CY + INTER_DY} A ${R} ${R} 0 0 1 ${INTER_X} ${CY - INTER_DY} Z`}
                fill="none"
                stroke="#b91c1c"
                strokeWidth="2.5"
              />
              <text
                x={INTER_X}
                y={CY - INTER_DY - 12}
                fontSize="22"
                textAnchor="middle"
                fontWeight="800"
                fill="#b91c1c"
              >
                A ∩ B
              </text>
            </>
          )}
        </motion.svg>

        {/* Drop zones — sized in % of the SVG viewport, kept inside circle bounds */}
        <div className="absolute inset-0">
          {/* Only-A region */}
          <Zone
            id="A"
            completed={completed}
            effect={effect}
            className="top-[14%] left-[7%] w-[30%] h-[72%]"
          >
            {children.A}
          </Zone>
          {/* A∩B region — wider so 2-3 cards stack comfortably inside the lens */}
          <Zone
            id="AB"
            completed={completed}
            effect={effect}
            className="top-[18%] left-1/2 -translate-x-1/2 w-[18%] h-[64%]"
            hideOnDifference
          >
            {children.AB}
          </Zone>
          {/* Only-B region */}
          <Zone
            id="B"
            completed={completed}
            effect={effect}
            className="top-[14%] right-[7%] w-[30%] h-[72%]"
            hideOnDifference
          >
            {children.B}
          </Zone>
        </div>

        {/* Mobile labels */}
        <div className="sm:hidden absolute -bottom-2 inset-x-0 flex justify-between px-4 text-[11px] font-semibold">
          <span className="text-brand-700">A · {labelA}</span>
          <span className="text-accent-600">B · {labelB}</span>
        </div>
      </div>
    </div>
  );
}
