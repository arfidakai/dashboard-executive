import { employees } from "@/src/lib/dashboard-data";

export type SdmData = {
  employees: Array<[string, string, string, string, "directorate"]>;
  totalSdm: number;
  activeSdm: number;
  inactiveSdm: number;
};

const fallbackEmployees: SdmData["employees"] = employees.map((row) => [row[0], row[1], row[2], row[3], "directorate"]);

export const fallback: SdmData = {
  employees: fallbackEmployees,
  totalSdm: 248,
  activeSdm: 239,
  inactiveSdm: 9,
};

function isValidPayload(value: unknown): value is SdmData {
  if (!value || typeof value !== "object") return false;
  const payload = value as Partial<SdmData>;
  return Array.isArray(payload.employees) &&
    typeof payload.totalSdm === "number" &&
    typeof payload.activeSdm === "number" &&
    typeof payload.inactiveSdm === "number" &&
    payload.employees.every((row) => Array.isArray(row) && row.length === 5 && row.every((cell) => typeof cell === "string"));
}

function getJakartaDate() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export async function getSdmData(): Promise<{ data: SdmData; isFallback: boolean }> {
  try {
    const response = await fetch("/api/sdm/rekap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date_trx: getJakartaDate() }),
      cache: "no-store",
    });
    if (!response.ok) return { data: fallback, isFallback: true };
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object" || !Array.isArray((payload as { responseData?: unknown }).responseData)) {
      return { data: fallback, isFallback: true };
    }

    const rows = (payload as { responseData: Array<Record<string, unknown>> }).responseData;
    const data: SdmData = {
      employees: rows
        .filter((row) => typeof row.kompartemen === "string")
        .map((row): SdmData["employees"][number] => [
          row.kompartemen as string,
          String(row.total_sdm ?? 0),
          String(row.aktif ?? 0),
          String(row.tidak_aktif ?? 0),
          "directorate",
        ]),
      totalSdm: rows.reduce((total, row) => total + Number(row.total_sdm ?? 0), 0),
      activeSdm: rows.reduce((total, row) => total + Number(row.aktif ?? 0), 0),
      inactiveSdm: rows.reduce((total, row) => total + Number(row.tidak_aktif ?? 0), 0),
    };

    return isValidPayload(data) ? { data, isFallback: false } : { data: fallback, isFallback: true };
  } catch {
    return { data: fallback, isFallback: true };
  }
}
