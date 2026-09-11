"use client";

import { ChevronRight, CircleDot, CornerUpLeft, FolderTree } from "lucide-react";
import { useState } from "react";

import type { OrgNode } from "@/src/types/organization";
import { cn } from "@/src/lib/utils";

interface OrgTreeDrilldownProps {
  data: OrgNode[];
}

const specificationStyles: Record<OrgNode["spesifikasi"], string> = {
  Konsolidasi: "border-blue-200 bg-blue-50 text-blue-700",
  Pembukuan: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Cost Centre": "border-slate-200 bg-slate-100 text-slate-600",
};

export function OrgTreeDrilldown({ data }: OrgTreeDrilldownProps) {
  const [path, setPath] = useState<OrgNode[]>([]);
  const currentNode = path[path.length - 1];
  const visibleNodes = currentNode?.children ?? data;
  const isRootLevel = path.length === 0;

  const openNode = (node: OrgNode) => {
    if (node.children?.length) {
      setPath((currentPath) => [...currentPath, node]);
    }
  };

  const goBack = () => setPath((currentPath) => currentPath.slice(0, -1));
  const goToBreadcrumb = (index: number) => setPath((currentPath) => currentPath.slice(0, index + 1));

  return (
    <section className="space-y-5" aria-label="Struktur organisasi">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-[#6b7c76]">
            <FolderTree size={16} />
            <span>Struktur Organisasi</span>
          </div>
          <h2 className="text-xl font-bold text-[#174c3a]">
            {currentNode?.nama ?? "Sektor dan Unit"}
          </h2>
        </div>
        {!isRootLevel && (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-lg border border-[#dfe9e3] bg-white px-3 py-2 text-sm font-semibold text-[#315a49] transition hover:bg-[#f0f7f3]"
          >
            <CornerUpLeft size={16} />
            Kembali
          </button>
        )}
      </div>

      <nav aria-label="Breadcrumb struktur organisasi" className="flex flex-wrap items-center gap-1 text-sm">
        <button
          type="button"
          onClick={() => setPath([])}
          className={cn(
            "rounded-md px-2 py-1 font-semibold transition hover:bg-[#eaf4ed]",
            isRootLevel ? "text-[#174c3a]" : "text-[#6b7c76]",
          )}
        >
          Organisasi
        </button>
        {path.map((node, index) => (
          <span className="flex items-center gap-1" key={node.id}>
            <ChevronRight size={14} className="text-[#9aaba3]" />
            <button
              type="button"
              onClick={() => goToBreadcrumb(index)}
              className={cn(
                "rounded-md px-2 py-1 transition hover:bg-[#eaf4ed]",
                index === path.length - 1 ? "font-semibold text-[#174c3a]" : "text-[#6b7c76]",
              )}
            >
              {node.nama}
            </button>
          </span>
        ))}
      </nav>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {visibleNodes.map((node) => {
          const hasChildren = Boolean(node.children?.length);
          return (
            <div
              className={cn(
                "rounded-xl border bg-white p-4 shadow-sm transition",
                hasChildren ? "cursor-pointer hover:-translate-y-0.5 hover:border-[#9bc8ae] hover:shadow-md" : "border-[#dfe9e3]",
              )}
              key={node.id}
              role="listitem"
            >
              <button
                type="button"
                onClick={() => openNode(node)}
                disabled={!hasChildren}
                className="w-full text-left disabled:cursor-default"
                aria-label={hasChildren ? `Buka ${node.nama}` : `${node.nama}, titik data terakhir`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#18312a]">{node.nama}</h3>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full border px-2 py-1 text-xs font-semibold", specificationStyles[node.spesifikasi])}>
                        {node.spesifikasi}
                      </span>
                      {node.entitas && <span className="text-xs text-[#6b7c76]">{node.entitas}</span>}
                    </div>
                  </div>
                  {hasChildren ? <ChevronRight size={18} className="mt-0.5 shrink-0 text-[#6b7c76]" /> : <CircleDot size={17} className="mt-0.5 shrink-0 text-[#94a39c]" />}
                </div>
              </button>
              {hasChildren && <p className="mt-3 border-t border-[#edf2ef] pt-3 text-xs text-[#6b7c76]">{node.children?.length} unit di bawah struktur ini</p>}
              {!hasChildren && <p className="mt-3 border-t border-[#edf2ef] pt-3 text-xs font-medium text-[#6b7c76]">Titik data terakhir</p>}
            </div>
          );
        })}
      </div>

      {!visibleNodes.length && <p className="rounded-xl border border-dashed border-[#cbdad2] bg-[#f8fbf9] p-6 text-center text-sm text-[#6b7c76]">Belum ada unit di bawah struktur ini.</p>}
    </section>
  );
}
