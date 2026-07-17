"use client";

import { useEffect, useState } from "react";
import { percentageBarColor } from "@/lib/scoring";

interface ScoreBarProps {
  label: string;
  percentage: number;
  average?: number;
  colorClass?: string;
}

export default function ScoreBar({
  label,
  percentage,
  average,
  colorClass,
}: ScoreBarProps) {
  const bar = colorClass ?? percentageBarColor(percentage);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      setWidth(Math.min(100, Math.max(0, percentage)));
    });
    return () => cancelAnimationFrame(t);
  }, [percentage]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="tabular-nums text-slate-500">
          {average !== undefined && (
            <span className="mr-2 font-semibold text-slate-800">
              {average.toFixed(2)}
            </span>
          )}
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100/80 ring-1 ring-slate-100">
        <div
          className={`score-fill h-full rounded-full ${bar}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
