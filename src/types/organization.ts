export interface OrgNode {
  id: string;
  nama: string;
  spesifikasi: "Konsolidasi" | "Pembukuan" | "Cost Centre";
  entitas: "Nirlaba" | "Pendidikan" | "Usaha Jasa" | "Retail/POS" | null;
  children?: OrgNode[];
}
