import type { ScoreValue } from "@/lib/iso9126";

export type AppType = "website" | "mobile" | "desktop" | "other";
export type ReviewMode = "manual" | "ai";

export interface Review {
  id: string;
  app_name: string;
  app_type: AppType;
  app_url: string | null;
  reviewer_name: string;
  review_mode: ReviewMode;
  notes: string | null;
  /** Skor per sub-karakteristik (1–5), key = sub-characteristic id */
  scores: Record<string, ScoreValue | null>;
  /** Catatan opsional per sub-karakteristik */
  comments: Record<string, string>;
  ai_summary: string | null;
  ai_model: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewInsert {
  app_name: string;
  app_type: AppType;
  app_url?: string | null;
  reviewer_name?: string;
  review_mode: ReviewMode;
  notes?: string | null;
  scores: Record<string, ScoreValue | null>;
  comments?: Record<string, string>;
  ai_summary?: string | null;
  ai_model?: string | null;
}

export interface ReviewUpdate {
  app_name?: string;
  app_type?: AppType;
  app_url?: string | null;
  reviewer_name?: string;
  notes?: string | null;
  scores?: Record<string, ScoreValue | null>;
  comments?: Record<string, string>;
  ai_summary?: string | null;
  ai_model?: string | null;
}

export interface CharacteristicScore {
  characteristicId: string;
  name: string;
  nameId: string;
  average: number;
  percentage: number;
  completed: number;
  total: number;
}

export interface ReviewSummary {
  overallAverage: number;
  overallPercentage: number;
  grade: string;
  gradeLabel: string;
  characteristics: CharacteristicScore[];
  completedCount: number;
  totalCount: number;
  isComplete: boolean;
}

export const APP_TYPE_LABELS: Record<AppType, string> = {
  website: "Website",
  mobile: "Aplikasi Mobile",
  desktop: "Aplikasi Desktop",
  other: "Lainnya",
};

export const REVIEW_MODE_LABELS: Record<ReviewMode, string> = {
  manual: "Manual",
  ai: "AI (DeepSeek)",
};
