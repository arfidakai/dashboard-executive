"use client";

import type { Period } from "@/src/lib/dashboard-data";
import { useDashboardData } from "@/src/lib/hooks/useDashboardData";
import { Metric, SectionLabel } from "./Primitives";
export function ZawiyahSection({ period }: { period: Period }) { const { data, isFallback } = useDashboardData("zawiyah", period); return <section><SectionLabel isFallback={isFallback}>Zawiyah</SectionLabel><div className="three kpis"><Metric item={{ label: "Total Zawiyah", value: "12", note: "Zawiyah aktif terdata" }} /><Metric item={{ label: "Total Jamaah", value: "3.870", note: "Jamaah terdaftar" }} /><Metric item={{ label: "Total Suluk", value: "286 peserta", note: "Peserta program", gold: true }} /></div><div className="table-wrap zawiyah-table"><table><caption>Zawiyah dengan Jamaah Terbanyak</caption><thead><tr><th>Zawiyah</th><th>Wilayah</th><th>Jamaah</th><th>Peserta Suluk</th></tr></thead><tbody>{data.zawiyah.map((row, index) => <tr className={index === 0 ? "highlight" : ""} key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div></section>; }
