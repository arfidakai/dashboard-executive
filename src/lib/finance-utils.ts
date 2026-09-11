import type { LembagaFinance } from "@/src/types/finance";

export type FinancialHealthStatus = "Aman" | "Moderat" | "Tinggi";

export interface FinancialMetrics {
  labaBersih: number;
  margin: number;
  equityRatio: number;
  debtRatio: number;
  statusKesehatan: FinancialHealthStatus;
  isProfit: boolean;
}

export function calculateFinancialMetrics(data: LembagaFinance): FinancialMetrics {
  const labaBersih = data.pendapatan - data.hpp - data.biaya;
  const margin = data.pendapatan === 0 ? 0 : (labaBersih / data.pendapatan) * 100;
  const equityRatio = data.totalAset === 0 ? 0 : (data.ekuitas / data.totalAset) * 100;
  const debtRatio = data.totalAset === 0 ? 0 : (data.totalHutang / data.totalAset) * 100;
  const statusKesehatan = debtRatio < 30 ? "Aman" : debtRatio <= 50 ? "Moderat" : "Tinggi";

  return {
    labaBersih,
    margin,
    equityRatio,
    debtRatio,
    statusKesehatan,
    isProfit: labaBersih > 0,
  };
}
