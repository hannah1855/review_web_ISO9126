"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { computeReviewSummary, gradeColor } from "@/lib/scoring";
import { fetchReviews, deleteReview } from "@/lib/supabase/reviews";
import type { Review } from "@/types/review";
import { APP_TYPE_LABELS, REVIEW_MODE_LABELS } from "@/types/review";

export default function HistoryList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [backend, setBackend] = useState<"supabase" | "local">("local");
  const [filter, setFilter] = useState<"all" | "manual" | "ai">("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setWarning(null);
    try {
      const result = await fetchReviews();
      setReviews(result.reviews);
      setBackend(result.backend);
      if (result.warning) setWarning(result.warning);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat riwayat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus review "${name}"?`)) return;
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus.");
    }
  };

  const filtered =
    filter === "all"
      ? reviews
      : reviews.filter((r) => r.review_mode === filter);

  return (
    <div className="space-y-5">
      <motion.div
        className="flex flex-wrap items-center justify-between gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex gap-1 rounded-2xl border border-white/70 bg-white/70 p-1 shadow-sm backdrop-blur-md">
            {(
              [
                { id: "all", label: "Semua" },
                { id: "manual", label: "Manual" },
                { id: "ai", label: "AI" },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`relative rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.id
                    ? "text-indigo-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {filter === f.id && (
                  <motion.span
                    layoutId="history-filter"
                    className="absolute inset-0 rounded-xl bg-indigo-50 shadow-sm ring-1 ring-indigo-100"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            ))}
          </div>
          <motion.span
            key={backend}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              backend === "supabase"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {backend === "supabase" ? "● Supabase" : "● Lokal (browser)"}
          </motion.span>
        </div>
        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={() => void load()}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="rounded-xl border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-md hover:bg-white"
          >
            ↻ Refresh
          </motion.button>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/review/new"
              className="inline-block rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200"
            >
              + Buat Review
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {warning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-900 shadow-sm"
          >
            <p className="font-semibold">Perhatian</p>
            <p className="mt-1 leading-relaxed">{warning}</p>
            <p className="mt-2 text-xs text-amber-800/80">
              Langkah: Supabase Dashboard → SQL Editor → paste & Run isi file{" "}
              <code className="rounded bg-amber-100 px-1">
                supabase/schema.sql
              </code>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="glass flex flex-col items-center justify-center rounded-3xl border border-white/60 px-6 py-20 shadow-lg">
          <motion.div
            className="h-10 w-10 rounded-full border-2 border-indigo-200 border-t-indigo-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
          <p className="mt-4 text-sm text-slate-500">Memuat riwayat review...</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl border border-dashed border-indigo-200 px-6 py-16 text-center shadow-lg"
        >
          <motion.p
            className="text-5xl"
            animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            📋
          </motion.p>
          <p className="mt-4 text-lg font-bold text-slate-800">
            Belum ada review
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Buat review manual atau AI, lalu klik <strong>Simpan Review</strong>.
          </p>
          <Link
            href="/review/new"
            className="mt-5 inline-block rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md"
          >
            Buat Review Pertama
          </Link>
        </motion.div>
      )}

      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((review, index) => {
            const summary = computeReviewSummary(review.scores ?? {});
            const date = new Date(review.created_at).toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            });

            return (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.95 }}
                transition={{
                  delay: index * 0.04,
                  type: "spring",
                  stiffness: 320,
                  damping: 28,
                }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="glass flex flex-col gap-3 rounded-2xl border border-white/70 p-4 shadow-md shadow-indigo-100/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/review/${review.id}`}
                      className="truncate text-base font-bold text-slate-900 transition-colors hover:text-indigo-700"
                    >
                      {review.app_name}
                    </Link>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        review.review_mode === "ai"
                          ? "bg-violet-100 text-violet-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {REVIEW_MODE_LABELS[review.review_mode] ??
                        review.review_mode}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {APP_TYPE_LABELS[review.app_type] ?? review.app_type} ·{" "}
                    {review.reviewer_name} · {date}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <motion.div
                    className={`flex h-12 w-12 flex-col items-center justify-center rounded-xl border text-center shadow-sm ${gradeColor(
                      summary.grade
                    )}`}
                    whileHover={{ rotate: 6, scale: 1.08 }}
                  >
                    <span className="text-lg font-black leading-none">
                      {summary.grade}
                    </span>
                  </motion.div>
                  <div className="text-right text-sm">
                    <p className="font-bold tabular-nums text-slate-800">
                      {summary.overallAverage.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {summary.overallPercentage.toFixed(0)}%
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Link
                      href={`/review/${review.id}`}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      Lihat
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(review.id, review.app_name)}
                      className="rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
