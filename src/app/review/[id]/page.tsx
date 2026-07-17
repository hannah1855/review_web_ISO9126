"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import ReviewDetail from "@/components/ReviewDetail";
import { fetchReviewById } from "@/lib/supabase/reviews";
import type { Review } from "@/types/review";

export default function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchReviewById(id);
        if (!cancelled) {
          if (!data) setError("Review tidak ditemukan.");
          else setReview(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Gagal memuat review.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500">
        Memuat detail review...
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error ?? "Review tidak ditemukan."}
        </div>
        <Link
          href="/history"
          className="inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Kembali ke riwayat
        </Link>
      </div>
    );
  }

  return <ReviewDetail review={review} />;
}
