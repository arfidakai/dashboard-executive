import { finance, financeRows, institutions } from "@/src/lib/dashboard-data";
import type { Period } from "@/src/lib/dashboard-data";

export type KeuanganData = {
  finance: typeof finance;
  financeRows: typeof financeRows;
  institutions: typeof institutions;
};

export const fallback: KeuanganData = { finance, financeRows, institutions };

function isValidPayload(value: unknown): value is KeuanganData {
  if (!value || typeof value !== "object") return false;
  const payload = value as Partial<KeuanganData>;
  const validKpis = Array.isArray(payload.finance) && payload.finance.every((item) => item && typeof item === "object" && typeof item.label === "string" && typeof item.value === "string" && typeof item.note === "string" && (item.gold === undefined || typeof item.gold === "boolean"));
  const validRows = Array.isArray(payload.financeRows) && payload.financeRows.every((row) => Array.isArray(row) && row.length === 5 && row.every((cell) => typeof cell === "string"));
  const validInstitutions = Array.isArray(payload.institutions) && payload.institutions.every((row) => Array.isArray(row) && row.length === 7 && row.slice(0, 6).every((cell) => typeof cell === "string") && typeof row[6] === "boolean");
  return validKpis && validRows && validInstitutions;
}

export async function getKeuanganData(period: Period): Promise<{ data: KeuanganData; isFallback: boolean }> {
  const endpoint = process.env.NEXT_PUBLIC_API_KEUANGAN_URL;
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
