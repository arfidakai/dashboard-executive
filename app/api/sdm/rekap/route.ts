import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";

const endpoint = "https://api.idrisiyyah.or.id/sdm/getSdm";

type SdmRow = {
  id_kompartemen: string;
  kompartemen: string;
  total_sdm: number | string;
  aktif: number | string;
  tidak_aktif: number | string;
};

type SdmResponse = {
  responseCode?: string;
  responseData?: SdmRow[];
};

function isSdmResponse(value: unknown): value is SdmResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as SdmResponse;
  return response.responseCode === "200" && Array.isArray(response.responseData) && response.responseData.every((row) => (
    row &&
    typeof row.id_kompartemen === "string" &&
    typeof row.kompartemen === "string" &&
    (typeof row.total_sdm === "number" || typeof row.total_sdm === "string") &&
    (typeof row.aktif === "number" || typeof row.aktif === "string") &&
    (typeof row.tidak_aktif === "number" || typeof row.tidak_aktif === "string")
  ));
}

function isDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function POST(request: Request) {
  const keySignature = process.env.KEY_SIGNATURE;
  if (!keySignature) return NextResponse.json({ message: "KEY_SIGNATURE is not configured" }, { status: 503 });

  try {
    const body: unknown = await request.json();
    const dateTrx = body && typeof body === "object" && isDate((body as { date_trx?: unknown }).date_trx)
      ? (body as { date_trx: string }).date_trx
      : new Date().toISOString().slice(0, 10);
    const requestBody = JSON.stringify({ date_trx: dateTrx });
    const signature = createHmac("sha512", keySignature).update(requestBody).digest("hex");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${signature}`,
      },
      body: requestBody,
      cache: "no-store",
    });

    if (!response.ok) return NextResponse.json({ message: "Rekap SDM API request failed" }, { status: 502 });

    const payload: unknown = await response.json();
    if (!isSdmResponse(payload)) return NextResponse.json({ message: "Invalid rekap SDM API response" }, { status: 502 });

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ message: "Unable to reach rekap SDM API" }, { status: 502 });
  }
}
