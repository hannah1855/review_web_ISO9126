import { NextResponse } from "next/server";
import { generateAiIso9126Review } from "@/lib/deepseek";
import type { AppType } from "@/types/review";

export const runtime = "nodejs";
export const maxDuration = 120;

const APP_TYPES: AppType[] = ["website", "mobile", "desktop", "other"];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      appName?: string;
      appType?: string;
      appUrl?: string | null;
      notes?: string | null;
      description?: string | null;
    };

    const appName = body.appName?.trim();
    if (!appName) {
      return NextResponse.json(
        { error: "Nama aplikasi/website wajib diisi." },
        { status: 400 }
      );
    }

    const appType = (body.appType ?? "website") as AppType;
    if (!APP_TYPES.includes(appType)) {
      return NextResponse.json(
        { error: "Jenis aplikasi tidak valid." },
        { status: 400 }
      );
    }

    const result = await generateAiIso9126Review({
      appName,
      appType,
      appUrl: body.appUrl?.trim() || null,
      notes: body.notes?.trim() || null,
      description: body.description?.trim() || null,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal menghasilkan review AI.";
    console.error("[ai-review]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
