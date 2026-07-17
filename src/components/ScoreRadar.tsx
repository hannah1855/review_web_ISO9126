"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { CharacteristicScore } from "@/types/review";

interface ScoreRadarProps {
  characteristics: CharacteristicScore[];
  size?: number;
}

/** Radar chart animasi (SVG) untuk 6 karakteristik ISO 9126 */
export default function ScoreRadar({
  characteristics,
  size = 280,
}: ScoreRadarProps) {
  const n = characteristics.length;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, [characteristics]);

  if (n === 0) return null;

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.36;
  const levels = [0.2, 0.4, 0.6, 0.8, 1];

  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const point = (i: number, ratio: number) => {
    const a = angleFor(i);
    return {
      x: cx + Math.cos(a) * maxR * ratio,
      y: cy + Math.sin(a) * maxR * ratio,
    };
  };

  const gridPolygons = levels.map((level) =>
    characteristics
      .map((_, i) => {
        const p = point(i, level);
        return `${p.x},${p.y}`;
      })
      .join(" ")
  );

  const dataPoints = characteristics.map((c, i) => {
    const ratio = ready
      ? Math.min(1, Math.max(0, c.percentage / 100))
      : 0.05;
    return point(i, ratio);
  });

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <motion.svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="auto"
      className="mx-auto max-w-[320px]"
      role="img"
      aria-label="Radar chart skor ISO 9126"
      animate={{ rotate: [0, 1.5, -1.5, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(99,102,241,0.4)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0.25)" />
        </linearGradient>
        <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {gridPolygons.map((pts, idx) => (
        <polygon
          key={idx}
          points={pts}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={1}
        />
      ))}

      {characteristics.map((_, i) => {
        const p = point(i, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        );
      })}

      <polygon
        points={dataPolygon}
        fill="url(#radarFill)"
        stroke="#6366f1"
        strokeWidth={2.5}
        filter="url(#radarGlow)"
        style={{
          transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={5}
          fill="#4f46e5"
          stroke="white"
          strokeWidth={2}
          style={{
            transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <animate
            attributeName="r"
            values="4;6;4"
            dur={`${2 + (i % 3) * 0.4}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {characteristics.map((c, i) => {
        const p = point(i, 1.22);
        return (
          <text
            key={c.characteristicId}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-600"
            fontSize={10}
            fontWeight={700}
          >
            {c.nameId}
          </text>
        );
      })}
    </motion.svg>
  );
}
