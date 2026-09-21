import Image from "next/image";
import type { Period } from "@/src/lib/dashboard-data";

export function DashboardHeader({ period, periods, onPeriodChange, onReport, onDomainSelect }: { period: Period; periods: Record<Period, string>; onPeriodChange: (period: Period) => void; onReport: () => void; onDomainSelect: (index: number) => void }) {
  return <header className="topbar"><div className="inner topbar-content"><div className="brand"><Image src="/Logo Tarekat Idrisiyyah - Ijo.png" alt="Tarekat Idrisiyyah" width={168} height={46} priority /></div><div className="header-title"><span>Ringkasan manajemen</span><h1>Executive Dashboard</h1></div><div className="meta"><select value={period} onChange={(event) => onPeriodChange(event.target.value as Period)} aria-label="Pilih periode">{Object.entries(periods).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select><button onClick={onReport}>Laporan</button>
  </div>
  </div><nav className="inner domain-nav" aria-label="Navigasi domain"><button onClick={() => onDomainSelect(1)} type="button">SDM</button><button onClick={() => onDomainSelect(2)} type="button">Keuangan</button><button onClick={() => onDomainSelect(3)} type="button">Santri</button><button onClick={() => onDomainSelect(4)} type="button">Zawiyah</button></nav>
  </header>;
}
