"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import {
  getDashboardSummary,
  getPatientQueue,
} from "@/lib/api";

import {
  toyagamaLocations,
} from "@/lib/locations";

import type { RoadNode } from "@/lib/roadNetwork";

import {
  findNearestRoadNode,
  roadEdges,
  roadNodes,
} from "@/lib/roadNetwork";

import { aStar } from "@/lib/aStar";

import { useRouting } from "@/components/appshell";

const LocationsMap = dynamic(
  () => import("@/components/LocationsMap"),
  {
    ssr: false,
  }
);

type UserLocation = {
  latitude: number;
  longitude: number;
};

export default function BerandaPage() {
  const [error, setError] =
    useState("");

  const [lastUpdate, setLastUpdate] =
    useState("");

  const [userLocation, setUserLocation] =
    useState<UserLocation | null>(
      null
    );

  /**
   * Route hasil A*
   */
  const [route, setRoute] =
    useState<RoadNode[] | null>(
      null
    );

  /**
   * Menandakan apakah user sudah
   * menekan tombol "Cari Rute Terbaik".
   *
   * A* hanya akan dijalankan ketika
   * nilai ini menjadi true.
   */
  const [routeRequested, setRouteRequested] =
    useState(false);

  /**
   * Tujuan yang dipilih dari Sidebar.
   *
   * Nilainya berupa ID road node.
   */
  const {
    selectedDestination,
  } = useRouting();

  /**
   * Lokasi Toyagama yang dipilih.
   *
   * Digunakan untuk menampilkan
   * marker tujuan pada peta.
   */
  const [selectedLocation, setSelectedLocation] =
    useState<
      (typeof toyagamaLocations)[number] | null
    >(null);

  /* =====================================================
     DASHBOARD DATA
     ===================================================== */

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [summaryData] =
          await Promise.all([
            getDashboardSummary({
              days: 14,
            }),

            getPatientQueue({
              page: 1,
              limit: 5,
            }),
          ]);

        void summaryData;

        setLastUpdate(
          new Date().toLocaleTimeString()
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to fetch dashboard data."
        );
      }
    }

    fetchDashboard();
  }, []);

  /* =====================================================
     LIVE GPS LOCATION
     ===================================================== */

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(
        "Browser Anda tidak mendukung fitur lokasi."
      );

      return;
    }

    const watchId =
      navigator.geolocation.watchPosition(
        (position) => {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          setUserLocation({
            latitude,
            longitude,
          });

          setLastUpdate(
            new Date().toLocaleTimeString()
          );

          setError("");
        },

        (locationError) => {
          console.error(
            "GPS error:",
            locationError
          );

          switch (
            locationError.code
          ) {
            case locationError.PERMISSION_DENIED:
              setError(
                "Izin lokasi ditolak. Silakan izinkan akses lokasi pada browser."
              );
              break;

            case locationError.POSITION_UNAVAILABLE:
              setError(
                "Lokasi perangkat tidak tersedia. Pastikan GPS atau layanan lokasi aktif."
              );
              break;

            case locationError.TIMEOUT:
              setError(
                "Pengambilan lokasi terlalu lama. Silakan coba lagi."
              );
              break;

            default:
              setError(
                "Lokasi perangkat tidak dapat diperoleh."
              );
          }
        },

        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000,
        }
      );

    return () => {
      navigator.geolocation.clearWatch(
        watchId
      );
    };
  }, []);

  /* =====================================================
     LOAD SELECTED TOYAGAMA
     ===================================================== */

  useEffect(() => {
    /**
     * Membaca tujuan Toyagama yang
     * disimpan oleh Sidebar.
     */
    const loadSelectedDestination = () => {
      const savedDestination =
        localStorage.getItem(
          "toyagama-selected-destination"
        );

      /**
       * Kalau belum ada tujuan,
       * kosongkan marker.
       */
      if (!savedDestination) {
        setSelectedLocation(
          null
        );

        return;
      }

      try {
        const destination =
          JSON.parse(
            savedDestination
          );

        /**
         * Cari lokasi berdasarkan ID
         * dari data toyagamaLocations.
         */
        const matchedLocation =
          toyagamaLocations.find(
            (location) =>
              location.id ===
              destination.id
          );

        if (matchedLocation) {
          setSelectedLocation(
            matchedLocation
          );

          console.log(
            "=== TOYAGAMA TERPILIH ==="
          );

          console.log(
            "Nama:",
            matchedLocation.name
          );

          console.log(
            "Latitude:",
            matchedLocation.latitude
          );

          console.log(
            "Longitude:",
            matchedLocation.longitude
          );

          console.log(
            "Road Node:",
            destination.nodeId
          );

          console.log(
            "=========================="
          );
        } else {
          /**
           * Fallback jika ID tidak ditemukan
           * di toyagamaLocations.
           */
          setSelectedLocation({
            id: destination.id,
            name: destination.name,
            address: destination.address,
            latitude:
              destination.latitude,
            longitude:
              destination.longitude,
          });
        }
      } catch (parseError) {
        console.error(
          "Gagal membaca tujuan Toyagama:",
          parseError
        );

        setSelectedLocation(
          null
        );
      }
    };

    /**
     * Load saat Beranda pertama kali dibuka.
     */
    loadSelectedDestination();

    /**
     * Event dikirim oleh Sidebar
     * setelah user memilih Toyagama.
     */
    window.addEventListener(
      "toyagama-destination-selected",
      loadSelectedDestination
    );

    return () => {
      window.removeEventListener(
        "toyagama-destination-selected",
        loadSelectedDestination
      );
    };
  }, []);

  /* =====================================================
     ROUTE REQUEST
     ===================================================== */

  useEffect(() => {
    /**
     * Event dikirim oleh Sidebar
     * ketika user menekan:
     *
     * "Cari Rute Terbaik"
     */
    const handleRouteRequest =
      () => {
        console.log(
          "=== REQUEST RUTE DITERIMA ==="
        );

        setRouteRequested(
          true
        );
      };

    window.addEventListener(
      "route-requested",
      handleRouteRequest
    );

    return () => {
      window.removeEventListener(
        "route-requested",
        handleRouteRequest
      );
    };
  }, []);

    /* =====================================================
     ROUTE CANCELLATION
     ===================================================== */

  useEffect(() => {
    const handleRouteCancelled = () => {
      console.log(
        "=== RUTE DIBATALKAN ==="
      );

      setRoute(null);
      setError("");
    };

    window.addEventListener(
      "route-cancelled",
      handleRouteCancelled
    );

    return () => {
      window.removeEventListener(
        "route-cancelled",
        handleRouteCancelled
      );
    };
  }, []);

  /* =====================================================
     A* ROUTING
     ===================================================== */

  useEffect(() => {
    /**
     * A* belum diminta user.
     *
     * Jadi jangan mencari rute.
     */
    if (!routeRequested) {
      return;
    }

    /**
     * Setelah request diterima,
     * reset kembali supaya event berikutnya
     * dapat memicu pencarian baru.
     */
    setRouteRequested(false);

    /**
     * Belum ada GPS.
     */
    if (!userLocation) {
      console.warn(
        "A*: Lokasi pengguna belum tersedia."
      );

      setRoute(null);

      setError(
        "Lokasi Anda belum tersedia. Silakan gunakan lokasi GPS terlebih dahulu."
      );

      return;
    }

    /**
     * Belum ada tujuan.
     */
    if (!selectedDestination) {
      console.warn(
        "A*: Tujuan belum dipilih."
      );

      setRoute(null);

      setError(
        "Silakan pilih tujuan Toyagama terlebih dahulu."
      );

      return;
    }

    /**
     * Pastikan road network tersedia.
     */
    if (
      roadNodes.length === 0 ||
      roadEdges.length === 0
    ) {
      console.warn(
        "A*: Road network kosong."
      );

      setRoute(null);

      setError(
        "Jaringan jalan belum tersedia."
      );

      return;
    }

    /**
     * START
     *
     * Road node terdekat dari
     * lokasi GPS pengguna.
     */
    const startNode =
      findNearestRoadNode(
        userLocation.latitude,
        userLocation.longitude
      );

    /**
     * GOAL
     *
     * Road node tujuan yang dipilih
     * melalui Sidebar.
     */
    const goalNode =
      roadNodes.find(
        (node) =>
          node.id ===
          selectedDestination
      );

    if (!startNode) {
      console.warn(
        "A*: Start road node tidak ditemukan."
      );

      setRoute(null);

      setError(
        "Road node dari lokasi Anda tidak ditemukan."
      );

      return;
    }

    if (!goalNode) {
      console.warn(
        "A*: Goal road node tidak ditemukan:",
        selectedDestination
      );

      setRoute(null);

      setError(
        "Road node tujuan tidak ditemukan."
      );

      return;
    }

    console.log(
      "========== A* ROUTING =========="
    );

    console.log(
      "Start Node:",
      startNode
    );

    console.log(
      "Goal Node:",
      goalNode
    );

    console.log(
      "Goal Node ID:",
      selectedDestination
    );

    /**
     * Jalankan algoritma A*.
     *
     * A* mengambil jaringan jalan
     * langsung dari roadNetwork.ts.
     */
    const result = aStar(
      startNode.id,
      goalNode.id
    );

    if (!result) {
      console.warn(
        "A*: Rute tidak ditemukan."
      );

      setRoute(null);

      setError(
        "Rute menuju Toyagama tidak ditemukan."
      );

      return;
    }

    console.log(
      "A*: Rute berhasil ditemukan."
    );

    console.log(
      "Jumlah node:",
      result.path.length
    );

    console.log(
      "Jarak rute:",
      result.distance.toFixed(3),
      "km"
    );

    console.log(
      "Route:",
      result.path
    );

    console.log(
      "================================"
    );

    setRoute(
      result.path
    );

    setError("");
    window.dispatchEvent(new Event("route-found"));
  }, [
    routeRequested,
    userLocation,
    selectedDestination,
  ]);

  /* =====================================================
     PAGE
     ===================================================== */

  return (
    <div className="relative min-h-screen w-full bg-slate-100">

      {/* CONTENT */}
      <div className="flex min-h-screen flex-col p-6 pt-20">

        {/* HEADER */}
        <div className="mb-5 rounded-2xl bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Maps
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Find Toyagama locations and nearby destinations.
              </p>
            </div>

            <div className="text-sm text-slate-500">
              Last Update:{" "}
              <span className="font-semibold text-slate-800">
                {lastUpdate || "-"}
              </span>
            </div>

          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* SELECTED DESTINATION */}
          {selectedLocation && (
            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">

              <div className="font-semibold">
                Tujuan Toyagama
              </div>

              <div className="mt-1">
                Tujuan:{" "}
                <span className="font-semibold">
                  {
                    selectedLocation.name
                  }
                </span>
              </div>

              <div className="mt-1">
                Alamat:{" "}
                <span className="font-semibold">
                  {
                    selectedLocation.address
                  }
                </span>
              </div>

              {selectedDestination && (
                <div className="mt-1">
                  Goal Node:{" "}
                  <span className="font-semibold">
                    {
                      selectedDestination
                    }
                  </span>
                </div>
              )}

              {!route && (
                <div className="mt-2 text-xs text-blue-500">
                  Tekan &quot;Cari Rute Terbaik&quot;
                  pada Sidebar untuk mencari
                  rute menggunakan A*.
                </div>
              )}

            </div>
          )}

          {/* ROUTE INFORMATION */}
          {selectedLocation &&
            route && (
              <div className="mt-4 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">

                <div className="font-semibold">
                  Rute A* ditemukan
                </div>

                <div className="mt-1">
                  Tujuan:{" "}
                  <span className="font-semibold">
                    {
                      selectedLocation.name
                    }
                  </span>
                </div>

                <div className="mt-1">
                  Goal Node:{" "}
                  <span className="font-semibold">
                    {
                      selectedDestination
                    }
                  </span>
                </div>

                <div className="mt-1">
                  Jumlah node rute:{" "}
                  <span className="font-semibold">
                    {route.length}
                  </span>
                </div>

                <div className="mt-1">
                  Status:{" "}
                  <span className="font-semibold">
                    Rute berhasil ditemukan
                  </span>
                </div>

              </div>
            )}

          {/* DESTINATION STATUS */}
          {!selectedDestination && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Silakan pilih tujuan Toyagama melalui
              Sidebar.
            </div>
          )}

        </div>

        {/* MAP */}
        <div className="min-h-0 flex-1">

          <div className="relative isolate h-[calc(100vh-190px)] min-h-125 overflow-hidden rounded-2xl bg-white p-2 shadow-sm">

            <LocationsMap
              locations={
                toyagamaLocations
              }
              userLocation={
                userLocation
              }
              selectedLocation={
                selectedLocation
              }
              route={route}
            />

          </div>

        </div>

      </div>
    </div>
  );
}