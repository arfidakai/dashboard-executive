"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import {
  DashboardHeader,
  DashboardSlider,
  EmployeeSection,
  FinanceSection,
  InstitutionSection,
  Metric,
  StudentSection,
  ZawiyahSection,
} from "@/src/components/dashboard";
import { periods, Period, summary } from "@/src/lib/dashboard-data";
import { useDashboardData } from "@/src/lib/hooks/useDashboardData";

export default function Dashboard() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("month");
  const [activeSlide, setActiveSlide] = useState(0);
  const [toast, setToast] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const { data: santriData } = useDashboardData("santri", period);
  const totalSantri = santriData.levels.reduce((total, level) => total + level.total, 0).toLocaleString("id-ID");
  const summaryWithLiveSantri = summary.map((item) => item.label === "Total Santri" ? { ...item, value: totalSantri } : item);

  async function handleLogout() {
    setLogoutError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        setLogoutError("Gagal keluar. Coba lagi.");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setLogoutError("Tidak dapat menghubungi server. Coba lagi.");
    }
  }

  return (
    <div className="report-shell">
      <DashboardHeader
        period={period}
        periods={periods}
        onPeriodChange={setPeriod}
        onReport={() => setToast(true)}
        onDomainSelect={setActiveSlide}
        onLogout={handleLogout}
      />
      <main className="inner">
        <DashboardSlider
          activeIndex={activeSlide}
          onActiveIndexChange={setActiveSlide}
          slides={[
            { id: "ringkasan", label: "Ringkasan Umum", children: <section><div className="section-rule"><p>Ringkasan Umum</p></div><div className="kpis">{summaryWithLiveSantri.map((item) => <Metric item={item} key={item.label} />)}</div></section> },
            { id: "sdm", label: "Khudama", children: <EmployeeSection period={period} /> },
            { id: "keuangan", label: "Keuangan", children: <><FinanceSection period={period} /><InstitutionSection period={period} /></> },
            { id: "santri", label: "Santri", children: <StudentSection period={period} /> },
            { id: "zawiyah", label: "Zawiyah", children: <ZawiyahSection period={period} /> },
          ]}
        />
      </main>
      <footer className="inner page-footer">
        <span>Internal • Data Terintegrasi • Diperbarui November 2026</span>
        {/* <span>Ringkasan data operasional zawiyah & amalan suluk</span> */}
      </footer>
      {toast && <button className="toast" onClick={() => setToast(false)}><CheckCircle2 size={16} /> Permintaan laporan dicatat</button>}
      {logoutError && <p className="auth-toast" role="alert">{logoutError}</p>}
    </div>
  );
}
