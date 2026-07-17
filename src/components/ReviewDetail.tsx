"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ISO_9126_CHARACTERISTICS,
  SCORE_LABELS,
  type ScoreValue,
} from "@/lib/iso9126";
import { computeReviewSummary } from "@/lib/scoring";
import { deleteReview } from "@/lib/supabase/reviews";
import type { Review } from "@/types/review";
import { APP_TYPE_LABELS, REVIEW_MODE_LABELS } from "@/types/review";
import ReviewSummaryCard from "@/components/ReviewSummaryCard";

interface ReviewDetailProps {
  review: Review;
}

export default function ReviewDetail({ review }: ReviewDetailProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveWarning, setSaveWarning] = useState<string | null>(null);

  useEffect(() => {
    try {
      const w = sessionStorage.getItem("iso9126-save-warning");
      if (w) {
        setSaveWarning(w);
        sessionStorage.removeItem("iso9126-save-warning");
      }
    } catch {
      // ignore
    }
  }, []);

  const summary = useMemo(
    () => computeReviewSummary(review.scores ?? {}),
    [review.scores]
  );

  const handleDelete = async () => {
    if (!confirm("Hapus review ini secara permanen?")) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteReview(review.id);
      router.push("/history");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus.");
      setDeleting(false);
    }
  };

  const handlePrint = () => window.print();

  const created = new Date(review.created_at).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {review.app_name}
            </h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                review.review_mode === "ai"
                  ? "bg-violet-100 text-violet-700"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              {REVIEW_MODE_LABELS[review.review_mode]}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {APP_TYPE_LABELS[review.app_type]} · Reviewer:{" "}
            {review.reviewer_name} · {created}
          </p>
          {review.app_url && (
            <a
              href={review.app_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-indigo-600 hover:underline break-all"
            >
              {review.app_url}
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-2 print:hidden">
          <Link
            href="/history"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Riwayat
          </Link>
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            🖨️ Cetak / PDF
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
          >
            {deleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>

      {saveWarning && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">Review tersimpan (mode cadangan)</p>
          <p className="mt-1 leading-relaxed">{saveWarning}</p>
          <Link
            href="/history"
            className="mt-2 inline-block text-sm font-semibold text-amber-950 underline"
          >
            Lihat di Riwayat →
          </Link>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {review.notes && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Catatan: </span>
          {review.notes}
        </div>
      )}

      <ReviewSummaryCard summary={summary} />

      {review.ai_summary && (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/60 p-6">
          <h2 className="text-lg font-semibold text-violet-900">
            Ringkasan AI
          </h2>
          {review.ai_model && (
            <p className="mt-1 text-xs text-violet-600">
              Model: {review.ai_model}
            </p>
          )}
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {review.ai_summary}
          </p>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Detail Penilaian
        </h2>
        {ISO_9126_CHARACTERISTICS.map((char) => {
          const charSummary = summary.characteristics.find(
            (c) => c.characteristicId === char.id
          );
          return (
            <div
              key={char.id}
              className={`rounded-2xl border ${char.borderColor} bg-white overflow-hidden`}
            >
              <div
                className={`flex flex-wrap items-center justify-between gap-2 px-5 py-3 ${char.bgColor}`}
              >
                <h3 className={`font-semibold ${char.color}`}>
                  {char.icon} {char.nameId}{" "}
                  <span className="font-normal opacity-70">({char.name})</span>
                </h3>
                {charSummary && (
                  <span className={`text-sm font-semibold ${char.color}`}>
                    {charSummary.average.toFixed(2)} / 5 (
                    {charSummary.percentage.toFixed(1)}%)
                  </span>
                )}
              </div>
              <div className="divide-y divide-slate-100">
                {char.subCharacteristics.map((sub) => {
                  const score = review.scores?.[sub.id] as
                    | ScoreValue
                    | null
                    | undefined;
                  const comment = review.comments?.[sub.id];
                  return (
                    <div
                      key={sub.id}
                      className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-800">
                          {sub.nameId}
                        </p>
                        {comment && (
                          <p className="mt-0.5 text-xs text-slate-500">
                            {comment}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        {score != null ? (
                          <>
                            <span className="text-lg font-bold tabular-nums text-slate-900">
                              {score}
                            </span>
                            <span
                              className={`ml-2 text-xs font-medium ${SCORE_LABELS[score].color}`}
                            >
                              {SCORE_LABELS[score].label}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Belum dinilai
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
