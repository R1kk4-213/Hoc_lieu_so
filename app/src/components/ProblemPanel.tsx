import { Compass } from "lucide-react";

type Props = {
  /** Short scenario text — what the student should do right now (drag instructions). */
  scenario: string;
};

/** Persistent scenario card above the Venn. Discovery question is shown separately
 *  in a popup AFTER the student finishes placing cards. */
export function ProblemPanel({ scenario }: Props) {
  return (
    <div className="card-surface relative overflow-hidden mb-4 md:mb-5">
      <div className="absolute -top-10 -right-10 size-32 rounded-full bg-brand-500/15 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 size-36 rounded-full bg-accent-500/15 blur-2xl pointer-events-none" />
      <div className="relative flex gap-3 p-4 md:p-5">
        <span className="grid place-items-center size-9 md:size-10 rounded-xl bg-brand-500/10 text-brand-700 shrink-0">
          <Compass size={18} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-brand-700">
            Nhiệm vụ
          </div>
          <p className="mt-0.5 text-ink-800 text-[15px] md:text-base leading-relaxed font-medium">
            {scenario}
          </p>
        </div>
      </div>
    </div>
  );
}
