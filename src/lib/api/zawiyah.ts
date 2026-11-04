import { zawiyah } from "@/src/lib/dashboard-data";

export type ZawiyahData = {
  zawiyah: Array<[string, string, string, string]>;
  totalZawiyah: number;
  totalJamaah: number;
  totalSuluk: number;
};

type RekapJamaahRow = {
  zawiyah_id?: unknown;
  zawiyah_nama?: unknown;
  noid_zawiyah?: unknown;
  zawiyah?: unknown;
  rzawiyah_keterangan?: unknown;
  jml_jamaah?: unknown;
  jml_jamaah_suluk?: unknown;
};

const fallbackRows: Array<[string, string, string, string]> = zawiyah.map((row) => [row[0], row[1], row[2], row[3]]);

export const fallback: ZawiyahData = {
  zawiyah: fallbackRows,
  totalZawiyah: 12,
  totalJamaah: 3870,
  totalSuluk: 286,
};

function isValidPayload(value: unknown): value is ZawiyahData {
  if (!value || typeof value !== "object") return false;
  const payload = value as Partial<ZawiyahData>;
  return Array.isArray(payload.zawiyah) &&
    typeof payload.totalZawiyah === "number" &&
    typeof payload.totalJamaah === "number" &&
    typeof payload.totalSuluk === "number" &&
    payload.zawiyah.every((row) => Array.isArray(row) && row.length === 4 && row.every((cell) => typeof cell === "string"));
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

function toNumber(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

export async function getZawiyahData(): Promise<{ data: ZawiyahData; isFallback: boolean }> {
  try {
    const response = await fetch("/api/jamaah/rekap", {
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

    const rows = (payload as { responseData: RekapJamaahRow[] }).responseData
      .map((row) => {
        const jamaah = toNumber(row.jml_jamaah);
        const suluk = toNumber(row.jml_jamaah_suluk);
        const name = typeof row.zawiyah_nama === "string" ? row.zawiyah_nama : row.zawiyah;
        const id = typeof row.zawiyah_id === "string"
          ? row.zawiyah_id
          : typeof row.rzawiyah_keterangan === "string"
            ? row.rzawiyah_keterangan
            : row.noid_zawiyah;
        if (typeof name !== "string" || typeof id !== "string" || jamaah === null || suluk === null) {
          return null;
        }
        return { name, id, jamaah, suluk };
      })
      .filter((row): row is { name: string; id: string; jamaah: number; suluk: number } => row !== null);
    const data: ZawiyahData = {
      zawiyah: rows
        .map((row): [string, string, string, string] => [
          row.name,
          row.id,
          row.jamaah.toLocaleString("id-ID"),
          row.suluk.toLocaleString("id-ID"),
        ])
        .sort((left, right) => Number(right[2].replace(/\./g, "")) - Number(left[2].replace(/\./g, ""))),
      totalZawiyah: rows.length,
      totalJamaah: rows.reduce((total, row) => total + row.jamaah, 0),
      totalSuluk: rows.reduce((total, row) => total + row.suluk, 0),
    };

    return isValidPayload(data) ? { data, isFallback: false } : { data: fallback, isFallback: true };
  } catch {
    return { data: fallback, isFallback: true };
  }
}
