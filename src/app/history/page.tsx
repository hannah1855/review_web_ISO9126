"use client";

import HistoryList from "@/components/HistoryList";
import { FadeUp } from "@/components/Motion";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <FadeUp>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
            Arsip penilaian
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
            Riwayat <span className="text-shimmer">Review</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Semua penilaian ISO 9126 — tersimpan di Supabase atau browser.
          </p>
        </div>
      </FadeUp>
      <HistoryList />
    </div>
  );
}
