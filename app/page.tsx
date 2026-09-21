"use client";

import { useState } from "react";
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

export default function Home() {
  const [period, setPeriod] = useState<Period>("month");
  const [activeSlide, setActiveSlide] = useState(0);
  const [toast, setToast] = useState(false);

  return (
    <div className="report-shell">
      <DashboardHeader
        period={period}
        periods={periods}
        onPeriodChange={setPeriod}
        onReport={() => setToast(true)}
        onDomainSelect={setActiveSlide}
      />
      <main className="inner">
        <DashboardSlider
          activeIndex={activeSlide}
          onActiveIndexChange={setActiveSlide}
          slides={[
            { id: "ringkasan", label: "Ringkasan Umum", children: <section><div className="section-rule"><p>Ringkasan Umum</p></div><div className="kpis">{summary.map((item) => <Metric item={item} key={item.label} />)}</div></section> },
            { id: "sdm", label: "SDM", children: <EmployeeSection /> },
            { id: "keuangan", label: "Keuangan", children: <><FinanceSection /><InstitutionSection /></> },
            { id: "santri", label: "Santri", children: <StudentSection /> },
            { id: "zawiyah", label: "Zawiyah", children: <ZawiyahSection /> },
          ]}
        />
      </main>
      <footer className="inner page-footer">
        <span>Internal • Data ilustratif • Diperbarui 11 September 2026</span>
        <span>Gunakan filter periode untuk menyesuaikan ringkasan.</span>
      </footer>
      {toast && <button className="toast" onClick={() => setToast(false)}><CheckCircle2 size={16} /> Permintaan laporan dicatat</button>}
    </div>
  );
}
