"use client";

import { useMemo } from "react";

import {
  calculateDistance,
  type ToyagamaLocation,
} from "@/lib/locations";

type UserLocation = {
  latitude: number;
  longitude: number;
};

type NearbyToyagamaProps = {
  userLocation: UserLocation | null;
  locations: ToyagamaLocation[];
  onSelect: (location: ToyagamaLocation) => void;
};

type NearbyLocation = ToyagamaLocation & {
  distance: number;
};

export default function NearbyToyagama({
  userLocation,
  locations,
  onSelect,
}: NearbyToyagamaProps) {
  const nearbyLocations = useMemo<NearbyLocation[]>(() => {
    if (!userLocation) {
      return [];
    }

    return locations
      .map((location) => ({
        ...location,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          location.latitude,
          location.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }, [userLocation, locations]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">
          Toyagama Terdekat
        </h2>

        <span className="text-xs text-slate-400">
          {nearbyLocations.length} lokasi
        </span>
      </div>

      {!userLocation ? (
        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          Aktifkan lokasi GPS untuk melihat Toyagama terdekat.
        </div>
      ) : nearbyLocations.length === 0 ? (
        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          Belum ada data lokasi Toyagama.
        </div>
      ) : (
        <div className="space-y-2">
          {nearbyLocations.map((location) => (
            <button
              key={location.id}
              type="button"
              onClick={() => onSelect(location)}
              className="w-full rounded-xl border border-slate-100 bg-white p-3 text-left transition hover:border-slate-200 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {location.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {location.address}
                  </p>
                </div>

                <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                  {location.distance < 1
                    ? `${Math.round(location.distance * 1000)} m`
                    : `${location.distance.toFixed(1)} km`}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}