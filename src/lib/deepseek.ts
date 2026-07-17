import OpenAI from "openai";
import {
  ISO_9126_CHARACTERISTICS,
  getAllSubCharacteristicIds,
  type ScoreValue,
} from "@/lib/iso9126";
import type { AppType } from "@/types/review";

const DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEEPSEEK_MODEL = "deepseek-v4-flash";

export function getDeepSeekClient(): OpenAI {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error(
      "DEEPSEEK_API_KEY belum diset. Tambahkan key di .env.local (dari https://platform.deepseek.com)"
    );
  }

  return new OpenAI({
    apiKey,
    baseURL: DEEPSEEK_BASE_URL,
  });
}

export interface AiReviewInput {
  appName: string;
  appType: AppType;
  appUrl?: string | null;
  notes?: string | null;
  description?: string | null;
}

export interface AiReviewResult {
  scores: Record<string, ScoreValue>;
  comments: Record<string, string>;
  summary: string;
  model: string;
}

function buildSystemPrompt(): string {
  const catalog = ISO_9126_CHARACTERISTICS.map((c) => {
    const subs = c.subCharacteristics
      .map((s) => `  - id: "${s.id}" | ${s.nameId} (${s.name}): ${s.description}`)
      .join("\n");
    return `### ${c.nameId} (${c.name})\n${c.description}\nSub-karakteristik:\n${subs}`;
  }).join("\n\n");

  return `Anda adalah auditor kualitas perangkat lunak yang menilai aplikasi/website berdasarkan standar ISO/IEC 9126.

Skala skor: bilangan bulat 1–5
1 = Sangat Buruk, 2 = Buruk, 3 = Cukup, 4 = Baik, 5 = Sangat Baik

Karakteristik ISO 9126:
${catalog}

Tugas Anda:
1. Nilai SEMUA sub-karakteristik (id harus exact seperti di atas).
2. Beri komentar singkat (1–2 kalimat, bahasa Indonesia) untuk setiap sub-karakteristik.
3. Tulis ringkasan keseluruhan (2–4 paragraf, bahasa Indonesia) mencakup kekuatan, kelemahan, dan rekomendasi.

Balas HANYA dengan JSON valid (tanpa markdown, tanpa code fence) dengan bentuk:
{
  "scores": { "<sub_id>": <1-5>, ... },
  "comments": { "<sub_id>": "<komentar>", ... },
  "summary": "<ringkasan keseluruhan>"
}

Pastikan semua id berikut ada di scores dan comments:
${getAllSubCharacteristicIds().join(", ")}`;
}

function buildUserPrompt(input: AiReviewInput): string {
  const lines = [
    `Nama aplikasi/website: ${input.appName}`,
    `Jenis: ${input.appType}`,
  ];
  if (input.appUrl) lines.push(`URL: ${input.appUrl}`);
  if (input.description) lines.push(`Deskripsi fitur/konteks:\n${input.description}`);
  if (input.notes) lines.push(`Catatan tambahan reviewer:\n${input.notes}`);
  lines.push(
    "\nLakukan penilaian ISO 9126 seobjektif mungkin berdasarkan informasi di atas. Jika informasi terbatas, berikan estimasi wajar dan sebutkan asumsi di komentar."
  );
  return lines.join("\n");
}

function clampScore(value: unknown): ScoreValue {
  const n = Number(value);
  if (!Number.isFinite(n)) return 3;
  const rounded = Math.round(n);
  if (rounded < 1) return 1;
  if (rounded > 5) return 5;
  return rounded as ScoreValue;
}

function parseAiJson(content: string): {
  scores: Record<string, ScoreValue>;
  comments: Record<string, string>;
  summary: string;
} {
  let raw = content.trim();
  // Hilangkan code fence jika model tetap membungkus
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }

  const parsed = JSON.parse(raw) as {
    scores?: Record<string, unknown>;
    comments?: Record<string, unknown>;
    summary?: unknown;
  };

  const ids = getAllSubCharacteristicIds();
  const scores: Record<string, ScoreValue> = {};
  const comments: Record<string, string> = {};

  for (const id of ids) {
    scores[id] = clampScore(parsed.scores?.[id] ?? 3);
    const c = parsed.comments?.[id];
    comments[id] = typeof c === "string" && c.trim() ? c.trim() : "Tidak ada komentar detail.";
  }

  const summary =
    typeof parsed.summary === "string" && parsed.summary.trim()
      ? parsed.summary.trim()
      : "Ringkasan AI tidak tersedia.";

  return { scores, comments, summary };
}

export async function generateAiIso9126Review(
  input: AiReviewInput
): Promise<AiReviewResult> {
  const client = getDeepSeekClient();
  const completion = await client.chat.completions.create({
    model: DEEPSEEK_MODEL,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: buildUserPrompt(input) },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek tidak mengembalikan konten.");
  }

  const parsed = parseAiJson(content);
  return {
    ...parsed,
    model: completion.model || DEEPSEEK_MODEL,
  };
}

export { DEEPSEEK_MODEL };
