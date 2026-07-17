"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ISO_9126_CHARACTERISTICS,
  createEmptyScores,
  type ScoreValue,
} from "@/lib/iso9126";
import { computeReviewSummary } from "@/lib/scoring";
import { createReview } from "@/lib/supabase/reviews";
import type { AppType, ReviewMode } from "@/types/review";
import { APP_TYPE_LABELS } from "@/types/review";
import ScoreSelector from "@/components/ScoreSelector";
import ReviewSummaryCard from "@/components/ReviewSummaryCard";

type ModeTab = ReviewMode;

export default function ReviewForm() {
  const router = useRouter();
  const [mode, setMode] = useState<ModeTab>("manual");

  const [appName, setAppName] = useState("");
  const [appType, setAppType] = useState<AppType>("website");
  const [appUrl, setAppUrl] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [notes, setNotes] = useState("");
  const [description, setDescription] = useState("");

  const [scores, setScores] = useState(createEmptyScores);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiModel, setAiModel] = useState<string | null>(null);

  const [activeChar, setActiveChar] = useState(
    ISO_9126_CHARACTERISTICS[0].id
  );
  const [loadingAi, setLoadingAi] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summary = useMemo(() => computeReviewSummary(scores), [scores]);

  const setScore = (id: string, value: ScoreValue) => {
    setScores((prev) => ({ ...prev, [id]: value }));
  };

  const setComment = (id: string, value: string) => {
    setComments((prev) => ({ ...prev, [id]: value }));
  };

  const runAiReview = async () => {
    setError(null);
    if (!appName.trim()) {
      setError("Isi nama aplikasi/website terlebih dahulu.");
      return;
    }

    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName: appName.trim(),
          appType,
          appUrl: appUrl.trim() || null,
          notes: notes.trim() || null,
          description: description.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menjalankan review AI.");
      }

      setScores(data.scores);
      setComments(data.comments ?? {});
      setAiSummary(data.summary ?? null);
      setAiModel(data.model ?? "deepseek-v4-flash");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal review AI.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSave = async () => {
    setError(null);

    if (!appName.trim()) {
      setError("Nama aplikasi/website wajib diisi.");
      return;
    }

    if (mode === "ai" && summary.completedCount === 0) {
      setError("Jalankan review AI terlebih dahulu sebelum menyimpan.");
      return;
    }

    if (mode === "manual" && summary.completedCount === 0) {
      setError("Isi minimal satu skor sebelum menyimpan.");
      return;
    }

    setSaving(true);
    try {
      const result = await createReview({
        app_name: appName.trim(),
        app_type: appType,
        app_url: appUrl.trim() || null,
        reviewer_name: reviewerName.trim() || "Anonim",
        review_mode: mode,
        notes: notes.trim() || null,
        scores,
        comments,
        ai_summary: mode === "ai" ? aiSummary : null,
        ai_model: mode === "ai" ? aiModel : null,
      });

      // Simpan warning di session agar detail/history bisa menampilkan info
      if (result.warning && typeof sessionStorage !== "undefined") {
        sessionStorage.setItem("iso9126-save-warning", result.warning);
      }

      router.push(`/review/${result.review.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan review.");
    } finally {
      setSaving(false);
    }
  };

  const currentChar =
    ISO_9126_CHARACTERISTICS.find((c) => c.id === activeChar) ??
    ISO_9126_CHARACTERISTICS[0];

  return (
    <div className="space-y-6">
      {/* Mode switcher */}
      <motion.div
        className="relative flex flex-wrap gap-2 rounded-2xl border border-white/70 bg-white/70 p-2 shadow-lg shadow-indigo-100/40 backdrop-blur-md"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`relative flex-1 overflow-hidden rounded-xl px-4 py-3.5 text-sm font-bold transition-colors ${
            mode === "manual" ? "text-white" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {mode === "manual" && (
            <motion.span
              layoutId="mode-pill"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-md"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">✍️ Review Manual</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("ai")}
          className={`relative flex-1 overflow-hidden rounded-xl px-4 py-3.5 text-sm font-bold transition-colors ${
            mode === "ai" ? "text-white" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {mode === "ai" && (
            <motion.span
              layoutId="mode-pill"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-md"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">🤖 Review AI (DeepSeek V4 Flash)</span>
        </button>
      </motion.div>

      {/* Meta form */}
      <motion.section
        className="space-y-4 rounded-3xl border border-white/70 bg-white/75 p-6 shadow-lg shadow-indigo-100/30 backdrop-blur-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <h2 className="text-lg font-bold text-slate-900">
          Informasi Aplikasi / Website
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">
              Nama aplikasi / website *
            </span>
            <input
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="Contoh: Tokopedia, Sistem Informasi Kampus"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Jenis</span>
            <select
              value={appType}
              onChange={(e) => setAppType(e.target.value as AppType)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              {(Object.keys(APP_TYPE_LABELS) as AppType[]).map((t) => (
                <option key={t} value={t}>
                  {APP_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">
              Nama reviewer
            </span>
            <input
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Nama Anda"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">
              URL (opsional)
            </span>
            <input
              value={appUrl}
              onChange={(e) => setAppUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          {mode === "ai" && (
            <label className="block space-y-1.5 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Deskripsi fitur / konteks (disarankan untuk AI)
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Jelaskan fitur utama, alur pengguna, stack teknologi, target pengguna, masalah yang diketahui, dll. Semakin detail, review AI semakin akurat."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </label>
          )}

          <label className="block space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">
              Catatan tambahan
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Catatan opsional untuk laporan"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
        </div>

        {mode === "ai" && (
          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
            <motion.button
              type="button"
              onClick={runAiReview}
              disabled={loadingAi}
              whileHover={loadingAi ? undefined : { scale: 1.03, y: -2 }}
              whileTap={loadingAi ? undefined : { scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingAi ? (
                <>
                  <Spinner /> Menganalisis dengan DeepSeek V4 Flash...
                </>
              ) : (
                <>🚀 Generate Review AI</>
              )}
            </motion.button>
            <p className="text-xs text-slate-500">
              Model:{" "}
              <code className="rounded bg-violet-50 px-1.5 py-0.5 text-violet-700">
                deepseek-v4-flash
              </code>
            </p>
          </div>
        )}
      </motion.section>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scoring section */}
      {(mode === "manual" || summary.completedCount > 0) && (
        <>
          <ReviewSummaryCard summary={summary} />

          {aiSummary && mode === "ai" && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-violet-200/80 bg-gradient-to-br from-violet-50/90 to-fuchsia-50/70 p-6 shadow-lg shadow-violet-100/50"
            >
              <h2 className="text-lg font-bold text-violet-900">
                Ringkasan AI
              </h2>
              {aiModel && (
                <p className="mt-1 text-xs text-violet-600">Model: {aiModel}</p>
              )}
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {aiSummary}
              </p>
            </motion.section>
          )}

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl shadow-indigo-100/30 backdrop-blur-md"
          >
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/40 px-4 py-3">
              <h2 className="text-lg font-bold text-slate-900">
                Penilaian Sub-Karakteristik ISO 9126
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {mode === "manual"
                  ? "Nilai setiap kriteria 1–5 dan tambahkan komentar bila perlu."
                  : "Hasil AI dapat Anda sesuaikan sebelum disimpan."}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row">
              <aside className="border-b border-slate-100 lg:w-56 lg:border-b-0 lg:border-r lg:border-slate-100">
                <div className="flex gap-1 overflow-x-auto p-2 lg:flex-col">
                  {ISO_9126_CHARACTERISTICS.map((c) => {
                    const done = c.subCharacteristics.filter(
                      (s) => scores[s.id] != null
                    ).length;
                    const active = activeChar === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveChar(c.id)}
                        className={`flex min-w-[140px] items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors lg:min-w-0 ${
                          active
                            ? `${c.bgColor} ${c.color} font-semibold`
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span>{c.icon}</span>
                        <span className="flex-1 truncate">{c.nameId}</span>
                        <span className="text-[10px] tabular-nums opacity-70">
                          {done}/{c.subCharacteristics.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <div className="flex-1 p-4 sm:p-6 space-y-5">
                <div
                  className={`rounded-xl border p-4 ${currentChar.borderColor} ${currentChar.bgColor}`}
                >
                  <h3 className={`font-semibold ${currentChar.color}`}>
                    {currentChar.icon} {currentChar.nameId}{" "}
                    <span className="font-normal opacity-70">
                      ({currentChar.name})
                    </span>
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {currentChar.description}
                  </p>
                </div>

                {currentChar.subCharacteristics.map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded-xl border border-slate-150 border-slate-100 bg-slate-50/50 p-4 space-y-3"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {sub.nameId}{" "}
                        <span className="text-slate-400 font-normal text-sm">
                          ({sub.name})
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {sub.description}
                      </p>
                    </div>

                    <ScoreSelector
                      value={scores[sub.id]}
                      onChange={(v) => setScore(sub.id, v)}
                      disabled={loadingAi}
                    />

                    <textarea
                      value={comments[sub.id] ?? ""}
                      onChange={(e) => setComment(sub.id, e.target.value)}
                      rows={2}
                      disabled={loadingAi}
                      placeholder="Komentar / alasan skor (opsional)"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </>
      )}

      {mode === "ai" && summary.completedCount === 0 && !loadingAi && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-dashed border-violet-200 bg-gradient-to-br from-violet-50/80 to-fuchsia-50/60 px-6 py-14 text-center shadow-inner"
        >
          <motion.p
            className="text-5xl"
            animate={{ y: [0, -10, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            🤖
          </motion.p>
          <p className="mt-4 text-lg font-bold text-slate-800">
            Siap menganalisis dengan AI
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Isi informasi aplikasi, deskripsikan fitur/konteks, lalu klik{" "}
            <strong>Generate Review AI</strong>. DeepSeek V4 Flash akan menilai
            seluruh kriteria ISO 9126.
          </p>
        </motion.div>
      )}

      {loadingAi && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 rounded-3xl border border-violet-100 bg-white/80 px-6 py-10 shadow-lg backdrop-blur-md"
        >
          <motion.div
            className="h-12 w-12 rounded-full border-[3px] border-violet-200 border-t-violet-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-sm font-semibold text-violet-700">
            DeepSeek V4 Flash sedang menilai ISO 9126...
          </p>
          <motion.div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-violet-400"
                animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}

      <motion.div
        className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl shadow-indigo-200/40 backdrop-blur-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <p className="text-sm text-slate-500">
            Progress:{" "}
            <span className="font-bold text-slate-800">
              {summary.completedCount}/{summary.totalCount}
            </span>{" "}
            kriteria terisi
          </p>
          <div className="mt-1.5 h-1.5 w-40 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
              animate={{
                width: `${
                  summary.totalCount
                    ? (summary.completedCount / summary.totalCount) * 100
                    : 0
                }%`,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
        <motion.button
          type="button"
          onClick={handleSave}
          disabled={saving || loadingAi}
          whileHover={saving || loadingAi ? undefined : { scale: 1.04, y: -2 }}
          whileTap={saving || loadingAi ? undefined : { scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <Spinner /> Menyimpan...
            </>
          ) : (
            <>💾 Simpan Review</>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
  );
}
