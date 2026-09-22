import { students } from "@/src/lib/dashboard-data";
import type { Period } from "@/src/lib/dashboard-data";

export type SantriData = { students: typeof students };

export const fallback: SantriData = { students };

function isValidPayload(value: unknown): value is SantriData {
  if (!value || typeof value !== "object" || !Array.isArray((value as { students?: unknown }).students)) return false;
  return (value as { students: unknown[] }).students.every((row) => {
    if (!row || typeof row !== "object") return false;
    const item = row as Record<string, unknown>;
    return typeof item.label === "string" && typeof item.value === "string" && typeof item.note === "string" && (item.gold === undefined || typeof item.gold === "boolean");
  });
}

export async function getSantriData(period: Period): Promise<{ data: SantriData; isFallback: boolean }> {
  const endpoint = process.env.NEXT_PUBLIC_API_SANTRI_URL;
  if (!endpoint) return { data: fallback, isFallback: true };

  try {
    const response = await fetch(`${endpoint}?period=${period}`, { cache: "no-store" });
    if (!response.ok) return { data: fallback, isFallback: true };
    const payload: unknown = await response.json();
    return isValidPayload(payload) ? { data: payload, isFallback: false } : { data: fallback, isFallback: true };
  } catch {
    return { data: fallback, isFallback: true };
  }
}
