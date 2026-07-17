import {
  ISO_9126_CHARACTERISTICS,
  type ScoreValue,
} from "@/lib/iso9126";
import type { CharacteristicScore, ReviewSummary } from "@/types/review";

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function scoreToPercentage(score: number, max = 5): number {
  return Math.round((score / max) * 1000) / 10;
}

export function getGrade(percentage: number): { grade: string; label: string } {
  if (percentage >= 90) return { grade: "A", label: "Sangat Baik" };
  if (percentage >= 80) return { grade: "B", label: "Baik" };
  if (percentage >= 70) return { grade: "C", label: "Cukup" };
  if (percentage >= 60) return { grade: "D", label: "Kurang" };
  return { grade: "E", label: "Sangat Kurang" };
}

export function computeReviewSummary(
  scores: Record<string, ScoreValue | null>
): ReviewSummary {
  const characteristics: CharacteristicScore[] = ISO_9126_CHARACTERISTICS.map(
    (char) => {
      const values = char.subCharacteristics
        .map((s) => scores[s.id])
        .filter((v): v is ScoreValue => v !== null && v !== undefined);

      const avg = average(values);
      return {
        characteristicId: char.id,
        name: char.name,
        nameId: char.nameId,
        average: Math.round(avg * 100) / 100,
        percentage: scoreToPercentage(avg),
        completed: values.length,
        total: char.subCharacteristics.length,
      };
    }
  );

  const allValues = Object.values(scores).filter(
    (v): v is ScoreValue => v !== null && v !== undefined
  );
  const totalCount = Object.keys(scores).length;
  const completedCount = allValues.length;
  const overallAverage =
    Math.round(average(allValues) * 100) / 100 || 0;
  const overallPercentage = scoreToPercentage(overallAverage);
  const { grade, label } = getGrade(overallPercentage);

  return {
    overallAverage,
    overallPercentage,
    grade,
    gradeLabel: label,
    characteristics,
    completedCount,
    totalCount,
    isComplete: completedCount === totalCount && totalCount > 0,
  };
}

export function gradeColor(grade: string): string {
  switch (grade) {
    case "A":
      return "text-green-600 bg-green-50 border-green-200";
    case "B":
      return "text-lime-600 bg-lime-50 border-lime-200";
    case "C":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "D":
      return "text-orange-600 bg-orange-50 border-orange-200";
    default:
      return "text-red-600 bg-red-50 border-red-200";
  }
}

export function percentageBarColor(percentage: number): string {
  if (percentage >= 90) return "bg-green-500";
  if (percentage >= 80) return "bg-lime-500";
  if (percentage >= 70) return "bg-yellow-500";
  if (percentage >= 60) return "bg-orange-500";
  return "bg-red-500";
}
