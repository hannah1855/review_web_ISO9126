"use client";

import { motion } from "framer-motion";
import { gradeColor } from "@/lib/scoring";
import type { ReviewSummary } from "@/types/review";
import ScoreBar from "@/components/ScoreBar";
import ScoreRadar from "@/components/ScoreRadar";

interface ReviewSummaryCardProps {
  summary: ReviewSummary;
  showRadar?: boolean;
}

export default function ReviewSummaryCard({
  summary,
  showRadar = true,
}: ReviewSummaryCardProps) {
  return (
    <motion.div
      className="glass overflow-hidden rounded-3xl border border-white/70 p-6 shadow-xl shadow-indigo-100/40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex flex-1 flex-col items-center text-center lg:max-w-xs">
          <p className="text-sm font-medium text-slate-500">Skor Keseluruhan</p>
          <motion.div
            className={`mt-3 flex h-28 w-28 flex-col items-center justify-center rounded-3xl border-2 shadow-lg ${gradeColor(
              summary.grade
            )}`}
            initial={{ scale: 0.6, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            whileHover={{ scale: 1.06, rotate: 2 }}
          >
            <span className="text-4xl font-black leading-none">
              {summary.grade}
            </span>
            <span className="mt-1 text-[11px] font-semibold">
              {summary.gradeLabel}
            </span>
          </motion.div>
          <motion.p
            className="mt-4 text-3xl font-bold tabular-nums text-slate-900"
            key={summary.overallAverage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {summary.overallAverage.toFixed(2)}
            <span className="text-base font-normal text-slate-400"> / 5</span>
          </motion.p>
          <p className="text-sm text-slate-500">
            {summary.overallPercentage.toFixed(1)}% · {summary.completedCount}/
            {summary.totalCount} kriteria
          </p>
        </div>

        {showRadar && (
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <ScoreRadar characteristics={summary.characteristics} />
          </motion.div>
        )}

        <div className="flex-1 space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            Skor per Karakteristik
          </p>
          {summary.characteristics.map((c, i) => (
            <motion.div
              key={c.characteristicId}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <ScoreBar
                label={c.nameId}
                percentage={c.percentage}
                average={c.average}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
