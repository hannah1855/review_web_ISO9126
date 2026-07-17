# QualityReview — ISO/IEC 9126

Website untuk mereview kualitas **aplikasi** atau **website** berdasarkan standar **ISO/IEC 9126**.

## Fitur

- **Review Manual** — nilai 27 sub-karakteristik (skala 1–5) + komentar
- **Review AI** — analisis otomatis dengan **DeepSeek V4 Flash** (`deepseek-v4-flash`)
- **Database Supabase** — simpan, lihat, hapus riwayat review
- Skor keseluruhan, grade A–E, radar chart, bar per karakteristik
- Cetak / export PDF (via print browser)

### Karakteristik ISO 9126

| Karakteristik   | Sub-karakteristik |
|-----------------|-------------------|
| Fungsionalitas  | Kesesuaian, Akurasi, Interoperabilitas, Keamanan, Kepatuhan |
| Keandalan       | Kematangan, Toleransi Kesalahan, Kemampuan Pulih, Kepatuhan |
| Kebergunaan     | Dapat Dipahami, Dapat Dipelajari, Dapat Dioperasikan, Daya Tarik, Kepatuhan |
| Efisiensi       | Perilaku Waktu, Pemanfaatan Sumber Daya, Kepatuhan |
| Pemeliharaan    | Dapat Dianalisis, Dapat Diubah, Stabilitas, Dapat Diuji, Kepatuhan |
| Portabilitas    | Adaptabilitas, Dapat Diinstal, Koeksistensi, Dapat Diganti, Kepatuhan |

## Setup

### 1. Install dependensi

```bash
npm install
```

### 2. Supabase

1. Buat project di [supabase.com](https://supabase.com)
2. Buka **SQL Editor**, jalankan isi file [`supabase/schema.sql`](./supabase/schema.sql)
3. Salin **Project URL** dan **anon public key** dari *Project Settings → API*

### 3. DeepSeek (untuk Review AI)

1. Daftar di [platform.deepseek.com](https://platform.deepseek.com)
2. Buat API key

### 4. Environment

Salin `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Isi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
DEEPSEEK_API_KEY=sk-...
```

### 5. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Struktur

```
src/
  app/
    page.tsx                 # Beranda
    review/new/page.tsx      # Form review (manual + AI)
    review/[id]/page.tsx     # Detail laporan
    history/page.tsx         # Riwayat
    api/ai-review/route.ts   # API DeepSeek V4 Flash
  components/                # UI
  lib/
    iso9126.ts               # Model karakteristik
    scoring.ts               # Perhitungan skor & grade
    deepseek.ts              # Client DeepSeek
    supabase/                # Client & CRUD reviews
  types/review.ts
supabase/schema.sql          # Schema database
```

## Catatan keamanan

- `DEEPSEEK_API_KEY` hanya dipakai di server (`/api/ai-review`), tidak di-bundle ke browser.
- Policy RLS di schema demo bersifat terbuka (public read/write). Untuk produksi, aktifkan Auth Supabase dan perketat policy.

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # jalankan build
npm run lint     # eslint
```
