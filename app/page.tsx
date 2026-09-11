"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import {
  DashboardHeader,
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
  const [toast, setToast] = useState(false);

  return (
    <div className="report-shell">
      <DashboardHeader
        period={period}
        periods={periods}
        onPeriodChange={setPeriod}
        onReport={() => setToast(true)}
      />
      <main className="inner">
        <section>
          <div className="section-rule"><p>Ringkasan Umum</p></div>
          <div className="kpis">
            {summary.map((item) => <Metric item={item} key={item.label} />)}
          </div>
        </section>
        <EmployeeSection />
        <InstitutionSection />
        <FinanceSection />
        <StudentSection />
        <ZawiyahSection />
      </main>
      <footer className="inner page-footer">
        <span>Internal • Data ilustratif • Diperbarui 11 September 2026</span>
        <span>Gunakan filter periode untuk menyesuaikan ringkasan.</span>
      </footer>
      {toast && <button className="toast" onClick={() => setToast(false)}><CheckCircle2 size={16} /> Permintaan laporan dicatat</button>}
    </div>
  );
}
