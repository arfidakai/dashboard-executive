"use client";

import type { Period } from "@/src/lib/dashboard-data";
import { useDashboardData } from "@/src/lib/hooks/useDashboardData";
import { Metric, SectionLabel } from "./Primitives";
function FinanceDetail({ financeRows }: { financeRows: ReturnType<typeof useDashboardData<"keuangan">>["data"]["financeRows"] }) { return <div className="finance-table-only"><div className="table-wrap scroll"><table><thead><tr><th>Struktur</th><th>Pendapatan</th><th>Pengeluaran</th><th>Saldo</th></tr></thead><tbody>{financeRows.map((row) => <tr className={row[4]} key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td></tr>)}</tbody></table></div></div>; }
export function FinanceSection({ period }: { period: Period }) { const { data, isFallback } = useDashboardData("keuangan", period); return <section><SectionLabel isFallback={isFallback}>Keuangan</SectionLabel><div className="three kpis">{data.finance.map((item) => <Metric item={item} key={item.label} />)}</div><FinanceDetail financeRows={data.financeRows} /></section>; }
