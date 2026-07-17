"use client";

import Link from "next/link";
import { ISO_9126_CHARACTERISTICS } from "@/lib/iso9126";
import { FadeUp, MotionItem, PageEnter, motion } from "@/components/Motion";

const particles = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${6 + ((i * 7) % 88)}%`,
  size: 3 + (i % 5),
  delay: `${(i * 0.45) % 5}s`,
  duration: `${4 + (i % 5)}s`,
}));

export default function HomePage() {
  return (
    <PageEnter className="space-y-12">
      {/* Hero */}
      <MotionItem>
        <section className="hero-gradient relative overflow-hidden rounded-[2rem] border border-white/20 px-6 py-16 text-white shadow-2xl shadow-indigo-300/40 sm:px-12 sm:py-20">
          {/* floating orbs inside hero */}
          <motion.div
            className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl"
            animate={{ x: [0, 30, -10, 0], y: [0, 20, 40, 0], scale: [1, 1.15, 0.95, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-16 -left-8 h-48 w-48 rounded-full bg-fuchsia-300/25 blur-2xl"
            animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="blob absolute right-[12%] top-[30%] h-24 w-24 bg-cyan-300/20 blur-xl"
            animate={{ rotate: [0, 40, -20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* rising particles */}
          {particles.map((p) => (
            <span
              key={p.id}
              className="particle"
              style={{
                left: p.left,
                bottom: "8%",
                width: p.size,
                height: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}

          <div className="relative max-w-2xl">
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
              </span>
              ISO/IEC 9126 Software Product Quality
            </motion.span>

            <motion.h1
              className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.15]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              Review kualitas aplikasi & website dengan standar internasional
            </motion.h1>

            <motion.p
              className="mt-5 text-base leading-relaxed text-indigo-100 sm:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.55 }}
            >
              Nilai 6 karakteristik dan 27 sub-karakteristik ISO 9126 secara{" "}
              <strong className="text-white">manual</strong> atau otomatis dengan{" "}
              <strong className="text-white">DeepSeek V4 Flash</strong>. Hasil
              tersimpan di <strong className="text-white">Supabase</strong>.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/review/new"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 shadow-lg shadow-indigo-950/20"
                >
                  ✨ Mulai Review
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/history"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20"
                >
                  📋 Lihat Riwayat
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* floating badge */}
          <motion.div
            className="absolute bottom-6 right-6 hidden rounded-2xl border border-white/25 bg-white/15 px-4 py-3 backdrop-blur-md sm:block"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-indigo-100">
              Grade model
            </p>
            <p className="text-2xl font-black text-white">A → E</p>
          </motion.div>
        </section>
      </MotionItem>

      {/* Modes */}
      <section className="grid gap-4 sm:grid-cols-2">
        <FadeUp delay={0.05}>
          <motion.div
            className="card-glow glass group h-full rounded-3xl border border-white/60 p-7 shadow-lg shadow-indigo-100/40"
            whileHover={{ y: -6 }}
          >
            <motion.div
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-2xl shadow-lg shadow-indigo-200"
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              ✍️
            </motion.div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Review Manual
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Isi skor 1–5 untuk setiap sub-karakteristik ISO 9126, tambahkan
              komentar, dan dapatkan grade otomatis (A–E) beserta radar chart
              interaktif.
            </p>
            <div className="mt-4 h-1 w-12 rounded-full bg-indigo-400 transition-all duration-500 group-hover:w-24" />
          </motion.div>
        </FadeUp>

        <FadeUp delay={0.12}>
          <motion.div
            className="card-glow group h-full rounded-3xl border border-violet-200/80 bg-gradient-to-br from-violet-50/90 to-fuchsia-50/80 p-7 shadow-lg shadow-violet-100/50"
            whileHover={{ y: -6 }}
          >
            <motion.div
              className="blob flex h-14 w-14 items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-500 text-2xl shadow-lg shadow-violet-200"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              🤖
            </motion.div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Review AI — DeepSeek V4 Flash
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Deskripsikan aplikasi/website Anda. AI menilai seluruh kriteria,
              menulis komentar per aspek, dan merangkum kekuatan, kelemahan,
              serta rekomendasi.
            </p>
            <div className="mt-4 h-1 w-12 rounded-full bg-violet-400 transition-all duration-500 group-hover:w-24" />
          </motion.div>
        </FadeUp>
      </section>

      {/* ISO characteristics */}
      <section>
        <FadeUp>
          <div className="mb-6 text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
              Standar kualitas
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Enam Karakteristik{" "}
              <span className="text-shimmer">ISO 9126</span>
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Model kualitas produk perangkat lunak — dari fungsionalitas hingga
              portabilitas.
            </p>
          </div>
        </FadeUp>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ISO_9126_CHARACTERISTICS.map((c, i) => (
            <FadeUp key={c.id} delay={i * 0.06}>
              <motion.div
                className={`card-glow h-full rounded-3xl border ${c.borderColor} ${c.bgColor} p-6 shadow-md`}
                whileHover={{ y: -8, rotate: i % 2 === 0 ? 0.5 : -0.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-2xl shadow-sm"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 2.8 + i * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2,
                    }}
                  >
                    {c.icon}
                  </motion.span>
                  <div>
                    <p className={`font-bold ${c.color}`}>{c.nameId}</p>
                    <p className="text-xs text-slate-500">{c.name}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                  {c.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    {c.subCharacteristics.length} sub-karakteristik
                  </span>
                  <motion.span
                    className={`text-lg ${c.color}`}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15 }}
                  >
                    →
                  </motion.span>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CTA */}
      <FadeUp>
        <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/80 px-6 py-12 text-center shadow-xl shadow-indigo-100/50 backdrop-blur-md">
          <motion.div
            className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-indigo-200/40 blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
            transition={{ duration: 9, repeat: Infinity }}
          />
          <div className="relative">
            <motion.span
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-2xl shadow-lg"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🚀
            </motion.span>
            <h2 className="text-2xl font-bold text-slate-900">
              Siap menilai kualitas software Anda?
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
              Buat review baru, pilih mode manual atau AI, simpan ke Supabase,
              dan cetak laporan sebagai PDF.
            </p>
            <motion.div
              className="mt-7 inline-block"
              whileHover={{ scale: 1.06, y: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              <Link
                href="/review/new"
                className="inline-flex rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-300/50"
              >
                Buat Review Sekarang
              </Link>
            </motion.div>
          </div>
        </section>
      </FadeUp>
    </PageEnter>
  );
}
