import { zawiyah } from "@/src/lib/dashboard-data";
import type { Period } from "@/src/lib/dashboard-data";

export type ZawiyahData = { zawiyah: typeof zawiyah };

export const fallback: ZawiyahData = { zawiyah };

function isValidPayload(value: unknown): value is ZawiyahData {
  if (!value || typeof value !== "object" || !Array.isArray((value as { zawiyah?: unknown }).zawiyah)) return false;
  return (value as { zawiyah: unknown[] }).zawiyah.every((row) => Array.isArray(row) && row.length === 4 && row.every((cell) => typeof cell === "string"));
}

export async function getZawiyahData(period: Period): Promise<{ data: ZawiyahData; isFallback: boolean }> {
  const endpoint = process.env.NEXT_PUBLIC_API_ZAWIYAH_URL;
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
