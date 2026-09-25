"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaLocationDot, FaMagnifyingGlass } from "react-icons/fa6";
import { CiGrid41 } from "react-icons/ci";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const navItems = [
  {
    href: "/beranda",
    label: "Cari Toyagama",
    icon: <CiGrid41 size={20} />,
  },
];

export default function Sidebar({
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const [locationStatus, setLocationStatus] = useState(
    "Gunakan GPS perangkat"
  );

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const getMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("GPS tidak didukung browser");
      return;
    }

    setLocationStatus("Mengambil lokasi...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const location = {
          latitude,
          longitude,
        };

        // Tetap menyimpan lokasi di state Sidebar
        setUserLocation(location);

        // Simpan lokasi agar dapat dibaca oleh LocationsMap
        localStorage.setItem(
          "toyagama-user-location",
          JSON.stringify(location)
        );

        // Kirim event agar LocationsMap langsung mengetahui
        // bahwa lokasi pengguna telah diperbarui
        window.dispatchEvent(
          new Event("user-location-updated")
        );

        setLocationStatus("Lokasi berhasil ditemukan");

        console.log("Lokasi pengguna:");
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log(
          "Accuracy:",
          position.coords.accuracy,
          "meter"
        );
      },
      (error) => {
        console.error("Gagal mendapatkan lokasi:", error);

        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("Izin lokasi ditolak");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationStatus("Lokasi tidak tersedia");
        } else if (error.code === error.TIMEOUT) {
          setLocationStatus("Pengambilan lokasi timeout");
        } else {
          setLocationStatus("Gagal mendapatkan lokasi");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen flex-col bg-white text-blue-700 shadow-2xl transition-all duration-300 ${
          isOpen ? "w-80" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4">
          {isOpen ? (
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <Image
                  src="/icuq.png"
                  alt="Toyagama logo"
                  width={34}
                  height={34}
                  className="h-8 w-8 scale-125 object-contain"
                  priority
                />
              </div>

              <div>
                <h1 className="text-lg font-bold text-blue-900">
                  Toyagama
                </h1>

                <p className="text-[10px] text-gray-600">
                  Location Finder
                </p>
              </div>
            </div>
          ) : (
            <div />
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-blue-700 transition hover:bg-blue-100"
            title="Toggle sidebar"
          >
            <FaBars size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 ${
                    isActive
                      ? "scale-105 border-r-4 border-blue-600 bg-blue-100 text-blue-700 shadow-md"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <span className="shrink-0 text-blue-600">
                    {item.icon}
                  </span>

                  <span
                    className={`whitespace-nowrap text-sm font-medium transition-all duration-300 ${
                      isOpen
                        ? "w-auto opacity-100"
                        : "w-0 overflow-hidden opacity-0"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Location Tools */}
          {isOpen && (
            <div className="mt-6">
              <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Location
              </p>

              {/* Current Location */}
              <div className="mb-3 rounded-xl bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <FaLocationDot size={15} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Lokasi Anda
                    </p>

                    <p className="text-[11px] text-slate-400">
                      {locationStatus}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={getMyLocation}
                  className="mt-3 w-full rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                >
                  Gunakan Lokasi Saya
                </button>

                {userLocation && (
                  <div className="mt-3 rounded-lg bg-white p-2">
                    <p className="text-[10px] text-slate-400">
                      Latitude
                    </p>

                    <p className="text-xs font-medium text-slate-700">
                      {userLocation.latitude.toFixed(6)}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Longitude
                    </p>

                    <p className="text-xs font-medium text-slate-700">
                      {userLocation.longitude.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <FaMagnifyingGlass
                    size={13}
                    className="text-blue-600"
                  />

                  <p className="text-sm font-semibold text-slate-700">
                    Cari Toyagama
                  </p>
                </div>

                <input
                  type="text"
                  placeholder="Cari lokasi..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="px-4 py-3">
            <p className="text-xs text-slate-400">
              Toyagama Location Finder v1.0
            </p>
          </div>
        )}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}