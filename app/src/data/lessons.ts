/**
 * Lesson types + loader.
 *
 * The actual content for each lesson lives in JSON files under
 * `src/data/content/`. Teachers should edit those JSONs to change
 * questions, prompts, answers, etc. — they should NOT need to touch
 * this file or any .ts/.tsx file.
 *
 * See `src/data/content/README.md` for a Vietnamese guide.
 */

import bai1 from "./content/bai1.json";
import bai2 from "./content/bai2.json";
import bai3 from "./content/bai3.json";
import bai4 from "./content/bai4.json";
import bai5 from "./content/bai5.json";
import bai7 from "./content/bai7.json";

// ── Step types ────────────────────────────────────────────────────────────────

export type IntroStep = {
  kind: "intro";
  title: string;
  body: string;
  bullets?: string[];
};

export type ClassifyStep = {
  kind: "classify";
  prompt: string;
  buckets: { id: string; label: string; description?: string; image?: string }[];
  items: {
    id: string;
    text: string;
    targets: string[];
    image?: string;
    hint?: string;
  }[];
};

export type TrueFalseStep = {
  kind: "true-false";
  prompt: string;
  statements: { id: string; text: string; answer: boolean; explain?: string }[];
};

export type PickSymbolStep = {
  kind: "pick-symbol";
  prompt: string;
  options: [string, string];
  rows: {
    id: string;
    left: string;
    right: string;
    answer: 0 | 1;
    explain?: string;
  }[];
};

export type FreeAnswerStep = {
  kind: "free-answer";
  prompt: string;
  fields: {
    key: string;
    label: string;
    answers: (string | number)[][];
    placeholder?: string;
    single?: boolean;
  }[];
};

export type TheoryStep = {
  kind: "theory";
  title: string;
  body: string;
  formula?: string;
  bullets?: string[];
  note?: string;
  image?: string;
};

export type MultiTickStep = {
  kind: "multi-tick";
  prompt: string;
  options: { id: string; text: string; correct: boolean }[];
  explanation?: string;
};

export type IntervalMatchStep = {
  kind: "interval-match";
  prompt: string;
  rows: {
    id: string;
    description: string;
    answers: string[];
  }[];
};

export type WordProblemStep = {
  kind: "word-problem";
  prompt: string;
  setup: string;
  answer: number;
  unit?: string;
  hintImage?: string;
  solution: string;
};

export type Step =
  | IntroStep
  | ClassifyStep
  | TrueFalseStep
  | PickSymbolStep
  | FreeAnswerStep
  | TheoryStep
  | MultiTickStep
  | IntervalMatchStep
  | WordProblemStep;

export type Lesson = {
  id: string;
  number: string;
  title: string;
  steps: Step[];
};

// ── Lesson registry (JSON content is hand-validated; cast through unknown) ────

export const LESSONS: Record<string, Lesson> = {
  bai1: bai1 as unknown as Lesson,
  bai2: bai2 as unknown as Lesson,
  bai3: bai3 as unknown as Lesson,
  bai4: bai4 as unknown as Lesson,
  bai5: bai5 as unknown as Lesson,
  bai7: bai7 as unknown as Lesson,
};
