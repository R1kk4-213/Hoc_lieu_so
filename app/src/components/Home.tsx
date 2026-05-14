import { motion } from "framer-motion";
import {
  Sparkles,
  MousePointerClick,
  Trophy,
  BookOpenCheck,
  Layers,
  Equal,
  Hash,
  Ruler,
  Calculator,
  Sigma,
  ArrowRight,
} from "lucide-react";
import type { ReactNode } from "react";

export type ChapterId =
  | "bai1"
  | "bai2"
  | "bai3"
  | "bai4"
  | "bai5"
  | "operations"
  | "bai7";

type ChapterCard = {
  id: ChapterId;
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
  tint: string; // tailwind classes for gradient
  badge?: string;
};

const CHAPTERS: ChapterCard[] = [
  {
    id: "bai1",
    number: "Bài 1",
    title: "Tập hợp",
    description:
      "Phân loại nhân vật vào các tập hợp, làm bài Đúng/Sai và sử dụng kí hiệu ∈, ∉.",
    icon: <BookOpenCheck size={22} />,
    tint: "from-brand-500/15 to-brand-700/10",
  },
  {
    id: "bai2",
    number: "Bài 2",
    title: "Tập hợp con",
    description: "Quan hệ T ⊂ S, kí hiệu ⊂ và ⊄, biểu đồ Ven lồng.",
    icon: <Layers size={22} />,
    tint: "from-accent-500/15 to-accent-600/10",
  },
  {
    id: "bai3",
    number: "Bài 3",
    title: "Hai tập hợp bằng nhau",
    description: "Khi nào S = T? Luyện tập với số chính phương và hình học.",
    icon: <Equal size={22} />,
    tint: "from-mint-500/15 to-brand-500/10",
  },
  {
    id: "bai4",
    number: "Bài 4",
    title: "Các tập hợp số",
    description: "Mối quan hệ ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ — phân loại các số.",
    icon: <Hash size={22} />,
    tint: "from-brand-500/15 to-rose-500/10",
  },
  {
    id: "bai5",
    number: "Bài 5",
    title: "Tập con của ℝ",
    description: "Khoảng, đoạn, nửa khoảng — đọc và viết kí hiệu.",
    icon: <Ruler size={22} />,
    tint: "from-accent-500/15 to-rose-500/10",
  },
  {
    id: "operations",
    number: "Bài 6",
    title: "Các phép toán trên tập hợp",
    description:
      "Phép giao, phép hợp, phép hiệu qua trò chơi kéo-thả 4 màn. Có chứng chỉ!",
    icon: <Sigma size={22} />,
    tint: "from-brand-500/20 to-accent-500/15",
    badge: "🎮 Mini-game",
  },
  {
    id: "bai7",
    number: "Bài 7",
    title: "Đếm phần tử của hợp 2 tập hợp",
    description:
      "Bài toán ứng dụng: n(A∪B) = n(A) + n(B) − n(A∩B). Lớp 10A đi thi đấu thể thao.",
    icon: <Calculator size={22} />,
    tint: "from-mint-500/15 to-accent-500/10",
  },
];

type Props = {
  onPick: (id: ChapterId) => void;
};

export function Home({ onPick }: Props) {
  return (
    <div className="relative mx-auto max-w-6xl px-4 md:px-8 py-8 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <span className="chip bg-brand-500/10 text-brand-700 border border-brand-200">
          <Sparkles size={14} /> Học liệu tương tác · Toán 10
        </span>
        <h1 className="mt-5 font-display text-4xl md:text-6xl font-extrabold tracking-tight text-ink-900">
          Khám phá <span className="text-brand-600">Tập Hợp</span>
          <br className="hidden md:block" />
          theo cách{" "}
          <span className="bg-gradient-to-br from-accent-500 to-rose-500 bg-clip-text text-transparent">
            vui hơn
          </span>
          .
        </h1>
        <p className="mt-4 text-ink-500 text-base md:text-lg max-w-2xl mx-auto">
          Bộ học liệu gồm 7 bài học từ định nghĩa tập hợp đến các phép toán và
          bài toán đếm phần tử — đầy đủ kiến thức Chương 1, Toán 10.
        </p>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHAPTERS.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
            whileHover={{ y: -4 }}
            onClick={() => onPick(c.id)}
            className={
              "card-surface text-left p-5 relative overflow-hidden group cursor-pointer transition shadow-soft hover:shadow-glow bg-gradient-to-br " +
              c.tint
            }
          >
            <div className="absolute -top-10 -right-10 size-28 rounded-full bg-white/40 blur-2xl pointer-events-none" />
            <div className="relative flex items-start gap-3">
              <div className="grid place-items-center size-11 rounded-xl bg-white/80 text-brand-700 shrink-0 shadow-soft">
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
                    {c.number}
                  </span>
                  {c.badge && (
                    <span className="chip !py-0.5 !px-2 bg-accent-500/15 text-accent-600 text-[10px]">
                      {c.badge}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 font-display font-extrabold text-lg text-ink-900">
                  {c.title}
                </div>
                <p className="text-sm text-ink-600 mt-1.5 leading-relaxed">
                  {c.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-brand-700 text-sm font-semibold opacity-80 group-hover:opacity-100">
                  Vào học <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-12 grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: <MousePointerClick className="text-brand-600" />,
            title: "Kéo & thả mượt",
            text: "Dùng được trên cả chuột & cảm ứng — bục giảng, tablet, điện thoại.",
          },
          {
            icon: <Sparkles className="text-accent-500" />,
            title: "Phản hồi tức thì",
            text: "Đúng có pháo bông & âm thanh. Sai có gợi ý vui để định hướng lại.",
          },
          {
            icon: <Trophy className="text-mint-500" />,
            title: "Đầy đủ chương 1",
            text: "Từ định nghĩa tập hợp tới phép toán và bài toán đếm phần tử.",
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
