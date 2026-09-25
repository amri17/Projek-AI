import roadsData from "@/app/data/osm/roads.json";

/* =========================================================
   TYPE
   ========================================================= */

export type RoadNode = {
  id: string;
  latitude: number;
  longitude: number;
};

export type RoadEdge = {
  id: string;
  from: string;
  to: string;
  distance: number;
  roadName: string | null;
  highway: string | null;
};

type GeoJSONGeometry = {
  type?: string;
  coordinates?: unknown;
};

type GeoJSONFeature = {
  type?: string;
  id?: string | number;
  properties?: Record<string, unknown>;
  geometry?: GeoJSONGeometry | null;
};

type RoadsGeoJSON = {
  type?: string;
  features?: GeoJSONFeature[];
};

/* =========================================================
   DATA
   ========================================================= */

const roads = roadsData as unknown as RoadsGeoJSON;

/* =========================================================
   HAVERSINE DISTANCE
   ========================================================= */

export function calculateRoadDistance(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
): number {
  const earthRadius = 6371;

  const latitude1Radians =
    (latitude1 * Math.PI) / 180;

  const latitude2Radians =
    (latitude2 * Math.PI) / 180;

  const deltaLatitude =
    ((latitude2 - latitude1) * Math.PI) / 180;

  const deltaLongitude =
    ((longitude2 - longitude1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatitude / 2) *
      Math.sin(deltaLatitude / 2) +
    Math.cos(latitude1Radians) *
      Math.cos(latitude2Radians) *
      Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}

/* =========================================================
   COORDINATE TYPE
   ========================================================= */

type Coordinate = [number, number];

/*
 * GeoJSON menggunakan:
 *
 * [longitude, latitude]
 */

function isCoordinate(
  value: unknown
): value is Coordinate {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}

/* =========================================================
   CONVERT COORDINATES
   ========================================================= */

function convertCoordinates(
  coordinates: unknown
): Coordinate[] {
  if (!Array.isArray(coordinates)) {
    return [];
  }

  const result: Coordinate[] = [];

  for (const coordinate of coordinates) {
    if (!isCoordinate(coordinate)) {
      continue;
    }

    const longitude = coordinate[0];
    const latitude = coordinate[1];

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      continue;
    }

    result.push([
      longitude,
      latitude,
    ]);
  }

  return result;
}

/* =========================================================
   NODE STORAGE
   ========================================================= */

/*
 * Kita menggunakan Map supaya titik yang sama
 * tidak dibuat berkali-kali.
 *
 * Key:
 * latitude,longitude
 */

const nodeMap =
  new Map<string, RoadNode>();

const edgeList: RoadEdge[] = [];

/* =========================================================
   NODE ID
   ========================================================= */

function createNodeKey(
  latitude: number,
  longitude: number
): string {
  /*
   * Pembulatan digunakan supaya dua koordinat
   * yang secara praktis sama dianggap sebagai
   * node yang sama.
   */
  return `${latitude.toFixed(7)},${longitude.toFixed(7)}`;
}

/* =========================================================
   GET / CREATE NODE
   ========================================================= */

function getOrCreateNode(
  latitude: number,
  longitude: number
): RoadNode {
  const key = createNodeKey(
    latitude,
    longitude
  );

  const existingNode =
    nodeMap.get(key);

  if (existingNode) {
    return existingNode;
  }

  const node: RoadNode = {
    id: `node-${nodeMap.size + 1}`,
    latitude,
    longitude,
  };

  nodeMap.set(key, node);

  return node;
}

/* =========================================================
   ADD EDGE
   ========================================================= */

function addEdge(
  from: RoadNode,
  to: RoadNode,
  roadName: string | null,
  highway: string | null
) {
  /*
   * Jangan membuat edge jika titiknya sama.
   */
  if (from.id === to.id) {
    return;
  }

  const distance =
    calculateRoadDistance(
      from.latitude,
      from.longitude,
      to.latitude,
      to.longitude
    );

  const edge: RoadEdge = {
    id: `edge-${edgeList.length + 1}`,
    from: from.id,
    to: to.id,
    distance,
    roadName,
    highway,
  };

  edgeList.push(edge);
}

/* =========================================================
   PROCESS LINE STRING
   ========================================================= */

function processLineString(
  coordinates: unknown,
  properties:
    | Record<string, unknown>
    | undefined
) {
  const converted =
    convertCoordinates(coordinates);

  if (converted.length < 2) {
    return;
  }

  const roadName =
    typeof properties?.name === "string"
      ? properties.name
      : null;

  const highway =
    typeof properties?.highway === "string"
      ? properties.highway
      : null;

  /*
   * Setiap dua titik berurutan menjadi edge.
   *
   * P1 ---- P2 ---- P3 ---- P4
   *
   * menjadi:
   *
   * P1-P2
   * P2-P3
   * P3-P4
   */

  for (
    let index = 0;
    index < converted.length - 1;
    index++
  ) {
    const current =
      converted[index];

    const next =
      converted[index + 1];

    /*
     * GeoJSON:
     * [longitude, latitude]
     *
     * Leaflet:
     * [latitude, longitude]
     */

    const from =
      getOrCreateNode(
        current[1],
        current[0]
      );

    const to =
      getOrCreateNode(
        next[1],
        next[0]
      );

    addEdge(
      from,
      to,
      roadName,
      highway
    );
  }
}

/* =========================================================
   PROCESS MULTI LINE STRING
   ========================================================= */

function processMultiLineString(
  coordinates: unknown,
  properties:
    | Record<string, unknown>
    | undefined
) {
  if (!Array.isArray(coordinates)) {
    return;
  }

  for (const line of coordinates) {
    processLineString(
      line,
      properties
    );
  }
}

/* =========================================================
   BUILD ROAD NETWORK
   ========================================================= */

if (Array.isArray(roads.features)) {
  for (const feature of roads.features) {
    const geometry =
      feature.geometry;

    if (!geometry) {
      continue;
    }

    if (
      geometry.type ===
      "LineString"
    ) {
      processLineString(
        geometry.coordinates,
        feature.properties
      );
    }

    if (
      geometry.type ===
      "MultiLineString"
    ) {
      processMultiLineString(
        geometry.coordinates,
        feature.properties
      );
    }
  }
}

/* =========================================================
   FINAL DATA
   ========================================================= */

export const roadNodes: RoadNode[] =
  Array.from(nodeMap.values());

export const roadEdges: RoadEdge[] =
  edgeList;

/* =========================================================
   HELPERS
   ========================================================= */

export function getRoadNodes(): RoadNode[] {
  return roadNodes;
}

export function getRoadEdges(): RoadEdge[] {
  return roadEdges;
}

export function getRoadNodeById(
  id: string
): RoadNode | undefined {
  return roadNodes.find(
    (node) => node.id === id
  );
}

/* =========================================================
   STATISTICS
   ========================================================= */

export function getRoadNetworkStatistics() {
  return {
    nodeCount: roadNodes.length,
    edgeCount: roadEdges.length,
  };
}

/* =========================================================
   FIND NEAREST NODE
   ========================================================= */

export function findNearestRoadNode(
  latitude: number,
  longitude: number
): RoadNode | null {
  if (roadNodes.length === 0) {
    return null;
  }

  let nearestNode =
    roadNodes[0];

  let nearestDistance =
    calculateRoadDistance(
      latitude,
      longitude,
      nearestNode.latitude,
      nearestNode.longitude
    );

  for (
    let index = 1;
    index < roadNodes.length;
    index++
  ) {
    const node =
      roadNodes[index];

    const distance =
      calculateRoadDistance(
        latitude,
        longitude,
        node.latitude,
        node.longitude
      );

    if (
      distance < nearestDistance
    ) {
      nearestDistance =
        distance;

      nearestNode =
        node;
    }
  }

  return nearestNode;
}

/* =========================================================
   FIND EDGES CONNECTED TO NODE
   ========================================================= */

export function getConnectedEdges(
  nodeId: string
): RoadEdge[] {
  return roadEdges.filter(
    (edge) =>
      edge.from === nodeId ||
      edge.to === nodeId
  );
}