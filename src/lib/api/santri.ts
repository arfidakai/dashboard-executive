import { students } from "@/src/lib/dashboard-data";
import type { Period } from "@/src/lib/dashboard-data";

export type SantriLevel = { label: string; total: number; putra: number; putri: number };
export type SantriData = { students: typeof students; levels: SantriLevel[] };

export const fallback: SantriData = {
  students,
  levels: [
    { label: "Dikdas", total: 612, putra: 317, putri: 295 },
    { label: "Dikmen", total: 548, putra: 278, putri: 270 },
    { label: "Dikti", total: 266, putra: 141, putri: 125 },
  ],
};

function isValidPayload(value: unknown): value is SantriData {
  if (!value || typeof value !== "object" || !Array.isArray((value as { students?: unknown }).students) || !Array.isArray((value as { levels?: unknown }).levels)) return false;
  return (value as { students: unknown[] }).students.every((row) => {
    if (!row || typeof row !== "object") return false;
    const item = row as Record<string, unknown>;
    return typeof item.label === "string" && typeof item.value === "string" && typeof item.note === "string" && (item.gold === undefined || typeof item.gold === "boolean");
  });
}

export async function getSantriData(period: Period): Promise<{ data: SantriData; isFallback: boolean }> {
  try {
    const response = await fetch(`/api/santri?period=${period}`, { cache: "no-store" });
    if (!response.ok) return { data: fallback, isFallback: true };
    const payload: unknown = await response.json();
    return isValidPayload(payload) ? { data: payload, isFallback: false } : { data: fallback, isFallback: true };
  } catch {
    return { data: fallback, isFallback: true };
  }
}
