import { fallback, isValidPayload, october2026, type KeuanganData } from "@/src/lib/api/keuangan";
import type { Period } from "@/src/lib/dashboard-data";

export async function getKeuanganData(period: Period): Promise<{ data: KeuanganData; isFallback: boolean }> {
  const endpoint = process.env.NEXT_PUBLIC_API_KEUANGAN_URL;
  if (!endpoint) {
    return period === "month"
      ? { data: october2026, isFallback: false }
      : { data: fallback, isFallback: true };
  }

  try {
    const response = await fetch(`${endpoint}?period=${period}`, { cache: "no-store" });
    if (!response.ok) return { data: fallback, isFallback: true };
    const payload: unknown = await response.json();
    return isValidPayload(payload) ? { data: payload, isFallback: false } : { data: fallback, isFallback: true };
  } catch {
    return { data: fallback, isFallback: true };
  }
}
