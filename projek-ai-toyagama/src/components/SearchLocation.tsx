"use client";

import { useMemo, useState } from "react";

import type { ToyagamaLocation } from "@/lib/locations";

type SearchLocationProps = {
  locations: ToyagamaLocation[];
  onSelect: (location: ToyagamaLocation) => void;
};

export default function SearchLocation({
  locations,
  onSelect,
}: SearchLocationProps) {
  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return [];
    }

    return locations.filter((location) => {
      return (
        location.name.toLowerCase().includes(keyword) ||
        location.address.toLowerCase().includes(keyword)
      );
    });
  }, [search, locations]);

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="toyagama-search"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Cari Lokasi Toyagama
        </label>

        <div className="relative">
          <input
            id="toyagama-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari Toyagama..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
          />

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔎
          </span>
        </div>
      </div>

      {search.trim() && (
        <div className="space-y-2">
          {results.length > 0 ? (
            results.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => onSelect(location)}
                className="w-full rounded-xl border border-slate-100 bg-white p-3 text-left transition hover:bg-slate-50"
              >
                <p className="text-sm font-semibold text-slate-800">
                  {location.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {location.address}
                </p>
              </button>
            ))
          ) : (
            <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
              Lokasi Toyagama tidak ditemukan.
            </div>
          )}
        </div>
      )}
    </div>
  );
}