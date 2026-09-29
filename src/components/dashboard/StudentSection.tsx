"use client";

import type { Period } from "@/src/lib/dashboard-data";
import { useDashboardData } from "@/src/lib/hooks/useDashboardData";
import { Metric, SectionLabel } from "./Primitives";
export function StudentSection({ period }: { period: Period }) {
	const { data, isFallback } = useDashboardData("santri", period);
	const total = data.levels.reduce((sum, level) => sum + level.total, 0);
	const totalPutra = data.levels.reduce((sum, level) => sum + level.putra, 0);
	const totalPutri = data.levels.reduce((sum, level) => sum + level.putri, 0);

	return <section><SectionLabel isFallback={isFallback}>Santri</SectionLabel><div className="three kpis">{data.students.map((item) => <Metric item={item} key={item.label} />)}</div><div className="compact-grid"><div className="table-wrap"><table><thead><tr><th>Jenjang</th><th>Jumlah</th><th>Putra</th><th>Putri</th><th>Persentase</th></tr></thead><tbody>{data.levels.map((level) => <tr key={level.label}><td>{level.label}</td><td>{level.total.toLocaleString("id-ID")}</td><td>{level.putra.toLocaleString("id-ID")}</td><td>{level.putri.toLocaleString("id-ID")}</td><td>{total ? `${((level.total / total) * 100).toFixed(1).replace(".", ",")}%` : "0%"}</td></tr>)}<tr className="sector"><td>Total</td><td>{total.toLocaleString("id-ID")}</td><td>{totalPutra.toLocaleString("id-ID")}</td><td>{totalPutri.toLocaleString("id-ID")}</td><td>100%</td></tr></tbody></table></div><div className="composition"><h3>Komposisi Santri per Jenjang</h3>{data.levels.map((level, index) => <div className="composition-row" key={level.label}><span>{level.label}</span><i><em className={index === data.levels.length - 1 ? "gold-bar" : ""} style={{ width: `${total ? (level.total / total) * 100 : 0}%` }} /></i><b>{level.total.toLocaleString("id-ID")}</b></div>)}</div></div></section>;
}

