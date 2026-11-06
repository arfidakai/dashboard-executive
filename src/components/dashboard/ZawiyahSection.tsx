"use client";

import type { Period } from "@/src/lib/dashboard-data";
import { useDashboardData } from "@/src/lib/hooks/useDashboardData";
import { Metric, SectionLabel } from "./Primitives";

export function ZawiyahSection({ period }: { period: Period }) {
  const { data, isFallback } = useDashboardData("zawiyah", period);

  return (
    <section>
      <SectionLabel isFallback={isFallback}>Zawiyah</SectionLabel>

      <div className="three kpis">
        <Metric
          item={{
            label: "Total Zawiyah",
            value: data.totalZawiyah.toLocaleString("id-ID"),
            note: "Zawiyah aktif terdata",
          }}
        />
        <Metric
          item={{
            label: "Total Jamaah",
            value: data.totalJamaah.toLocaleString("id-ID"),
            note: "Jamaah terdaftar",
          }}
        />
      </div>

      <h3 className="monitoring-heading">Monitoring Amalan Suluk</h3>

      <div className="two kpis">
        <Metric
          item={{
            label: "Total Suluk",
            value: data.totalSuluk.toLocaleString("id-ID"),
            note: "Jumlah muhasabah",
          }}
        />
        <Metric
          item={{
            label: "Gamis Subuh",
            value: data.totalGsubuh.toLocaleString("id-ID"),
            note: "Jumlah jamaah",
          }}
        />
        <Metric
          item={{
            label: "Gamis Magrib",
            value: data.totalGmagrib.toLocaleString("id-ID"),
            note: "Jumlah jamaah",
            gold: true,
          }}
        />
      </div>

   <h3 className="monitoring-heading">Ringkasan data Zawiyah</h3>

      <div className="table-wrap zawiyah-table">
        <table>
          <thead>
            <tr>
              <th>Zawiyah</th>
              <th>ID Zawiyah</th>
              <th>Jamaah</th>
              <th>Suluk</th>
              <th>Gamis Subuh</th>
              <th>Gamis Magrib</th>
            </tr>
          </thead>
          <tbody>
            {data.zawiyah.map((row, index) => (
              <tr className={index === 0 ? "highlight" : ""} key={row[1]}>
                {row.map((cell, cellIndex) => (
                  <td key={`${row[1]}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}