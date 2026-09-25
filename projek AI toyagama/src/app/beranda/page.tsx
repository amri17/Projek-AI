"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import {
  getDashboardSummary,
  getPatientQueue,
} from "@/lib/api";

import { toyagamaLocations } from "@/lib/locations";

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
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [userLocation, setUserLocation] =
    useState<UserLocation | null>(null);

  /* =====================================================
     DASHBOARD DATA
     ===================================================== */

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [summaryData] = await Promise.all([
          getDashboardSummary({ days: 14 }),
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

          /*
           * Hapus error GPS ketika lokasi
           * berhasil diperoleh.
           */
          setError("");
        },
        (locationError) => {
          console.error(
            "GPS error:",
            locationError
          );

          switch (locationError.code) {
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

    /*
     * Hentikan pemantauan GPS ketika halaman
     * tidak lagi digunakan.
     */
    return () => {
      navigator.geolocation.clearWatch(
        watchId
      );
    };
  }, []);

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

          {error && (
            <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* MAP */}
        <div className="min-h-0 flex-1">
          <div className="relative isolate h-[calc(100vh-190px)] min-h-[500px] overflow-hidden rounded-2xl bg-white p-2 shadow-sm">
            
            <LocationsMap
              locations={toyagamaLocations}
              userLocation={userLocation}
              selectedLocation={null}
            />

          </div>
        </div>

      </div>
    </div>
  );
}