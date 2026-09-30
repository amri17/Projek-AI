const dokter = [
  {
    nama: "dr. Aditya Saputra, Sp.U",
    poli: "Poli Umum",
    status: "Ready di Ruangan",
    avatar: "DA",
  },
  {
    nama: "drg. Rina Novitasari",
    poli: "Poli Gigi",
    status: "Ready di Ruangan",
    avatar: "RN",
  },
  {
    nama: "dr. Bayu Wicaksono, Sp.A",
    poli: "Poli Anak",
    status: "Ready di Ruangan",
    avatar: "BW",
  },
  {
    nama: "dr. Maya Kusuma, Sp.OG",
    poli: "Poli Kandungan",
    status: "Belum Datang",
    avatar: "MK",
  },
];

export default function StatusDokterCard() {
  return (
    <div className="bg-white rounded-2xl">

      <div>
        {dokter.map((item) => (
          <div
            key={item.nama}
            className="flex items-center justify-between p-4"
          >
            <div className="flex gap-2">

              <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
                {item.avatar}
              </div>

              <div>
                <h4 className="font-medium">
                  {item.nama}
                </h4>

                <p className="text-sm text-gray-500">
                  {item.poli}
                </p>
              </div>

            </div>

            <span
              className={`px-4 py-1 rounded-full text-sm ${
                item.status === "Ready di Ruangan"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}