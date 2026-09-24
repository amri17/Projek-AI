"use client";

const dokter = [
  {
    nama: "dr. Aditya Saputra, Sp.U",
    poli: "Poli Umum",
    jam: "08.00 - 09.00",
    avatar: "DA",
  },
  {
    nama: "drg. Rina Novitasari",
    poli: "Poli Gigi",
    jam: "09.00 - 10.00",
    avatar: "RN",
  },
  {
    nama: "dr. Bayu Wicaksono, Sp.A",
    poli: "Poli Anak",
    jam: "10.00 - 11.00",
    avatar: "BW",
  },
  {
    nama: "dr. Maya Kusuma, Sp.OG",
    poli: "Poli Kandungan",
    jam: "11.00 - 12.00",
    avatar: "MK",
  },
];

export default function StatusDokterCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

      {/* LIST DOKTER */}
      <div>
        {dokter.map((item) => (
          <div
            key={item.nama}
            className="flex items-center justify-between p-4 border-b border-gray-100"
          >
            {/* KIRI */}
            <div className="flex items-center gap-3 ">
              <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
                {item.avatar}
              </div>

              <div>
                <h4 className="font-medium text-gray-800">
                  {item.nama}
                </h4>

                <p className="text-sm text-gray-500">
                  {item.poli} • {item.jam}
                </p>
              </div>
            </div>

            {/* KANAN (INPUT ADMIN) */}
            <input
              type="text"
              placeholder="Isi status..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}
      </div>

      {/* BUTTON SIMPAN */}
      <div className="p-4 border-t-3 border-gray-300">
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium">
          Simpan Perubahan
        </button>
      </div>

    </div>
  );
}