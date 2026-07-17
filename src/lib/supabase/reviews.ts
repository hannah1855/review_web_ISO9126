import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  localCreateReview,
  localDeleteReview,
  localFetchReviewById,
  localFetchReviews,
  localUpsertReview,
} from "@/lib/storage/local";
import type { Review, ReviewInsert, ReviewUpdate } from "@/types/review";

export type StorageBackend = "supabase" | "local";

export interface ReviewListResult {
  reviews: Review[];
  backend: StorageBackend;
  warning?: string;
}

export interface ReviewSaveResult {
  review: Review;
  backend: StorageBackend;
  warning?: string;
}

function isMissingTableError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("could not find the table") ||
    m.includes("schema cache") ||
    (m.includes("relation") && m.includes("does not exist")) ||
    m.includes("does not exist")
  );
}

function tableMissingHint(): string {
  return (
    "Tabel `reviews` belum ada di Supabase. Buka SQL Editor Supabase, " +
    "jalankan file `supabase/schema.sql`, lalu refresh halaman. " +
    "Sementara data disimpan di browser (localStorage)."
  );
}

/** Coba Supabase; kalau gagal (tabel belum ada / jaringan), pakai localStorage. */
export async function fetchReviews(): Promise<ReviewListResult> {
  const local = localFetchReviews();

  if (!isSupabaseConfigured()) {
    return {
      reviews: local,
      backend: "local",
      warning:
        "Supabase belum dikonfigurasi. Menampilkan data lokal di browser.",
    };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const remote = (data ?? []) as Review[];

    // Merge: remote + local-only items (belum sempat sync)
    const remoteIds = new Set(remote.map((r) => r.id));
    const localOnly = local.filter((r) => !remoteIds.has(r.id));
    const merged = [...remote, ...localOnly].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return {
      reviews: merged,
      backend: "supabase",
      warning:
        localOnly.length > 0
          ? `${localOnly.length} review hanya ada di browser (belum di Supabase).`
          : undefined,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal memuat dari Supabase";
    return {
      reviews: local,
      backend: "local",
      warning: isMissingTableError(message)
        ? tableMissingHint()
        : `${message} — menampilkan data lokal.`,
    };
  }
}

export async function fetchReviewById(id: string): Promise<Review | null> {
  // Cek lokal dulu (cepat & fallback)
  const local = localFetchReviewById(id);

  if (!isSupabaseConfigured()) return local;

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (data) {
      const review = data as Review;
      localUpsertReview(review);
      return review;
    }
  } catch {
    // fallback ke lokal
  }

  return local;
}

export async function createReview(
  payload: ReviewInsert
): Promise<ReviewSaveResult> {
  // Selalu simpan lokal dulu agar riwayat tidak hilang
  const localReview = localCreateReview(payload);

  if (!isSupabaseConfigured()) {
    return {
      review: localReview,
      backend: "local",
      warning:
        "Supabase belum dikonfigurasi. Review disimpan di browser (localStorage).",
    };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const row = {
      app_name: payload.app_name,
      app_type: payload.app_type,
      app_url: payload.app_url ?? null,
      reviewer_name: payload.reviewer_name?.trim() || "Anonim",
      review_mode: payload.review_mode,
      notes: payload.notes ?? null,
      scores: sanitizeScores(payload.scores),
      comments: payload.comments ?? {},
      ai_summary: payload.ai_summary ?? null,
      ai_model: payload.ai_model ?? null,
    };

    const { data, error } = await supabase
      .from("reviews")
      .insert(row)
      .select()
      .single();

    if (error) throw new Error(error.message);

    const remote = data as Review;
    // Ganti entri lokal dengan id Supabase
    localDeleteReview(localReview.id);
    localUpsertReview(remote);

    return { review: remote, backend: "supabase" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal simpan ke Supabase";
    return {
      review: localReview,
      backend: "local",
      warning: isMissingTableError(message)
        ? tableMissingHint()
        : `${message} — review tetap tersimpan di browser.`,
    };
  }
}

export async function updateReview(
  id: string,
  payload: ReviewUpdate
): Promise<Review> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("reviews")
        .update({
          ...payload,
          scores: payload.scores
            ? sanitizeScores(payload.scores)
            : undefined,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      const review = data as Review;
      localUpsertReview(review);
      return review;
    } catch {
      // fall through
    }
  }

  const local = localFetchReviewById(id);
  if (!local) throw new Error("Review tidak ditemukan.");
  const updated: Review = {
    ...local,
    ...payload,
    id,
    updated_at: new Date().toISOString(),
  };
  localUpsertReview(updated);
  return updated;
}

export async function deleteReview(id: string): Promise<void> {
  localDeleteReview(id);

  if (!isSupabaseConfigured()) return;

  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } catch {
    // sudah dihapus lokal
  }
}

/** Buang key null agar JSON lebih bersih di DB */
function sanitizeScores(
  scores: ReviewInsert["scores"]
): Record<string, number> {
  const clean: Record<string, number> = {};
  for (const [k, v] of Object.entries(scores ?? {})) {
    if (v !== null && v !== undefined) clean[k] = v;
  }
  return clean;
}
