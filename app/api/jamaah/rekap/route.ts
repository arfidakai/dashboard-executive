import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";

const endpoint = "https://api.idrisiyyah.or.id/jamaah/getRekapJamaah";

type RekapJamaahRow = {
  zawiyah_id?: string;
  zawiyah_nama?: string;
  noid_zawiyah?: string;
  zawiyah?: string;
  rzawiyah_keterangan?: string;
  jml_jamaah: number | string;
  jml_jamaah_suluk: number | string;
};

type RekapJamaahResponse = {
  responseCode?: string;
  responseData?: RekapJamaahRow[];
};

function isRekapJamaahResponse(value: unknown): value is RekapJamaahResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as RekapJamaahResponse;
  return response.responseCode === "200" && Array.isArray(response.responseData) && response.responseData.every((row) => (
    row &&
    (typeof row.zawiyah_id === "string" || typeof row.rzawiyah_keterangan === "string" || typeof row.noid_zawiyah === "string") &&
    (typeof row.zawiyah_nama === "string" || typeof row.zawiyah === "string") &&
    (typeof row.jml_jamaah === "number" || typeof row.jml_jamaah === "string") &&
    (typeof row.jml_jamaah_suluk === "number" || typeof row.jml_jamaah_suluk === "string")
  ));
}

function isDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function POST(request: Request) {
  const key = process.env.KEY_SIGNATURE;
  if (!key) return NextResponse.json({ message: "KEY_SIGNATURE is not configured" }, { status: 503 });

  try {
    const body: unknown = await request.json();
    const dateTrx = body && typeof body === "object" && isDate((body as { date_trx?: unknown }).date_trx)
      ? (body as { date_trx: string }).date_trx
      : new Date().toISOString().slice(0, 10);
    const requestBody = JSON.stringify({ date_trx: dateTrx });
    const signature = createHmac("sha512", key).update(requestBody).digest("hex");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${signature}`,
      },
      body: requestBody,
      cache: "no-store",
    });

    if (!response.ok) return NextResponse.json({ message: "Rekap jamaah API request failed" }, { status: 502 });

    const payload: unknown = await response.json();
    if (!isRekapJamaahResponse(payload)) return NextResponse.json({ message: "Invalid rekap jamaah API response" }, { status: 502 });

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ message: "Unable to reach rekap jamaah API" }, { status: 502 });
  }
}
