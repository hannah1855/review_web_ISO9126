import type { Review, ReviewInsert, ReviewUpdate } from "@/types/review";

const STORAGE_KEY = "iso9126-reviews-local";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readAll(): Review[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Review[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(reviews: Review[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `local_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function localFetchReviews(): Review[] {
  return readAll().sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function localFetchReviewById(id: string): Review | null {
  return readAll().find((r) => r.id === id) ?? null;
}

export function localCreateReview(payload: ReviewInsert): Review {
  const now = new Date().toISOString();
  const review: Review = {
    id: generateId(),
    app_name: payload.app_name,
    app_type: payload.app_type,
    app_url: payload.app_url ?? null,
    reviewer_name: payload.reviewer_name?.trim() || "Anonim",
    review_mode: payload.review_mode,
    notes: payload.notes ?? null,
    scores: payload.scores,
    comments: payload.comments ?? {},
    ai_summary: payload.ai_summary ?? null,
    ai_model: payload.ai_model ?? null,
    created_at: now,
    updated_at: now,
  };

  const all = readAll();
  all.unshift(review);
  writeAll(all);
  return review;
}

export function localUpdateReview(id: string, payload: ReviewUpdate): Review {
  const all = readAll();
  const idx = all.findIndex((r) => r.id === id);
  if (idx < 0) throw new Error("Review lokal tidak ditemukan.");

  const updated: Review = {
    ...all[idx],
    ...payload,
    id,
    updated_at: new Date().toISOString(),
  };
  all[idx] = updated;
  writeAll(all);
  return updated;
}

export function localDeleteReview(id: string): void {
  writeAll(readAll().filter((r) => r.id !== id));
}

export function localUpsertReview(review: Review): void {
  const all = readAll();
  const idx = all.findIndex((r) => r.id === review.id);
  if (idx >= 0) all[idx] = review;
  else all.unshift(review);
  writeAll(all);
}
