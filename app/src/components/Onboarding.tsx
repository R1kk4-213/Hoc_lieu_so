import { motion } from "framer-motion";
import { Sparkles, MousePointerClick, Trophy } from "lucide-react";

type Props = { onStart: () => void };

export function Onboarding({ onStart }: Props) {
  return (
    <div className="relative mx-auto max-w-5xl px-4 md:px-8 py-10 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <span className="chip bg-brand-500/10 text-brand-700 border border-brand-200">
          <Sparkles size={14} /> Học liệu tương tác · Toán 10
        </span>
        <h1 className="mt-6 font-display text-5xl md:text-7xl font-extrabold tracking-tight text-ink-900">
          Khám phá <span className="text-brand-600">Tập Hợp</span>
          <br />
          theo cách <span className="bg-gradient-to-br from-accent-500 to-rose-500 bg-clip-text text-transparent">vui hơn</span>.
        </h1>
        <p className="mt-5 text-ink-500 text-base md:text-lg max-w-2xl mx-auto">
          Kéo thả các thẻ bài vào đúng vùng trên Sơ đồ Venn để nắm chắc Phép giao,
          Phép hợp và Phép hiệu. Sai có gợi ý, đúng có hiệu ứng — chơi qua 4 màn để
          nhận chứng chỉ.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={onStart} className="btn-accent px-6 py-3 text-base">
            Bắt đầu ngay
            <MousePointerClick size={18} />
          </button>
          <a href="#features" className="btn-ghost px-5 py-3 text-base">
            Có những gì bên trong?
          </a>
        </div>
      </motion.div>

      <div id="features" className="mt-16 grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: <MousePointerClick className="text-brand-600" />,
            title: "Kéo & thả mượt",
            text: "Dùng được trên cả chuột & cảm ứng. Hỗ trợ bục giảng, tablet, điện thoại.",
          },
          {
            icon: <Sparkles className="text-accent-500" />,
            title: "Phản hồi tức thì",
            text: "Đúng có pháo bông & âm thanh. Sai có gợi ý vui nhộn để định hướng lại.",
          },
          {
            icon: <Trophy className="text-mint-500" />,
            title: "4 màn · 1 chứng chỉ",
            text: "Phép giao, phép hợp, phép hiệu và thử thách toán học bằng số.",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="card-surface p-5"
          >
            <div className="size-10 rounded-xl bg-ink-50 grid place-items-center">
              {f.icon}
            </div>
            <div className="mt-3 font-semibold text-ink-900">{f.title}</div>
            <div className="text-sm text-ink-500 mt-1">{f.text}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
