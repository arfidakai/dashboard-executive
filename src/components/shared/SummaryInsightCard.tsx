import { Card, CardContent } from "@/src/components/ui/card";
import { calculateFinancialMetrics } from "@/src/lib/finance-utils";
import type { LembagaFinance } from "@/src/types/finance";

interface SummaryInsightCardProps {
  data: LembagaFinance[];
}

export function SummaryInsightCard({ data }: SummaryInsightCardProps) {
  const metrics = data.map(calculateFinancialMetrics);
  const profitCount = metrics.filter((metric) => metric.isProfit).length;
  const averageDebtRatio = metrics.length === 0 ? 0 : metrics.reduce((sum, metric) => sum + metric.debtRatio, 0) / metrics.length;
  const totalAssets = data.reduce((sum, lembaga) => sum + lembaga.totalAset, 0);
  const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

  const insights = [
    { label: "Lembaga Profit", value: `${profitCount}/${data.length}` },
    { label: "Rata-rata Debt Ratio", value: `${averageDebtRatio.toFixed(1)}%` },
    { label: "Total Aset Gabungan", value: formatRupiah(totalAssets) },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {insights.map((insight) => (
        <Card key={insight.label} className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <p className="text-xs text-[#6b7c76]">{insight.label}</p>
            <p className="mt-2 text-xl font-bold text-[#174c3a]">{insight.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
