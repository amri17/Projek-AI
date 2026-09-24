"use client";

const data = [
  {
    dokter: "dr. Aditya Saputra",
    antri: 5,
    diperiksa: 1,
    selesai: 12,
  },
  {
    dokter: "drg. Rina Novitasari",
    antri: 3,
    diperiksa: 0,
    selesai: 10,
  },
  {
    dokter: "dr. Bayu Wicaksono",
    antri: 2,
    diperiksa: 1,
    selesai: 8,
  },
  {
    dokter: "dr. Maya Kusuma",
    antri: 4,
    diperiksa: 0,
    selesai: 6,
  },
];

export default function DokterTable() {
  return (
    <div className="w-full bg-white shadow-sm overflow-hidden border-b-3 border-gray-300">

      <div className="overflow-x-auto ">
        <table className="w-full text-sm text-left">
          
          {/* HEADER */}
          <thead className="bg-gray-300 text-gray-600 border-b-3 border-t-3 border-gray-400">
            <tr>
              <th className="p-4">Dokter</th>
              <th className="p-4">Antri</th>
              <th className="p-4">Diperiksa</th>
              <th className="p-4">Selesai</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">

                {/* DOKTER */}
                <td className="p-4 font-medium text-gray-800">
                  {item.dokter}
                </td>

                {/* ANTRI */}
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-grey">
                    {item.antri}
                  </span>
                </td>

                {/* DIPERIKSA */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      item.diperiksa === 1
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.diperiksa}
                  </span>
                </td>

                {/* SELESAI */}
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-grey">
                    {item.selesai}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}