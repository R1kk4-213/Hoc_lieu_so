import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Search, Eye } from "lucide-react";
import type { DiscoveryQuestion as DQ } from "../data/gameData";

type Props = {
  open: boolean;
  question: DQ | null;
  onPass: () => void;
};

/** Normalize one text answer for comparison: lowercase, strip diacritics, collapse spaces. */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitList(raw: string): string[] {
  return raw
    .split(/[,;\n]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function matches(input: string, answers: string[][]): boolean {
  const got = splitList(input).map(norm).filter(Boolean);
  if (got.length === 0) return false;
  return answers.some((ans) => {
    const want = ans.map(norm);
    if (got.length !== want.length) return false;
    const a = [...got].sort();
    const b = [...want].sort();
    return a.every((v, i) => v === b[i]);
  });
}

export function DiscoveryQuestion({ open, question, onPass }: Props) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong" | "right">("idle");
  const [revealed, setRevealed] = useState(false);

  if (!question) return null;

  function check() {
    if (matches(value, question!.answers)) {
      setStatus("right");
      setTimeout(onPass, 450);
    } else {
      setStatus("wrong");
    }
  }

  function reveal() {
    setRevealed(true);
    setValue(question!.answers[0].join(", "));
    setStatus("idle");
  }

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
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="card-surface w-full max-w-xl p-5 md:p-6 relative overflow-hidden pointer-events-auto max-h-[68vh] overflow-y-auto"
          >
            <div className="absolute -top-10 -right-10 size-32 rounded-full bg-brand-500/15 blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="chip bg-brand-500/10 text-brand-700">
                <Search size={14} /> Câu hỏi khám phá
              </div>

              <p className="mt-3 text-ink-800 text-[15px] md:text-base leading-relaxed font-medium">
                {question.prompt}
              </p>

              <p className="mt-3 text-xs text-ink-500">
                Nhập các phần tử, cách nhau bởi dấu phẩy. Không phân biệt thứ tự.
              </p>

              <div className="mt-2">
                <label className="text-sm font-semibold text-ink-700">
                  {question.fieldLabel}
                </label>
                <textarea
                  rows={2}
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  placeholder={question.placeholder}
                  className={
                    "mt-1 w-full rounded-xl border px-3 py-2 text-sm md:text-base outline-none transition resize-none " +
                    (status === "right"
                      ? "border-mint-500 bg-mint-500/10"
                      : status === "wrong"
                        ? "border-rose-500 bg-rose-500/5"
                        : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20")
                  }
                />
                {status === "wrong" && (
                  <p className="mt-1 text-xs text-rose-500">
                    Chưa đúng — thử nhìn lại các thẻ bạn vừa đặt ở vùng tương ứng nhé!
                  </p>
                )}
                {revealed && question.revealNote && (
                  <p className="mt-1 text-xs text-brand-700">{question.revealNote}</p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <button onClick={reveal} className="btn-ghost text-xs">
                  <Eye size={14} /> Xem đáp án
                </button>
                <button onClick={check} className="btn-accent">
                  {status === "right" ? (
                    <>
                      Đúng rồi! <Check size={16} />
                    </>
                  ) : (
                    <>
                      Kiểm tra <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
