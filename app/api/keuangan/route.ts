import { NextResponse } from "next/server";
import { isAuthenticated } from "@/src/lib/auth";
import { getKeuanganData } from "@/src/lib/api/keuangan-server";
import type { Period } from "@/src/lib/dashboard-data";

function isPeriod(value: string | null): value is Period {
  return value === "month" || value === "quarter" || value === "year";
}

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const period = new URL(request.url).searchParams.get("period");
  if (!isPeriod(period)) {
    return NextResponse.json({ message: "Invalid period" }, { status: 400 });
  }

  return NextResponse.json(await getKeuanganData(period));
}
