"use client";

const queueData = [
  {
    poli: "Poli Umum",
    current: 12,
    max: 20,
    color: "bg-gray-300",
  },
  {
    poli: "Poli Gigi",
    current: 8,
    max: 20,
    color: "bg-gray-300",
  },
  {
    poli: "Poli Anak",
    current: 15,
    max: 20,
    color: "bg-gray-300",
  },
  {
    poli: "Poli Kandungan",
    current: 5,
    max: 20,
    color: "bg-gray-300",
  },
  {
    poli: "Poli Mata",
    current: 9,
    max: 20,
    color: "bg-gray-300",
  },
];

export default function BebanAntrean() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <tbody>
          {queueData.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              {/* Nama Poli */}
              <td className="px-6 py-4 font-medium w-48">
                {item.poli}
              </td>

              {/* Progress */}
              <td className="px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-6 bg-gray-300 rounded-full overflow-hidden">
                  <div
                  className="h-full bg-gray-600 rounded-full transition-all duration-500"
                  style={{
                  width: `${(item.current / item.max) * 100}%`,
                  }}
                  />
                  </div>

                  {/* Jumlah di kanan */}
                  <span className="text-sm font-bold text-gray-700 min-w-[50px] text-right">
                  {item.current}/{item.max}
                  </span>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}