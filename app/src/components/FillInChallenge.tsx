import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowRight, Pencil } from "lucide-react";
import type { FillInGroup } from "../data/gameData";

type Props = {
  open: boolean;
  group: FillInGroup | null;
  onPass: () => void;
};

function parseTokens(raw: string): (string | number)[] {
  return raw
    .replace(/[{}\[\]]/g, "")
    .split(/[,;\s]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => {
      const n = Number(t);
      return Number.isFinite(n) && t !== "" ? n : t.toLowerCase();
    });
}

function sameSet(a: (string | number)[], b: (string | number)[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].map(String).sort();
  const sb = [...b].map(String).sort();
  return sa.every((v, i) => v === sb[i]);
}

export function FillInChallenge({ open, group, onPass }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [touched, setTouched] = useState(false);

  if (!group) return null;
  const fields = group.fields;

  function check() {
    setTouched(true);
    const r: Record<string, boolean> = {};
    let allOk = true;
    for (const f of fields) {
      const v = parseTokens(values[f.key] ?? "");
      const ok = sameSet(v, f.answer);
      r[f.key] = ok;
      if (!ok) allOk = false;
    }
    setResults(r);
    if (allOk) setTimeout(onPass, 350);
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
          {/* Light overlay — Venn behind stays visible while student answers */}
          <div className="absolute inset-0 bg-ink-900/15" />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="card-surface w-full max-w-xl p-5 md:p-6 relative overflow-hidden pointer-events-auto max-h-[60vh] md:max-h-[65vh] overflow-y-auto"
          >
            <div className="absolute -top-10 -right-10 size-32 rounded-full bg-brand-500/15 blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="chip bg-accent-500/10 text-accent-600">
                <Pencil size={14} /> Câu hỏi điền kết quả
              </div>

              <div className="mt-3 rounded-xl border border-brand-200 bg-brand-50/60 p-3.5">
                <div className="text-xs font-bold text-brand-700 uppercase tracking-wide">
                  Đề bài
                </div>
                <p className="mt-1 text-ink-700 text-sm md:text-[15px] leading-relaxed">
                  {group.prompt}
                </p>
              </div>

              <p className="mt-3 text-xs text-ink-500">
                Nhập các phần tử cách nhau bởi dấu phẩy. Ví dụ:{" "}
                <span className="font-mono">1, 2, 3</span>. Thứ tự không quan trọng.
              </p>

              <div className="mt-3 space-y-2.5">
                {fields.map((f) => {
                  const ok = results[f.key];
                  const showStatus = touched && ok !== undefined;
                  return (
                    <div key={f.key}>
                      <label className="text-sm font-semibold text-ink-700">
                        {f.label}
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-ink-500">{"{"}</span>
                        <input
                          type="text"
                          value={values[f.key] ?? ""}
                          onChange={(e) =>
                            setValues((v) => ({ ...v, [f.key]: e.target.value }))
                          }
                          placeholder="vd: 3, 4, 5"
                          className={
                            "flex-1 rounded-xl border px-3 py-2 text-sm md:text-base font-mono outline-none transition " +
                            (showStatus
                              ? ok
                                ? "border-mint-500 bg-mint-500/10"
                                : "border-rose-500 bg-rose-500/5"
                              : "border-ink-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20")
                          }
                        />
                        <span className="font-mono text-ink-500">{"}"}</span>
                        {showStatus &&
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

              <div className="mt-4 flex justify-end">
                <button onClick={check} className="btn-accent">
                  Kiểm tra <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
