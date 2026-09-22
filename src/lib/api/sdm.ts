import { employees } from "@/src/lib/dashboard-data";
import type { Period } from "@/src/lib/dashboard-data";

export type SdmData = { employees: typeof employees };

export const fallback: SdmData = { employees };

function isValidPayload(value: unknown): value is SdmData {
  if (!value || typeof value !== "object" || !Array.isArray((value as { employees?: unknown }).employees)) return false;
  return (value as { employees: unknown[] }).employees.every((row) => Array.isArray(row) && row.length === 5 && row.every((cell) => typeof cell === "string"));
}

export async function getSdmData(period: Period): Promise<{ data: SdmData; isFallback: boolean }> {
  const endpoint = process.env.NEXT_PUBLIC_API_SDM_URL;
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
