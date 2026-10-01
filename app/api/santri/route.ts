import { NextResponse } from "next/server";

type SantriRow = { kategori: string; total_siswa: number };
type SantriResponse = { response_code?: string; response_data?: SantriRow[] };

const endpoints = ["getSantriPutra", "getSantriPutri"] as const;

function isSantriResponse(value: unknown): value is SantriResponse {
  if (!value || typeof value !== "object") return false;
  const data = (value as SantriResponse).response_data;
  return Array.isArray(data) && data.every((row) => (
    row && typeof row.kategori === "string" && typeof row.total_siswa === "number"
  ));
}

async function getSantri() {
  const apiKey = process.env.EDUTREN_API_KEY;
  if (!apiKey) return NextResponse.json({ message: "EDUTREN_API_KEY is not configured" }, { status: 503 });

  try {
    const responses = await Promise.all(endpoints.map((endpoint) => fetch(`https://www.edutren.id/api_edutren/${encodeURIComponent(endpoint)}`, {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({}),
      cache: "no-store",
    })));

    if (responses.some((response) => !response.ok)) return NextResponse.json({ message: "Edutren API request failed" }, { status: 502 });

    const payloads: unknown[] = await Promise.all(responses.map((response) => response.json()));
    if (!payloads.every(isSantriResponse)) return NextResponse.json({ message: "Invalid Edutren API response" }, { status: 502 });

    const levels = new Map<string, { putra: number; putri: number }>();
    for (const [index, payload] of payloads.entries()) {
      for (const row of payload.response_data ?? []) {
        const level = levels.get(row.kategori) ?? { putra: 0, putri: 0 };
        level[index === 0 ? "putra" : "putri"] += row.total_siswa;
        levels.set(row.kategori, level);
      }
    }

    const levelData = [...levels].map(([label, value]) => ({ label, ...value, total: value.putra + value.putri }));
    const total = levelData.reduce((sum, value) => sum + value.total, 0);
    const data = levelData.map(({ label, total: value }, index) => ({
      label,
      value: value.toLocaleString("id-ID"),
      note: total ? `${((value / total) * 100).toFixed(1).replace(".", ",")}% dari total` : "0% dari total",
      ...(index === levelData.length - 1 ? { gold: true } : {}),
    }));

    return NextResponse.json({ students: data, levels: levelData });
  } catch {
    return NextResponse.json({ message: "Unable to reach Edutren API" }, { status: 502 });
  }
}

export async function GET() {
  return getSantri();
}

export async function POST() {
  return getSantri();
}