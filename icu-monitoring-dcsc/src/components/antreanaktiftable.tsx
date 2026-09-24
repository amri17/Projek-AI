import { useState } from "react";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { RxSpeakerLoud } from "react-icons/rx";

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
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between py-3">
        {/* Kiri */}
        <h1 className="text-2xl font-bold text-gray-800">
          Daftar antrean poli
        </h1>

        {/* Kanan */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-green-200 transition-all">
            <FiSearch className="text-gray-500 text-lg" />
            <input
              type="text"
              placeholder="Cari pasien..."
              className="outline-none text-sm text-gray-700 bg-transparent w-64"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-400 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <MdOutlinePersonAddAlt className="text-gray-500 text-2xl" />
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">Pasien Baru</p>
            </div>
          </button>

          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            <RxSpeakerLoud className="text-white text-xl" />
            <span>Panggilan Berikutnya</span>
          </button>
        </div>
      </div>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr className="text-left">
            <th className="px-4 py-3 font-medium">No.</th>
            <th className="px-4 py-3 font-medium">Nama Lengkap</th>
            <th className="px-4 py-3 font-medium">Poli</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Aksi</th>
           </tr>
        </thead>
        <tbody>
          {antrean.map((item) => (
            <tr key={item.no}>
              <td className="px-4 py-4">{item.no}</td>
              <td className="px-4 py-4">{item.nama}</td>
              <td className="px-4 py-4">{item.poli}</td>
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

      {/* Modal Overlay */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          {/* Modal Content */}
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Tambahkan ke Antrean
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition"
                />
              </div>

              {/* Poliklinik */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poliklinik
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition bg-white">
                  <option>Pilih Poliklinik</option>
                  <option>Poli Umum</option>
                  <option>Poli Gigi</option>
                  <option>Poli Anak</option>
                  <option>Poli Mata</option>
                </select>
              </div>

              {/* Jenis Pembayaran */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Pembayaran
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="BPJS"
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">BPJS</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="Umum"
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">Umum</span>
                  </label>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    // Handle submit logic here
                    setShowModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                >
                  Simpan ke Antrean
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
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