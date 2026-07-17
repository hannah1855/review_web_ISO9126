"use client";

import { motion } from "framer-motion";
import { SCORE_LABELS, type ScoreValue } from "@/lib/iso9126";

interface ScoreSelectorProps {
  value: ScoreValue | null;
  onChange: (value: ScoreValue) => void;
  disabled?: boolean;
}

export default function ScoreSelector({
  value,
  onChange,
  disabled,
}: ScoreSelectorProps) {
  const scores: ScoreValue[] = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {scores.map((s) => {
        const active = value === s;
        return (
          <motion.button
            key={s}
            type="button"
            disabled={disabled}
            title={SCORE_LABELS[s].label}
            onClick={() => onChange(s)}
            whileHover={disabled ? undefined : { y: -3, scale: 1.08 }}
            whileTap={disabled ? undefined : { scale: 0.92 }}
            className={`relative h-10 min-w-10 rounded-xl border text-sm font-bold transition-colors ${
              active
                ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {active && (
              <motion.span
                layoutId="score-glow"
                className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-indigo-300/60"
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
            )}
            <span className="relative z-10">{s}</span>
          </motion.button>
        );
      })}
      {value && (
        <motion.span
          key={value}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className={`ml-1 text-xs font-semibold ${SCORE_LABELS[value].color}`}
        >
          {SCORE_LABELS[value].label}
        </motion.span>
      )}
    </div>
  );
}
