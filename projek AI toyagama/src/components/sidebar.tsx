"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaBars,
  FaLocationDot,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import { CiGrid41 } from "react-icons/ci";

import { useRouting } from "@/components/appshell";
import { toyagamaLocations } from "@/lib/locations";
import { findNearestRoadNode } from "@/lib/roadNetwork";

type SidebarProps = {
  isOpen: boolean;
  setIsOpenAction: (value: boolean) => void;
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
  setIsOpenAction,
}: SidebarProps) {
  const pathname = usePathname();

  const {
    selectedDestination,
    setSelectedDestination,
  } = useRouting();

  const [locationStatus, setLocationStatus] = useState(
    "Gunakan GPS perangkat"
  );

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [
    selectedDestinationName,
    setSelectedDestinationName,
  ] = useState<string | null>(null);

  const getMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus(
        "GPS tidak didukung browser"
      );
      return;
    }

    setLocationStatus(
      "Mengambil lokasi..."
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const location = {
          latitude,
          longitude,
        };

        setUserLocation(
          location
        );

        localStorage.setItem(
          "toyagama-user-location",
          JSON.stringify(location)
        );

        window.dispatchEvent(
          new Event(
            "user-location-updated"
          )
        );

        setLocationStatus(
          "Lokasi berhasil ditemukan"
        );

        console.log(
          "Lokasi pengguna:"
        );

        console.log(
          "Latitude:",
          latitude
        );

        console.log(
          "Longitude:",
          longitude
        );

        console.log(
          "Accuracy:",
          position.coords.accuracy,
          "meter"
        );
      },
      (error) => {
        console.error(
          "Gagal mendapatkan lokasi:",
          error
        );

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          setLocationStatus(
            "Izin lokasi ditolak"
          );
        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          setLocationStatus(
            "Lokasi tidak tersedia"
          );
        } else if (
          error.code ===
          error.TIMEOUT
        ) {
          setLocationStatus(
            "Pengambilan lokasi timeout"
          );
        } else {
          setLocationStatus(
            "Gagal mendapatkan lokasi"
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSelectDestination = (
    location: (typeof toyagamaLocations)[number]
  ) => {
    const nearestNode =
      findNearestRoadNode(
        location.latitude,
        location.longitude
      );

    if (!nearestNode) {
      console.error(
        "Road node terdekat tidak ditemukan:",
        location.name
      );

      return;
    }

    setSelectedDestinationName(
      location.name
    );

    setSelectedDestination(
      nearestNode.id
    );

    localStorage.setItem(
      "toyagama-selected-destination",
      JSON.stringify({
        id: location.id,
        name: location.name,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        nodeId: nearestNode.id,
      })
    );

    
window.dispatchEvent(
  new Event("toyagama-destination-selected")
);

    setSearchQuery(
      location.name
    );

    console.log(
      "=== TUJUAN DIPILIH ==="
    );

    console.log(
      "Nama:",
      location.name
    );

    console.log(
      "Alamat:",
      location.address
    );

    console.log(
      "Latitude:",
      location.latitude
    );

    console.log(
      "Longitude:",
      location.longitude
    );

    console.log(
      "Road Node:",
      nearestNode.id
    );
  };

  /* =====================================================
     CARI RUTE
     ===================================================== */

  const handleFindRoute = () => {
    if (!selectedDestination) {
      console.warn(
        "Belum ada tujuan yang dipilih."
      );

      return;
    }

    console.log(
      "=== MEMULAI PENCARIAN RUTE ==="
    );

    console.log(
      "Destination node:",
      selectedDestination
    );

    window.dispatchEvent(
      new Event(
        "route-requested"
      )
    );
  };

  const filteredLocations =
    toyagamaLocations.filter(
      (location) => {
        const query =
          searchQuery
            .toLowerCase()
            .trim();

        if (!query) {
          return false;
        }

        return (
          location.name
            .toLowerCase()
            .includes(query) ||
          location.address
            .toLowerCase()
            .includes(query)
        );
      }
    );

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen flex-col bg-white text-blue-700 shadow-2xl transition-all duration-300 ${
          isOpen
            ? "w-80"
            : "w-20"
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
                  MyToyagama
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
            type="button"
            onClick={() =>
              setIsOpenAction(
                !isOpen
              )
            }
            className="rounded-lg p-2 text-blue-700 transition hover:bg-blue-100"
            title="Toggle sidebar"
          >
            <FaBars size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <div className="space-y-1">
            {navItems.map(
              (item) => {
                const isActive =
                  pathname ===
                  item.href;

                return (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 ${
                      isActive
                        ? "scale-105 border-r-4 border-blue-600 bg-blue-100 text-blue-700 shadow-md"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    title={
                      !isOpen
                        ? item.label
                        : undefined
                    }
                  >
                    <span className="shrink-0 text-blue-600">
                      {
                        item.icon
                      }
                    </span>

                    <span
                      className={`whitespace-nowrap text-sm font-medium transition-all duration-300 ${
                        isOpen
                          ? "w-auto opacity-100"
                          : "w-0 overflow-hidden opacity-0"
                      }`}
                    >
                      {
                        item.label
                      }
                    </span>
                  </Link>
                );
              }
            )}
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
                    <FaLocationDot
                      size={15}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Lokasi Anda
                    </p>

                    <p className="text-[11px] text-slate-400">
                      {
                        locationStatus
                      }
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    getMyLocation
                  }
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
                      {userLocation.latitude.toFixed(
                        6
                      )}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Longitude
                    </p>

                    <p className="text-xs font-medium text-slate-700">
                      {userLocation.longitude.toFixed(
                        6
                      )}
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
                  value={
                    searchQuery
                  }
                  onChange={(
                    event
                  ) =>
                    setSearchQuery(
                      event.target
                        .value
                    )
                  }
                  placeholder="Cari lokasi..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />

                {/* Rekomendasi */}
                {searchQuery.trim() !==
                  "" && (
                  <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    {filteredLocations.map(
                      (
                        location
                      ) => (
                        <button
                          key={
                            location.id
                          }
                          type="button"
                          onClick={() =>
                            handleSelectDestination(
                              location
                            )
                          }
                          className="w-full border-b border-slate-100 px-3 py-2 text-left transition last:border-b-0 hover:bg-blue-50"
                        >
                          <p className="text-xs font-semibold text-slate-700">
                            {
                              location.name
                            }
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {
                              location.address
                            }
                          </p>
                        </button>
                      )
                    )}

                    {filteredLocations.length ===
                      0 && (
                      <div className="px-3 py-3 text-center text-[11px] text-slate-400">
                        Tujuan tidak ditemukan
                      </div>
                    )}
                  </div>
                )}

                {/* Tujuan Dipilih */}
                {selectedDestinationName && (
                  <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">
                      Tujuan Dipilih
                    </p>

                    <p className="mt-1 text-xs font-semibold text-blue-900">
                      {
                        selectedDestinationName
                      }
                    </p>

                    <p className="mt-1 text-[10px] text-blue-600">
                      Road node:{" "}
                      {
                        selectedDestination
                      }
                    </p>
                  </div>
                )}

                {/* Cari Rute Terbaik */}
                {selectedDestinationName && (
                  <button
                    type="button"
                    onClick={
                      handleFindRoute
                    }
                    className="mt-3 w-full rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                  >
                    Cari Rute Terbaik
                  </button>
                )}
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
          onClick={() =>
            setIsOpenAction(
              false
            )
          }
        />
      )}
    </>
  );
}