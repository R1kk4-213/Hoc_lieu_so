/**
 * Operations game (Bài 6) types + loader.
 *
 * Content lives in `src/data/content/operations.json`. Teachers should edit
 * that file to change levels, cards, questions, hints, etc. — without
 * touching any TypeScript.
 *
 * See `src/data/content/README.md` for a Vietnamese guide.
 */

import operations from "./content/operations.json";

export type ZoneKey = "A" | "AB" | "B";

export type CardItem = {
  id: string;
  text: string;
  target: ZoneKey;
  hint: string;
};

export type Definition = {
  body: string;
  formula: string;
  setNames: [string, string];
  image?: string;
  imageCaption?: string;
};

export type FillField = {
  key: string;
  label: string;
  answer: (string | number)[];
};

export type FillInGroup = {
  prompt: string;
  fields: FillField[];
};

export type DiscoveryQuestion = {
  prompt: string;
  fieldLabel: string;
  placeholder: string;
  answers: string[][];
  revealNote?: string;
};

export type Level = {
  id: number;
  title: string;
  topic: string;
  scenario: string;
  labelA: string;
  labelB: string;
  effect: "intersect" | "union" | "difference" | "math";
  popupTitle: string;
  popupText: string;
  definition: Definition;
  items: CardItem[];
  discovery?: DiscoveryQuestion;
  fillIn?: FillInGroup;
};

// JSON content is hand-validated; cast through unknown.
const data = operations as unknown as {
  maxHintsPerLevel: number;
  maxMistakesPerLevel: number;
  levels: Level[];
};

export const gameData: Level[] = data.levels;
export const MAX_HINTS_PER_LEVEL = data.maxHintsPerLevel;
export const MAX_MISTAKES_PER_LEVEL = data.maxMistakesPerLevel;
