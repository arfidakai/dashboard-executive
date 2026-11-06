export interface OrgNode {
  id: string;
  nama: string;
  spesifikasi: "Konsolidasi" | "Pembukuan" | "Unit Pendukung";
  entitas: "Nirlaba" | "Pendidikan" | "Usaha Jasa" | "Retail/POS" | null;
  children?: OrgNode[];
}
