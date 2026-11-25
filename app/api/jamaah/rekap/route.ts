import { NextResponse } from "next/server";
import { isAuthenticated } from "@/src/lib/auth";
import { getDateTrx, postSignedDateRequest } from "@/src/lib/api/signed-date-request";

type RekapJamaahRow = {
  zawiyah_id?: string;
  zawiyah_nama?: string;
  noid_zawiyah?: string;
  zawiyah?: string;
  rzawiyah_keterangan?: string;
  jml_jamaah: number | string;
  jml_jamaah_suluk?: number | string;
  jml_muhasabah?: number | string;
  jml_gsubuh?: number | string;
  jml_gmagrib?: number | string;
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
    (row.jml_jamaah_suluk === undefined || typeof row.jml_jamaah_suluk === "number" || typeof row.jml_jamaah_suluk === "string") &&
    (row.jml_muhasabah === undefined || typeof row.jml_muhasabah === "number" || typeof row.jml_muhasabah === "string") &&
    (row.jml_gsubuh === undefined || typeof row.jml_gsubuh === "number" || typeof row.jml_gsubuh === "string") &&
    (row.jml_gmagrib === undefined || typeof row.jml_gmagrib === "number" || typeof row.jml_gmagrib === "string")
  ));
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const endpoint = process.env.API_ZAWIYAH_URL || "https://api.idrisiyyah.or.id/jamaah/getRekapJamaah";

  const key = process.env.KEY_SIGNATURE;
  if (!key) return NextResponse.json({ message: "KEY_SIGNATURE is not configured" }, { status: 503 });

  try {
    const body: unknown = await request.json();
    const response = await postSignedDateRequest(endpoint, key, getDateTrx(body));

    if (!response.ok) return NextResponse.json({ message: "Rekap jamaah API request failed" }, { status: 502 });

    const payload: unknown = await response.json();
    if (!isRekapJamaahResponse(payload)) return NextResponse.json({ message: "Invalid rekap jamaah API response" }, { status: 502 });

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ message: "Unable to reach rekap jamaah API" }, { status: 502 });
  }
}
