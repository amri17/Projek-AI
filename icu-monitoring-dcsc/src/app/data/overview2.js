// ============================================================
// DATA OVERVIEW � Sumber: DATA_ECORNER_MERGED & DATA_KLIEN_CLEANED_V3
// ============================================================

// --- Data Kapasitas & Hunian (dipakai oleh halaman kapasitas dan tabel) ---
export const kapasitasData = [
  { no: 1, fase: "Fase Entry (Penerimaan)", kapasitas: 20, terisi: 14, kosong: 6 },
  { no: 2, fase: "Fase Primer (Intensif)", kapasitas: 40, terisi: 22, kosong: 18 },
  { no: 3, fase: "Fase Re-Entry (Persiapan Pulang)", kapasitas: 30, terisi: 16, kosong: 14 },
  { no: 4, fase: "Fase Rawat Jalan", kapasitas: 25, terisi: 9, kosong: 16 },
];

// --- Pie Chart: Status Klien (Sembuh / Relapse / Dalam Program) ---
export const distribusiStatusKlien = [
  { name: "Sembuh", value: 234 },
  { name: "Relapse", value: 28 },
  { name: "Dalam Program", value: 83 },
];

const totalKlien = distribusiStatusKlien.reduce((sum, item) => sum + item.value, 0);
const sembuh = distribusiStatusKlien.find((item) => item.name === "Sembuh")?.value ?? 0;
const relapse = distribusiStatusKlien.find((item) => item.name === "Relapse")?.value ?? 0;
const dalamProgram = distribusiStatusKlien.find((item) => item.name === "Dalam Program")?.value ?? 0;

// --- KPI Cards ---
export const overviewCards = [
  {
    label: "Total Klien",
    value: totalKlien.toString(),
    trend: "+12%",
    up: true,
    bg: "from-blue-500 to-teal-400",
  },
  {
    label: "Tingkat Kesembuhan",
    value: totalKlien > 0 ? `${Math.round((sembuh / totalKlien) * 100)}%` : "0%",
    trend: "+5.2%",
    up: true,
    bg: "from-green-400 to-green-600",
  },
  {
    label: "Kasus Relapse",
    value: relapse.toString(),
    trend: relapse > 0 ? "-2.1%" : "0%",
    up: false,
    bg: "from-orange-500 to-red-400",
  },
  {
    label: "Dalam Program",
    value: dalamProgram.toString(),
    trend: "Stabil",
    up: true,
    bg: "from-purple-500 to-pink-400",
  },
  {
    label: "Tingkat Hunian Fasilitas",
    value: "53%",
    trend: "+8%",
    up: true,
    bg: "from-cyan-500 to-blue-500",
  },
];

// --- Line Chart: Tren Pulih vs Relapse per Bulan (dari ECORNER) ---
export const trendData = [
  { name: "Jan",  sembuh: 2,  relapse: 1 },
  { name: "Feb",  sembuh: 13, relapse: 1 },
  { name: "Mar",  sembuh: 28, relapse: 3 },
  { name: "Jun",  sembuh: 23, relapse: 1 },
  { name: "Jul",  sembuh: 19, relapse: 0 },
  { name: "Agt",  sembuh: 8,  relapse: 0 },
  { name: "Sep",  sembuh: 8,  relapse: 0 },
  { name: "Okt",  sembuh: 8,  relapse: 0 },
];

// --- Bar Chart: Hunian per Bulan (Masuk dan Keluar) ---
export const kapasitasBulanan = [
  { bulan: "Apr 25", masuk: 35, keluar: 18 },
  { bulan: "Mei 25", masuk: 36, keluar: 22 },
  { bulan: "Jun 25", masuk: 24, keluar: 15 },
  { bulan: "Jul 25", masuk: 34, keluar: 19 },
  { bulan: "Agt 25", masuk: 29, keluar: 17 },
  { bulan: "Sep 25", masuk: 28, keluar: 16 },
  { bulan: "Okt 25", masuk: 30, keluar: 20 },
  { bulan: "Nov 25", masuk: 32, keluar: 21 },
  { bulan: "Des 25", masuk: 26, keluar: 18 },
  { bulan: "Jan 26", masuk: 28, keluar: 20 },
  { bulan: "Feb 26", masuk: 29, keluar: 23 },
];

// --- Distribusi Jenis Zat (bonus � bisa dipakai di halaman lain) ---
export const distribusiZat = [
  { name: "Sabu",           value: 281 },
  { name: "Alkohol + Sabu", value: 19  },
  { name: "Sabu + Zenith",  value: 6   },
  { name: "Ganja + Sabu",   value: 4   },
  { name: "Lem",            value: 4   },
  { name: "Lainnya",        value: 28  },
];
