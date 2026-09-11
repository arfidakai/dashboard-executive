import type { Kpi } from "@/src/lib/dashboard-data";

export function SectionLabel({ children }: { children: React.ReactNode }) { return <div className="section-rule"><p>{children}</p></div>; }
export function Metric({ item }: { item: Kpi }) { return <article className={`kpi-card${item.gold ? " gold" : ""}`}><span>{item.label}</span><strong>{item.value}</strong><small>{item.note}</small></article>; }
