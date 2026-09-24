const antrean = [
  {
    no: "013",
    nama: "Dewi Lestari",
    poli: "Poli Umum",
    status: "Selesai",
    aksi: "Rujukan",
  },
  {
    no: "014",
    nama: "Budi Santoso",
    poli: "Poli Umum",
    status: "Diperiksa",
    aksi: "Rekam Medis",
  },
  {
    no: "015",
    nama: "Siti Rahayu",
    poli: "Poli Gigi",
    status: "Menunggu",
    aksi: "Rekam Medis",
  },
  {
    no: "016",
    nama: "Ahmad Fauzi",
    poli: "Poli Anak",
    status: "Menunggu",
    aksi: "Rekam Medis",
  },
];

export default function AntreanAktifTable() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-50">
          <tr className="text-left">

            <th className="px-4 py-3 font-medium">
              No.
            </th>

            <th className="px-4 py-3 font-medium">
              Nama Pasien
            </th>

            <th className="px-4 py-3 font-medium">
              Poli
            </th>

            <th className="px-4 py-3 font-medium">
              Status
            </th>

            <th className="px-4 py-3 font-medium">
              Aksi
            </th>

          </tr>
        </thead>

        <tbody>
          {antrean.map((item) => (
            <tr
              key={item.no}
              className=""
            >
              <td className="px-4 py-4">
                {item.no}
              </td>

              <td className="px-4 py-4">
                {item.nama}
              </td>

              <td className="px-4 py-4">
                {item.poli}
              </td>

              <td className="px-4 py-4">
                <StatusBadge status={item.status} />
              </td>

              <td className="px-4 py-4">
                <button className="px-4 py-2 rounded-xl hover:bg-gray-50">
                  {item.aksi}
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (status === "Selesai") {
    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
        Selesai
      </span>
    );
  }

  if (status === "Diperiksa") {
    return (
      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
        Diperiksa
      </span>
    );
  }

  return (
    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
      Menunggu
    </span>
  );
}