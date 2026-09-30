"use client";

import { useEffect, useMemo } from "react";

import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import type {
  ToyagamaLocation,
} from "@/lib/locations";

import type {
  RoadNode,
} from "@/lib/roadNetwork";

import {
  roadNodes,
  roadEdges,
} from "@/lib/roadNetwork";

/* =========================================================
   TYPES
   ========================================================= */

type UserLocation = {
  latitude: number;
  longitude: number;
};

type LocationsMapProps = {
  locations: ToyagamaLocation[];
  userLocation: UserLocation | null;
  selectedLocation: ToyagamaLocation | null;

  /**
   * Hasil algoritma A*
   *
   * Berisi urutan node yang membentuk
   * rute dari posisi pengguna menuju tujuan.
   */
  route: RoadNode[] | null;
};

/* =========================================================
   MARKER ICONS
   ========================================================= */

const userIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],

  popupAnchor: [1, -34],
});

const toyagamaIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],

  popupAnchor: [1, -34],
});

/* =========================================================
   MAP CONTROLLER
   ========================================================= */

function MapController({
  userLocation,
  selectedLocation,
}: {
  userLocation: UserLocation | null;
  selectedLocation: ToyagamaLocation | null;
}) {
  const map = useMap();

  /* -------------------------------------------------------
     INVALIDATE SIZE
     ------------------------------------------------------- */

  useEffect(() => {
    const timeout =
      window.setTimeout(() => {
        map.invalidateSize();
      }, 300);

    return () => {
      window.clearTimeout(
        timeout
      );
    };
  }, [map]);

  /* -------------------------------------------------------
     SELECTED TOYAGAMA
     ------------------------------------------------------- */

  useEffect(() => {
    if (!selectedLocation) {
      return;
    }

    map.flyTo(
      [
        selectedLocation.latitude,
        selectedLocation.longitude,
      ],
      15,
      {
        duration: 1,
      }
    );
  }, [
    selectedLocation,
    map,
  ]);

  /* -------------------------------------------------------
     USER LOCATION
     ------------------------------------------------------- */

  useEffect(() => {
    if (
      !userLocation ||
      selectedLocation
    ) {
      return;
    }

    map.flyTo(
      [
        userLocation.latitude,
        userLocation.longitude,
      ],
      14,
      {
        duration: 1,
      }
    );
  }, [
    userLocation,
    selectedLocation,
    map,
  ]);

  return null;
}

/* =========================================================
   MAIN MAP
   ========================================================= */

export default function LocationsMap({
  locations,
  userLocation,
  selectedLocation,
  route,
}: LocationsMapProps) {
  const defaultCenter: [
    number,
    number
  ] = [
    -7.7956,
    110.3695,
  ];

  /* =======================================================
     ROAD NODE LOOKUP
     
     Daripada menggunakan roadNodes.find() berulang kali
     untuk setiap edge, kita buat Map berdasarkan node ID.
     ======================================================= */

  const roadNodeMap =
    useMemo(() => {
      const map =
        new Map<
          string,
          RoadNode
        >();

      for (
        const node of roadNodes
      ) {
        map.set(
          node.id,
          node
        );
      }

      return map;
    }, []);

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl">

      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >

        {/* =================================================
            BASE MAP
            ================================================= */}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* =================================================
            MAP CONTROLLER
            ================================================= */}

        <MapController
          userLocation={
            userLocation
          }
          selectedLocation={
            selectedLocation
          }
        />

        {/* =================================================
            A* ROUTE
            =================================================

            Route berisi:

            START
              ↓
            Node 1
              ↓
            Node 2
              ↓
            Node 3
              ↓
            GOAL

            Semua node tersebut kemudian
            digambar sebagai satu Polyline.
            ================================================= */}

        {route &&
          route.length > 1 && (
            <Polyline
              positions={route.map(
                (node) =>
                  [
                    node.latitude,
                    node.longitude,
                  ] as [
                    number,
                    number
                  ]
              )}
              pathOptions={{
                color:
                  "#2563eb",
                weight: 6,
                opacity: 0.9,
              }}
            >
              <Popup>
                <div className="min-w-[180px]">

                  <p className="font-semibold text-slate-800">
                    Rute A*
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Rute dihitung menggunakan
                    algoritma A* berdasarkan
                    jaringan jalan.
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    Jumlah node:{" "}
                    {route.length}
                  </p>

                </div>
              </Popup>
            </Polyline>
          )}

        {/* =================================================
            ROAD EDGES
            ================================================= */}

        {roadEdges.map(
          (edge) => {
            const from =
              roadNodeMap.get(
                edge.from
              );

            const to =
              roadNodeMap.get(
                edge.to
              );

            if (
              !from ||
              !to
            ) {
              return null;
            }

            return (
              <Polyline
                key={edge.id}
                positions={[
                  [
                    from.latitude,
                    from.longitude,
                  ],
                  [
                    to.latitude,
                    to.longitude,
                  ],
                ]}
                pathOptions={{
                  color:
                    "#64748b",
                  weight: 2,
                  opacity: 0.65,
                }}
              >
                <Popup>

                  <div className="min-w-[180px]">

                    <p className="font-semibold text-slate-800">
                      {edge.roadName ||
                        "Jalan"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Highway:{" "}
                      {edge.highway ||
                        "-"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Jarak:{" "}
                      {edge.distance.toFixed(
                        3
                      )}{" "}
                      km
                    </p>

                  </div>

                </Popup>
              </Polyline>
            );
          }
        )}

        {/* =================================================
            ROAD NODES
            ================================================= */}

        {roadNodes.map(
          (node) => (
            <CircleMarker
              key={node.id}
              center={[
                node.latitude,
                node.longitude,
              ]}
              radius={2.5}
              pathOptions={{
                color:
                  "#334155",

                fillColor:
                  "#ffffff",

                fillOpacity: 1,

                weight: 1,
              }}
            >

              <Popup>

                <div className="text-xs">

                  <p className="font-semibold text-slate-800">
                    Road Node
                  </p>

                  <p className="mt-1 text-slate-500">
                    ID:{" "}
                    {node.id}
                  </p>

                  <p className="mt-1 text-slate-500">
                    Lat:{" "}
                    {node.latitude.toFixed(
                      6
                    )}
                  </p>

                  <p className="text-slate-500">
                    Lon:{" "}
                    {node.longitude.toFixed(
                      6
                    )}
                  </p>

                </div>

              </Popup>

            </CircleMarker>
          )
        )}

        {/* =================================================
            USER LOCATION
            ================================================= */}

        {userLocation && (
          <Marker
            position={[
              userLocation.latitude,
              userLocation.longitude,
            ]}
            icon={userIcon}
          >

            <Popup>

              <div className="text-sm">

                <p className="font-semibold text-slate-800">
                  Lokasi Anda
                </p>

                <p className="mt-1 text-gray-600">
                  Lokasi berdasarkan
                  GPS perangkat.
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Lat:{" "}
                  {userLocation.latitude.toFixed(
                    6
                  )}
                </p>

                <p className="text-xs text-slate-500">
                  Lon:{" "}
                  {userLocation.longitude.toFixed(
                    6
                  )}
                </p>

              </div>

            </Popup>

          </Marker>
        )}

        {/* =================================================
            TOYAGAMA LOCATIONS
            ================================================= */}

        {locations.map(
          (location) => (
            <Marker
              key={location.id}
              position={[
                location.latitude,
                location.longitude,
              ]}
              icon={
                toyagamaIcon
              }
            >

              <Popup>

                <div className="min-w-[180px]">

                  <p className="font-semibold text-gray-800">
                    {location.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {location.address}
                  </p>

                </div>

              </Popup>

            </Marker>
          )
        )}

      </MapContainer>

    </div>
  );
}
