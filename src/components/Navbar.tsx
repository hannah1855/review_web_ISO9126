"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/review/new", label: "Buat Review" },
  { href: "/history", label: "Riwayat" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.span
            className="pulse-ring flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-300/50"
            whileHover={{ rotate: 8, scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            ISO
          </motion.span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-indigo-700">
              QualityReview
            </p>
            <p className="text-[11px] text-slate-500">ISO/IEC 9126</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-1.5">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-pill relative rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-indigo-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl bg-indigo-50 shadow-sm ring-1 ring-indigo-100"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
