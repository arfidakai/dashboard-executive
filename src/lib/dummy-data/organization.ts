import type { OrgNode } from "@/src/types/organization";

export const organizationTree: OrgNode[] = [
  {
    id: "kantor-pusat",
    nama: "Kantor Pusat",
    spesifikasi: "Konsolidasi",
    entitas: null,
    children: [
      {
        id: "kantor-yayasan",
        nama: "Kantor Yayasan",
        spesifikasi: "Pembukuan",
        entitas: "Nirlaba",
        children: [
          { id: "majelis-ketarekatan", nama: "Majelis Ketarekatan", spesifikasi: "Unit Pendukung", entitas: null },
          { id: "marketing-komunikasi", nama: "Marketing dan Komunikasi", spesifikasi: "Unit Pendukung", entitas: null },
          { id: "sufi-training-center", nama: "Sufi Training Center", spesifikasi: "Unit Pendukung", entitas: null },
          { id: "hrd", nama: "HRD", spesifikasi: "Unit Pendukung", entitas: null },
        ],
      },
      {
        id: "zawiyah-utama-jakarta",
        nama: "Zawiyah Utama Jakarta",
        spesifikasi: "Konsolidasi",
        entitas: null,
        children: [
          { id: "kantor-zuj", nama: "Kantor ZUJ", spesifikasi: "Pembukuan", entitas: "Nirlaba" },
          {
            id: "pendidikan-zuj",
            nama: "Pendidikan ZUJ",
            spesifikasi: "Konsolidasi",
            entitas: null,
            children: [
              { id: "paud-idrisiyyah-zuj", nama: "PAUD Idrisiyyah ZUJ", spesifikasi: "Pembukuan", entitas: "Pendidikan" },
              { id: "mdta-zuj", nama: "MDTA ZUJ", spesifikasi: "Pembukuan", entitas: "Pendidikan" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "direktorat-pendidikan",
    nama: "Direktorat Pendidikan",
    spesifikasi: "Konsolidasi",
    entitas: null,
    children: [
      {
        id: "boarding-putra",
        nama: "Boarding Putra",
        spesifikasi: "Konsolidasi",
        entitas: null,
        children: [
          {
            id: "ppi-putra",
            nama: "PPI Putra",
            spesifikasi: "Pembukuan",
            entitas: "Pendidikan",
            children: [
              { id: "mts", nama: "MTs", spesifikasi: "Unit Pendukung", entitas: null },
              { id: "ma", nama: "MA", spesifikasi: "Unit Pendukung", entitas: null },
              { id: "smk", nama: "SMK", spesifikasi: "Unit Pendukung", entitas: null },
              { id: "dapur-umum", nama: "Dapur Umum", spesifikasi: "Unit Pendukung", entitas: null },
            ],
          },
        ],
      },
      {
        id: "unit-usaha-sekolah",
        nama: "Unit Usaha Sekolah",
        spesifikasi: "Konsolidasi",
        entitas: null,
        children: [
          { id: "kafe-santri", nama: "Kafe Santri", spesifikasi: "Pembukuan", entitas: "Usaha Jasa" },
          { id: "qinimini", nama: "Qinimini", spesifikasi: "Pembukuan", entitas: "Retail/POS" },
        ],
      },
    ],
  },
];
