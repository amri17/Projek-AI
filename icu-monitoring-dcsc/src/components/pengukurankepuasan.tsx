"use client";

const data = [
  {
    satuan_kerja: "Balai Rehabilitasi BNN Tanah Merah",
    ikm_rawatjalan: "3,74 (indeks 4)",
    ikm_rawatinap: "3,72 (indeks 4)",
    ikr: "4,00 (indeks 4)",
    presentase_kualitas_hidup: "88,79",
  },
];

export default function TableModern() {
  return (
    <div className="w-full p-4">
      <div className="min-w-[1150px] bg-white rounded-2xl shadow-md overflow-hidden">
        
        {/* Header */}
        <div className="grid grid-cols-[200px_200px_200px_200px_250px] bg-blue-300 text-center px-8 py-5 font-semibold text-black">
          <div>Satuan Kerja</div>
          <div>IKM Rawat Jalan</div>
          <div>IKM Rawat Inap</div>
          <div>IKR</div>
          <div>Presentase Kualitas Hidup</div>
        </div>

        {/* Data */}
        {data.map((item, index) => (
          <div
          key={index}
          className="grid grid-cols-[200px_200px_200px_200px_250px] px-8 py-5 items-center hover:bg-gray-50 transition text-center"
          >
            <div>{item.satuan_kerja}</div>
            <div>{item.ikm_rawatjalan}</div>
            <div>{item.ikm_rawatinap}</div>
            <div>{item.ikr}</div>
            <div>{item.presentase_kualitas_hidup}</div>
            <div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}