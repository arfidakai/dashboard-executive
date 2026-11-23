"use client";

import type { Period } from "@/src/lib/dashboard-data";
import { useDashboardData } from "@/src/lib/hooks/useDashboardData";
import { Metric, SectionLabel } from "./Primitives";
function FinanceDetail({ financeRows }: { financeRows: ReturnType<typeof useDashboardData<"keuangan">>["data"]["financeRows"] }) {
  const philanthropic = financeRows.some((row) => row[0] === "Zakat" || row[0] === "Infak dan Sedekah");

  return (
    <div className="finance-table-only">
      <br />
      <div className="table-wrap scroll">
        <table>
          <thead>
            <tr>
              <th>{philanthropic ? "Dana" : "Struktur"}</th>
              <th>{philanthropic ? "Penerimaan" : "Pendapatan"}</th>
              <th>{philanthropic ? "Penyaluran" : "Pengeluaran"}</th>
              <th>{philanthropic ? "Sisa Dana" : "Saldo"}</th>
              {philanthropic && <th>Saldo Awal</th>}
              {philanthropic && <th>Saldo Akhir</th>}
            </tr>
          </thead>
          <tbody>
            {financeRows.map((row) => (
              <tr className={row.length === 7 ? row[6] : row[4]} key={row[0]}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                {philanthropic && <td>{row[4]}</td>}
                {philanthropic && <td>{row[5]}</td>}
              </tr>
            ))}
          </tbody>
          {philanthropic && (
            <tfoot>
              <tr>
                <td><strong>Total Agnia Care</strong></td>
                <td><strong>Rp 493.548.034</strong></td>
                <td><strong>Rp 242.805.838</strong></td>
                <td><strong>Rp 250.742.196</strong></td>
                <td><strong>Rp 45.402.215</strong></td>
                <td><strong>Rp 296.144.411</strong></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
export function FinanceSection({ period }: { period: Period }) {
  const { data, isFallback } = useDashboardData("keuangan", period);
  const philanthropic = data.financeRows.some((row) => row[0] === "Zakat" || row[0] === "Infak dan Sedekah");

  return (
    <section>
      <SectionLabel isFallback={isFallback}>Keuangan</SectionLabel>
      <div className={philanthropic ? "philanthropy-kpis kpis" : "three kpis"}>
        {data.finance.map((item) => <Metric item={item} key={item.label} />)}
      </div>
      <FinanceDetail financeRows={data.financeRows} />
    </section>
  );
}
