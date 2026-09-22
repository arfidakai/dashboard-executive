import type { Kpi } from "@/src/lib/dashboard-data";

export function SectionLabel({ children, isFallback = false }: { children: React.ReactNode; isFallback?: boolean }) { return <div className="section-rule"><p>{children}</p>{isFallback && <span className="data-demo-badge">Data demo</span>}</div>; }
export function Metric({ item }: { item: Kpi }) { return <article className={`kpi-card${item.gold ? " gold" : ""}`}><span>{item.label}</span><strong>{item.value}</strong><small>{item.note}</small></article>; }
