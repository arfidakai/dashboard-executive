import { finance, financeRows, institutions, type Kpi } from "@/src/lib/dashboard-data";
import type { Period } from "@/src/lib/dashboard-data";

export type KeuanganData = {
  finance: Kpi[];
  financeRows: readonly (readonly [string, string, string, string, string, string?, string?])[];
  institutions: readonly (readonly [string, string, string, string, string, string, boolean])[];
};

export const fallback: KeuanganData = { finance, financeRows, institutions };

export const october2026: KeuanganData = {
  finance: [
    { label: "Total Penerimaan", value: "Rp 493.548.034", note: "Zakat, infak, dan sedekah" },
    { label: "Total Penyaluran", value: "Rp 242.805.838", note: "Seluruh dana tersalurkan" },
    { label: "Saldo Akhir", value: "Rp 296.144.411", note: "Per 31 Oktober 2026", gold: true },
  ],
  financeRows: [
    ["Zakat", "Rp 33.580.118", "Rp 8.739.836", "Rp 24.840.282", "Rp 39.515.907", "Rp 64.356.189", "sector"],
    ["Infak dan Sedekah", "Rp 459.967.916", "Rp 234.066.002", "Rp 225.901.914", "Rp 5.886.308", "Rp 231.788.222", "sector"],
  ],
  institutions: [
    ["Agnia Care", "Rp 493.548.034", "Rp 0", "Rp 242.805.838", "Rp 250.742.196", "50,8%", true],
  ],
};

export function isValidPayload(value: unknown): value is KeuanganData {
  if (!value || typeof value !== "object") return false;
  const payload = value as Partial<KeuanganData>;
  const validKpis = Array.isArray(payload.finance) && payload.finance.every((item) => item && typeof item === "object" && typeof item.label === "string" && typeof item.value === "string" && typeof item.note === "string" && (item.gold === undefined || typeof item.gold === "boolean"));
  const validRows = Array.isArray(payload.financeRows) && payload.financeRows.every((row) => Array.isArray(row) && (row.length === 5 || row.length === 7) && row.every((cell) => typeof cell === "string"));
  const validInstitutions = Array.isArray(payload.institutions) && payload.institutions.every((row) => Array.isArray(row) && row.length === 7 && row.slice(0, 6).every((cell) => typeof cell === "string") && typeof row[6] === "boolean");
  return validKpis && validRows && validInstitutions;
}

export async function getKeuanganData(period: Period): Promise<{ data: KeuanganData; isFallback: boolean }> {
  try {
    const response = await fetch(`/api/keuangan?period=${period}`, { cache: "no-store" });
    if (!response.ok) return { data: fallback, isFallback: true };
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object") return { data: fallback, isFallback: true };

    const result = payload as { data?: unknown; isFallback?: unknown };
    return isValidPayload(result.data) && typeof result.isFallback === "boolean"
      ? { data: result.data, isFallback: result.isFallback }
      : { data: fallback, isFallback: true };
  } catch {
    return { data: fallback, isFallback: true };
  }
}
