"use client";

import ReviewForm from "@/components/ReviewForm";
import { FadeUp } from "@/components/Motion";

export default function NewReviewPage() {
  return (
    <div className="space-y-6">
      <FadeUp>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
            Form penilaian
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
            Buat Review <span className="text-shimmer">Baru</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Pilih mode <strong>Manual</strong> atau{" "}
            <strong>AI (DeepSeek V4 Flash)</strong>, isi data, lalu simpan.
          </p>
        </div>
      </FadeUp>
      <ReviewForm />
    </div>
  );
}
