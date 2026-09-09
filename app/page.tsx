"use client";

import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  GraduationCap,
  HeartHandshake,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";

type Period = "month" | "quarter" | "year";
type Section = "sdm" | "keuangan" | "santri" | "zawiyah";

const periodLabels: Record<Period, string> = { month: "Bulan ini", quarter: "Kuartal ini", year: "Tahun ini" };
const datasets = {
  month: { sdm: [428, 403], finance: [2460, 1870], students: [1284, 976, 418], zawiyah: [3842, 286, 86], units: [112, 86, 74, 59, 46], income: [680, 530, 470, 420, 360], expense: [490, 390, 365, 332, 293], trend: [3220, 3310, 3405, 3510, 3660, 3842] },
  quarter: { sdm: [436, 414], finance: [7280, 5610], students: [1302, 991, 426], zawiyah: [4018, 312, 88], units: [115, 89, 76, 62, 48], income: [2010, 1570, 1430, 1260, 1010], expense: [1500, 1190, 1080, 1015, 825], trend: [3340, 3470, 3610, 3760, 3890, 4018] },
  year: { sdm: [452, 431], finance: [28750, 22120], students: [1330, 1024, 442], zawiyah: [4365, 368, 90], units: [121, 93, 81, 65, 51], income: [7920, 6300, 5480, 4820, 4230], expense: [6120, 4950, 4300, 3700, 3050], trend: [3560, 3710, 3890, 4040, 4215, 4365] },
};
const unitNames = ["Pendidikan", "Usaha Produktif", "Layanan Santri", "Operasional", "Zawiyah"];
const sulukZawiyahRows = [
  { name: "PUSAT", jamaah: 456, mengisi: 6, suluk: 92.5 },
  { name: "Tangerang", jamaah: 60, mengisi: 5, suluk: 96.2 },
  { name: "UMUM", jamaah: 222, mengisi: 5, suluk: 85.5 },
  { name: "Jepara Kudus Jawa Tengah", jamaah: 25, mengisi: 3, suluk: 100 },
  { name: "Utama Jakarta", jamaah: 113, mengisi: 2, suluk: 90.5 },
  { name: "Bandung Kota", jamaah: 12, mengisi: 2, suluk: 95 },
  { name: "Kaliwungu Kendal Jawa Tengah", jamaah: 6, mengisi: 1, suluk: 70 },
  { name: "Cinta Garut", jamaah: 36, mengisi: 1, suluk: 100 },
  { name: "Serpong Tangerang Selatan", jamaah: 19, mengisi: 1, suluk: 70 },
];
const sulukProgramRows = [
  { name: "Subuh & Syuruq", realization: "34/1,737", progress: 2 },
  { name: "Maghrib & Isya", realization: "34/1,737", progress: 2 },
];
const employeeRows = [
  { photo: "AR", nip: "198706122014011001", name: "Ahmad Rizki", address: "Jakarta Selatan", status: "Aktif" },
  { photo: "FN", nip: "198904182015022002", name: "Fajar Nugraha", address: "Tangerang Selatan", status: "Aktif" },
  { photo: "SA", nip: "199102252016031003", name: "Siti Aisyah", address: "Bandung Kota", status: "Aktif" },
  { photo: "MI", nip: "198512032012041004", name: "Muhammad Irfan", address: "Depok", status: "Aktif" },
  { photo: "NL", nip: "199305142018052005", name: "Nur Laili", address: "Bekasi", status: "Aktif" },
  { photo: "RA", nip: "198811092013061006", name: "Rafi Ahmad", address: "Bogor", status: "Aktif" },
  { photo: "HA", nip: "199006212017071007", name: "Hana Amalia", address: "Garut", status: "Aktif" },
  { photo: "ZK", nip: "198709302014081008", name: "Zaki Kurniawan", address: "Kaliwungu", status: "Aktif" },
  { photo: "DM", nip: "199110112016091009", name: "Dina Maharani", address: "Serpong", status: "Aktif" },
];
const navItems = [
  { id: "sdm" as Section, label: "SDM", Icon: UsersRound },
  { id: "keuangan" as Section, label: "Keuangan", Icon: WalletCards },
  { id: "santri" as Section, label: "Santri", Icon: GraduationCap },
  { id: "zawiyah" as Section, label: "Zawiyah", Icon: HeartHandshake },
];

function formatNumber(value: number) { return value.toLocaleString("id-ID"); }
function formatIdr(million: number) { return million >= 1000 ? `Rp${(million / 1000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} M` : `Rp${formatNumber(million)} Jt`; }

function Metric({ label, value, note, tone = "plain" }: { label: string; value: string; note: string; tone?: "plain" | "mint" | "sand" }) {
  return <article className={`metric-card ${tone}`}><p className="metric-label">{label}</p><p className="metric-value">{value}</p><p className="metric-note">{note}</p></article>;
}

function BarChart({ values, colors, summary, format = formatNumber }: { values: number[]; colors: string[]; summary: string; format?: (value: number) => string }) {
  const max = Math.max(...values);
  return <><div className="bar-chart" aria-label="Grafik batang perbandingan data" role="img">{values.map((value, index) => <div className="bar-point" key={unitNames[index]} tabIndex={0}><div className="tooltip">{unitNames[index]}: {format(value)}</div><div className="bar" style={{ height: `${Math.max(12, value / max * 100)}%`, background: colors[index % colors.length] }} /><span>{unitNames[index].split(" ")[0]}</span></div>)}</div><p className="chart-summary">{summary}</p></>;
}

function DataRows({ values, finance = false }: { values: number[]; finance?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const names = ["Direktorat Pendidikan", "Direktorat Usaha", "Direktorat Layanan"];
  return <tbody>{names.map((name, index) => {
    const total = finance ? values[index] : values[index] + index * 20;
    const active = finance ? Math.round(total * .72) : Math.round(total * .94);
    const formatter = finance ? formatIdr : formatNumber;
    const isOpen = open === index;
    return <>{<tr className="expandable-row" onClick={() => setOpen(isOpen ? null : index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setOpen(isOpen ? null : index); }} tabIndex={0} aria-expanded={isOpen} key={`${name}-main`}><td><span className="row-chevron">{isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</span>{name}</td><td>{formatter(total)}</td><td>{formatter(active)}</td>{!finance && <td>{formatter(total - active)}</td>}</tr>}{isOpen && <><tr className="detail-row"><td>Unit {index === 0 ? "Pendidikan Formal" : "Utama"}</td><td>{formatter(Math.round(total * .57))}</td><td>{formatter(Math.round(active * .58))}</td>{!finance && <td>{formatter(Math.round(total * .57) - Math.round(active * .58))}</td>}</tr><tr className="detail-row"><td>Unit {index === 0 ? "Pengasuhan" : "Pendukung"}</td><td>{formatter(total - Math.round(total * .57))}</td><td>{formatter(active - Math.round(active * .58))}</td>{!finance && <td>{formatter(total - Math.round(total * .57) - (active - Math.round(active * .58)))}</td>}</tr></>}</>;
  })}</tbody>;
}

export default function Home() {
  const [section, setSection] = useState<Section>("sdm");
  const [period, setPeriod] = useState<Period>("month");
  const [financeMode, setFinanceMode] = useState<"income" | "expense">("income");
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState(false);
  const data = datasets[period];
  const showToast = () => { setToast(true); window.setTimeout(() => setToast(false), 3000); };
  const studentTotal = data.students.reduce((sum, value) => sum + value, 0);
  const chartValues = financeMode === "income" ? data.income : data.expense;

  return <div className="app-shell">
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand-row"><div className="brand-mark">◆</div><div className="brand-copy"><strong>Pesantren</strong><span>Ruang eksekutif</span></div></div>
      <p className="sidebar-caption">Menu Utama</p>
      <nav aria-label="Navigasi utama">{navItems.map(({ id, label, Icon }) => <button key={id} className={`nav-item ${section === id ? "active" : ""}`} onClick={() => setSection(id)} aria-current={section === id ? "page" : undefined}><Icon size={20} /><span>{label}</span></button>)}</nav>
      <div className="sidebar-bottom"><div className="demo-card"><CircleHelp size={16} /><span>Tampilan data demo</span></div><button className="collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Buka navigasi" : "Ciutkan navigasi"}>{collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}<span>{collapsed ? "" : "Ciutkan"}</span></button></div>
    </aside>
    <div className={`main-shell ${collapsed ? "collapsed" : ""}`}>
      <header className="topbar"><div className="header-identity"><i /><div><strong>Pesantren</strong><span>Ringkasan organisasi internal</span></div></div><div className="header-actions"><select value={period} onChange={(event) => setPeriod(event.target.value as Period)} aria-label="Pilih periode laporan">{Object.entries(periodLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button className="report-button" onClick={showToast}>Laporan</button><div className="profile"><b>AR</b><div><strong>Ahmad Rizki</strong><span>Pimpinan</span></div></div></div></header>
      <main className="content"><div className="page-heading"><div><div className="breadcrumb"><LayoutDashboard size={16} /> Ringkasan <span>/</span> <b>{navItems.find((item) => item.id === section)?.label}</b></div><h1>Executive Dashboard</h1></div><div className="period-badge"><CalendarDays size={16} /> {periodLabels[period]}</div></div>
        {section === "sdm" && <SdmOverview data={data} period={period} />}
        {section === "keuangan" && <section className="dashboard-view"><SectionHeading title="Keuangan" copy="Ikhtisar arus dana dan posisi saldo per unit usaha." /><div className="metrics"><Metric tone="mint" label="Total Pendapatan" value={formatIdr(data.finance[0])} note="Akumulasi pada periode dipilih" /><Metric label="Total Pengeluaran" value={formatIdr(data.finance[1])} note="Belanja operasional dan program" /><Metric tone="sand" label="Saldo" value={formatIdr(data.finance[0] - data.finance[1])} note="Posisi bersih setelah pengeluaran" /></div><div className="panel-grid"><Panel title="Rincian Keuangan Direktoral"><table><thead><tr><th>Direktorat / Unit Usaha</th><th>Pendapatan</th><th>Pengeluaran</th></tr></thead><DataRows values={data.income} finance /></table></Panel><Panel title="Perbandingan per Unit" copy="Pilih indikator untuk melihat perbandingan."><div className="toggle"><button className={financeMode === "income" ? "selected" : ""} onClick={() => setFinanceMode("income")}>Pendapatan</button><button className={financeMode === "expense" ? "selected" : ""} onClick={() => setFinanceMode("expense")}>Pengeluaran</button></div><BarChart values={chartValues} format={formatIdr} colors={financeMode === "income" ? ["#4f9b72", "#70b68f", "#99caa9", "#c99844", "#174c3a"] : ["#c99844", "#d6ad66", "#e5ca99", "#4f9b72", "#174c3a"]} summary={`Perbandingan ${financeMode === "income" ? "pendapatan" : "pengeluaran"} per unit usaha. Nilai terbesar: ${formatIdr(Math.max(...chartValues))} (data demo).`} /></Panel></div></section>}
        {section === "santri" && <section className="dashboard-view"><SectionHeading title="Santri" copy="Komposisi santri berdasarkan jenjang pendidikan." /><div className="metrics"><Metric tone="mint" label="Dikdas" value={formatNumber(data.students[0])} note="Pendidikan dasar" /><Metric label="Dikmen" value={formatNumber(data.students[1])} note="Pendidikan menengah" /><Metric tone="sand" label="Dikti" value={formatNumber(data.students[2])} note="Pendidikan tinggi" /></div><div className="panel-grid student-grid"><Panel title="Komposisi Jenjang" copy="Proporsi total santri per jenjang."><div className="donut" style={{ background: `conic-gradient(#4f9b72 0deg ${data.students[0] / studentTotal * 360}deg, #c99844 ${data.students[0] / studentTotal * 360}deg ${(data.students[0] + data.students[1]) / studentTotal * 360}deg, #174c3a ${(data.students[0] + data.students[1]) / studentTotal * 360}deg 360deg)` }}><div><strong>{formatNumber(studentTotal)}</strong><span>total santri</span></div></div><div className="legend">{["Dikdas", "Dikmen", "Dikti"].map((label, index) => <div key={label}><span><i style={{ background: ["#4f9b72", "#c99844", "#174c3a"][index] }} />{label}</span><b>{formatNumber(data.students[index])} <small>({Math.round(data.students[index] / studentTotal * 100)}%)</small></b></div>)}</div></Panel><Panel title="Rincian Santri"><table><thead><tr><th>Jenjang</th><th>Total Santri</th><th>Putra</th><th>Putri</th></tr></thead><tbody>{["Dikdas", "Dikmen", "Dikti"].map((label, index) => <tr key={label}><td>{label}</td><td>{formatNumber(data.students[index])}</td><td>{formatNumber(Math.round(data.students[index] * .52))}</td><td>{formatNumber(Math.round(data.students[index] * .48))}</td></tr>)}</tbody></table></Panel></div></section>}
        {section === "zawiyah" && <section className="dashboard-view zawiyah-dashboard"><SectionHeading title="Dashboard Jemaah" copy="Data jemaah yang mengisi aplikasi Suluk." /><div className="metrics zawiyah-metrics"><Metric label="Total Zawiyah" value="79" note="Zawiyah aktif terdata" /><Metric label="Total Jemaah" value="1.895" note="Jemaah terdaftar" /><Metric label="Jemaah Dewasa" value="1.737" note="91,7% dari total jemaah" /><Metric label="Jemaah Remaja" value="158" note="8,3% dari total jemaah" /><Metric label="Total Jemaah Mengisi" value="34" note="Pengisi aplikasi Suluk" /></div><div className="zawiyah-content-grid"><Panel title="Data Skor Zawiyah" copy="Skor rata-rata per zawiyah dari isian aplikasi Suluk (klik header untuk mengurutkan)."><table className="score-table"><thead><tr><th>ZAWIYAH ↕</th><th>JUMLAH JEMAAH ↕</th><th>SUDAH MENGERJAKAN ▼</th><th>AVG TAKHALLI ↕</th><th>AVG TAHALLI ↕</th><th>AVG TAJALLI ↕</th><th>AVG SULUK ↕</th></tr></thead><tbody>{sulukZawiyahRows.map((row) => <tr key={row.name}><td>{row.name}</td><td>{formatNumber(row.jamaah)}</td><td className="score-red"><b>{row.mengisi}</b><small>({Math.round(row.mengisi / row.jamaah * 100)}%)</small></td><td className="score-red">0.0</td><td className="score-red">0.0</td><td className="score-red">0.0</td><td className={row.suluk >= 80 ? "score-green" : "score-blue"}>{row.suluk.toFixed(1)}</td></tr>)}</tbody><tfoot><tr><td colSpan={7}>Total 79 zawiyah • Data diperbarui secara real-time dari aplikasi Suluk</td></tr></tfoot></table></Panel><div className="zawiyah-side-panels"><Panel title="Perbandingan Rata-rata Skor" copy="Rata-rata skor keseluruhan jemaah per muhasabah"><ScoreChart /></Panel><Panel title="Data Program Gamis"><div className="program-table"><div><b>PROGRAM</b><b>REALISASI</b><b>PROGRESS</b></div>{sulukProgramRows.map((program) => <div key={program.name}><span>{program.name}</span><span>{program.realization}</span><span className="progress-cell"><i><em style={{ width: `${program.progress}%` }} /></i>{program.progress}%</span></div>)}</div></Panel></div></div></section>}
        <footer>Pembaruan terakhir: data demo • Nilai ditampilkan untuk keperluan ilustrasi internal.</footer>
      </main>
    </div>
    {toast && <div className="toast"><CheckCircle2 size={19} /> Permintaan laporan dicatat. Kontrol ini hanya menampilkan konfirmasi data demo.</div>}
  </div>;
}

function SectionHeading({ title, copy }: { title: string; copy: string }) { return <div className="section-heading"><div><h2>{title}</h2><p>{copy}</p></div><span>Data demo</span></div>; }
function Panel({ title, copy, hint, children }: { title: string; copy?: string; hint?: string; children: React.ReactNode }) { return <section className="panel"><div className="panel-heading"><div><h3>{title}</h3>{copy && <p>{copy}</p>}</div>{hint && <span>{hint}</span>}</div>{children}</section>; }
function SdmOverview({ data, period }: { data: (typeof datasets)[Period]; period: Period }) {
  const [selectedDirectorate, setSelectedDirectorate] = useState<string | null>(null);
  const directorates = ["Direktorat Pendidikan", "Direktorat Usaha", "Direktorat Layanan"];
  return <section className="dashboard-view"><SectionHeading title="Sumber Daya Manusia" copy="Ringkasan struktur dan sebaran tenaga kerja pesantren." /><div className="metrics"><Metric label="Total Karyawan" value={formatNumber(data.sdm[0])} note="Pada seluruh direktorat" /><Metric tone="mint" label="Karyawan Aktif" value={formatNumber(data.sdm[1])} note={`${(data.sdm[1] / data.sdm[0] * 100).toFixed(1).replace(".", ",")}% dari total karyawan`} /><Metric tone="sand" label="Direktorat Terpantau" value={period === "year" ? "6" : "5"} note="Dengan unit usaha terkait" /></div><div className="panel-grid"><Panel title="Struktur Direktoral" hint="Klik direktorat untuk rincian"><table><thead><tr><th>Direktorat / Unit Usaha</th><th>Total</th><th>Aktif</th><th>Nonaktif</th></tr></thead><tbody>{directorates.map((name, index) => { const total = data.units[index] + index * 20; const active = Math.round(total * .94); return <tr className="directorate-row" key={name} onClick={() => setSelectedDirectorate(name)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedDirectorate(name); }} tabIndex={0}><td><span className="row-chevron"><ChevronRight size={15} /></span>{name}</td><td>{formatNumber(total)}</td><td>{formatNumber(active)}</td><td>{formatNumber(total - active)}</td></tr>; })}</tbody></table></Panel><Panel title="Sebaran Karyawan per Unit" copy="Perbandingan total personel menurut unit utama."><BarChart values={data.units} colors={["#4f9b72", "#6db28a", "#92c9a9", "#c99844", "#174c3a"]} summary={`Unit Pendidikan memiliki jumlah karyawan tertinggi: ${formatNumber(data.units[0])} orang (data demo).`} /></Panel></div>{selectedDirectorate && <EmployeeDrawer directorate={selectedDirectorate} onClose={() => setSelectedDirectorate(null)} />}</section>;
}
function EmployeeDrawer({ directorate, onClose }: { directorate: string; onClose: () => void }) { return <><button className="drawer-backdrop" aria-label="Tutup detail direktorat" onClick={onClose} /><aside className="employee-drawer"><div className="drawer-header"><div><span>Detail direktorat</span><h2>{directorate}</h2></div><button className="drawer-close" onClick={onClose} aria-label="Tutup detail"><X size={18} /></button></div><div className="drawer-stats"><div><b>{employeeRows.length}</b><span>Total pegawai</span></div><div><b>{employeeRows.length}</b><span>Aktif</span></div></div><div className="drawer-content"><div className="hr-heading"><div><h3>Data Pegawai</h3><p>Data pegawai read-only dari CMS HR.</p></div></div><EmployeeTable /></div></aside></>; }
function EmployeeTable() {
  const [query, setQuery] = useState("");
  const filteredRows = employeeRows.filter((employee) => `${employee.nip} ${employee.name} ${employee.address}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="employee-panel"><div className="employee-toolbar"><label htmlFor="employee-search">Filter:</label><div className="employee-search"><input id="employee-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ketik untuk mencari..." /><Search size={15} /></div><label className="show-label" htmlFor="employee-count">Show:</label><select id="employee-count" defaultValue="10"><option value="10">10</option><option value="25">25</option><option value="50">50</option></select></div><div className="employee-table-wrap"><table className="employee-table"><thead><tr><th>Foto</th><th>NIP ↕</th><th>Nama ↕</th><th>Alamat</th><th>Status Jabatan</th></tr></thead><tbody>{filteredRows.map((employee) => <tr key={employee.nip}><td><span className="employee-avatar">{employee.photo}</span></td><td>{employee.nip}</td><td className="employee-name">{employee.name}</td><td>{employee.address}</td><td><span className="status-active">{employee.status}</span></td></tr>)}</tbody></table></div><div className="employee-footer"><span>Showing 1 to {filteredRows.length} of {employeeRows.length} entries</span><div className="pagination"><button disabled>First</button><button disabled>‹</button><button className="current-page">1</button><button disabled>›</button><button disabled>Last</button></div></div></section>;
}
function ScoreChart() { const scores = [{ label: "Suluk", value: 90 }, { label: "Tahalli", value: 0 }, { label: "Takhalli", value: 0 }, { label: "Tajalli", value: 0 }]; return <div className="score-chart" aria-label="Grafik rata-rata skor Suluk, Tahalli, Takhalli, dan Tajalli" role="img"><div className="score-axis"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="score-bars">{scores.map((score) => <div className="score-bar-item" key={score.label}><div className="score-bar" style={{ height: `${Math.max(score.value, 0)}%` }}><b>{score.value || ""}</b></div><span>{score.label}</span></div>)}</div></div>; }
