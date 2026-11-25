import { NextResponse } from "next/server";
import { isAuthenticated } from "@/src/lib/auth";
import { getDateTrx, postSignedDateRequest } from "@/src/lib/api/signed-date-request";

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

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const endpoint = process.env.API_SDM_URL || "https://api.idrisiyyah.or.id/sdm/getSdm";

  const keySignature = process.env.KEY_SIGNATURE;
  if (!keySignature) return NextResponse.json({ message: "KEY_SIGNATURE is not configured" }, { status: 503 });

  try {
    const body: unknown = await request.json();
    const response = await postSignedDateRequest(endpoint, keySignature, getDateTrx(body));

    if (!response.ok) return NextResponse.json({ message: "Rekap SDM API request failed" }, { status: 502 });

    const payload: unknown = await response.json();
    if (!isSdmResponse(payload)) return NextResponse.json({ message: "Invalid rekap SDM API response" }, { status: 502 });

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ message: "Unable to reach rekap SDM API" }, { status: 502 });
  }
}
