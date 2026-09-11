import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import type { FinancialMetrics } from "@/src/lib/finance-utils";
import { cn } from "@/src/lib/utils";

interface PerformanceCardProps {
  nama: string;
  metrics: FinancialMetrics;
  pendapatan: number;
  hpp: number;
  biaya: number;
}

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export function PerformanceCard({ nama, metrics, pendapatan, hpp, biaya }: PerformanceCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-4">
        <CardTitle className="text-base text-[#174c3a]">{nama}</CardTitle>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold",
            metrics.isProfit ? "bg-[#e6f3eb] text-[#28704d]" : "bg-red-50 text-red-700",
          )}
        >
          {metrics.isProfit ? "Profit" : "Loss"}
        </span>
      </CardHeader>
      <CardContent>
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[#6b7c76]">Pendapatan</dt>
            <dd className="font-medium text-[#18312a]">{formatRupiah(pendapatan)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[#6b7c76]">HPP</dt>
            <dd className="font-medium text-[#18312a]">{formatRupiah(hpp)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[#6b7c76]">Biaya</dt>
            <dd className="font-medium text-[#18312a]">{formatRupiah(biaya)}</dd>
          </div>
        </dl>
        <div className="my-4 border-t border-[#dfe9e3]" />
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-[#6b7c76]">Laba Bersih</p>
            <p className={cn("mt-1 text-lg font-bold", metrics.isProfit ? "text-[#2f8a5c]" : "text-red-600")}>
              {formatRupiah(metrics.labaBersih)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#6b7c76]">Margin</p>
            <p className={cn("mt-1 text-lg font-bold", metrics.isProfit ? "text-[#2f8a5c]" : "text-red-600")}>
              {metrics.margin.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
