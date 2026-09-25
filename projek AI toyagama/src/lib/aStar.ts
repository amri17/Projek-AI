import {
  roadEdges,
  roadNodes,
} from "@/lib/roadNetwork";

import type {
  RoadNode,
  RoadEdge,
} from "@/lib/roadNetwork";

export type AStarResult = {
  path: RoadNode[];
  distance: number;
};

function calculateDistance(
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

/**
 * Heuristic A*
 *
 * Menggunakan jarak garis lurus dari node
 * menuju tujuan.
 */
function heuristic(
  current: RoadNode,
  goal: RoadNode
): number {
  return calculateDistance(
    current.latitude,
    current.longitude,
    goal.latitude,
    goal.longitude
  );
}

/**
 * Mencari node dengan nilai fScore terkecil.
 */
function getLowestFScoreNode(
  openSet: Set<string>,
  fScore: Map<string, number>
): string | null {
  let bestNode: string | null = null;
  let bestScore = Infinity;

  for (const nodeId of openSet) {
    const score =
      fScore.get(nodeId) ?? Infinity;

    if (score < bestScore) {
      bestScore = score;
      bestNode = nodeId;
    }
  }

  return bestNode;
}

/**
 * A* pathfinding
 *
 * Sistem hanya memberikan:
 *
 * 1. startNodeId
 * 2. goalNodeId
 *
 * Road nodes dan road edges
 * diambil langsung dari roadNetwork.
 */
export function aStar(
  startNodeId: string,
  goalNodeId: string
): AStarResult | null {
  /**
   * Pastikan data road network tersedia.
   */
  if (roadNodes.length === 0) {
    console.warn(
      "A*: Road nodes kosong."
    );

    return null;
  }

  if (roadEdges.length === 0) {
    console.warn(
      "A*: Road edges kosong."
    );

    return null;
  }

  /**
   * Membuat lookup node berdasarkan ID.
   */
  const nodeMap =
    new Map<string, RoadNode>();

  for (const node of roadNodes) {
    nodeMap.set(
      node.id,
      node
    );
  }

  /**
   * Ambil START dan GOAL.
   */
  const startNode =
    nodeMap.get(
      startNodeId
    );

  const goalNode =
    nodeMap.get(
      goalNodeId
    );

  if (!startNode) {
    console.warn(
      "A*: Start node tidak ditemukan:",
      startNodeId
    );

    return null;
  }

  if (!goalNode) {
    console.warn(
      "A*: Goal node tidak ditemukan:",
      goalNodeId
    );

    return null;
  }

  /**
   * adjacency:
   *
   * node A
   *   ↓
   * edge
   *   ↓
   * node B
   */
  const adjacency =
    new Map<string, RoadEdge[]>();

  for (const edge of roadEdges) {
    if (
      !adjacency.has(
        edge.from
      )
    ) {
      adjacency.set(
        edge.from,
        []
      );
    }

    adjacency
      .get(edge.from)!
      .push(edge);
  }

  /**
   * openSet:
   *
   * Node yang masih perlu diperiksa.
   */
  const openSet =
    new Set<string>();

  /**
   * cameFrom:
   *
   * Menyimpan node sebelumnya
   * untuk membentuk kembali path.
   */
  const cameFrom =
    new Map<string, string>();

  /**
   * gScore:
   *
   * Jarak aktual dari START
   * menuju node tertentu.
   */
  const gScore =
    new Map<string, number>();

  /**
   * fScore:
   *
   * f(n) = g(n) + h(n)
   */
  const fScore =
    new Map<string, number>();

  /**
   * Inisialisasi START.
   */
  gScore.set(
    startNodeId,
    0
  );

  fScore.set(
    startNodeId,
    heuristic(
      startNode,
      goalNode
    )
  );

  openSet.add(
    startNodeId
  );

  /**
   * Proses A*
   */
  while (
    openSet.size > 0
  ) {
    /**
     * Ambil node dengan
     * fScore terkecil.
     */
    const currentId =
      getLowestFScoreNode(
        openSet,
        fScore
      );

    if (!currentId) {
      break;
    }

    /**
     * Jika current node sudah
     * mencapai GOAL.
     */
    if (
      currentId ===
      goalNodeId
    ) {
      const path =
        reconstructPath(
          cameFrom,
          currentId,
          nodeMap
        );

      return {
        path,
        distance:
          gScore.get(
            currentId
          ) ?? 0,
      };
    }

    /**
     * Node sekarang sudah diproses.
     */
    openSet.delete(
      currentId
    );

    /**
     * Ambil semua edge
     * yang keluar dari current node.
     */
    const neighbors =
      adjacency.get(
        currentId
      ) ?? [];

    /**
     * Periksa setiap tetangga.
     */
    for (
      const edge of neighbors
    ) {
      const neighborId =
        edge.to;

      /**
       * Hitung biaya menuju
       * node tetangga.
       */
      const tentativeGScore =
        (gScore.get(
          currentId
        ) ?? Infinity) +
        edge.distance;

      /**
       * Nilai gScore tetangga
       * sebelumnya.
       */
      const currentNeighborGScore =
        gScore.get(
          neighborId
        ) ?? Infinity;

      /**
       * Kalau jalur baru lebih pendek,
       * gunakan jalur tersebut.
       */
      if (
        tentativeGScore <
        currentNeighborGScore
      ) {
        /**
         * Simpan hubungan:
         *
         * neighbor ← current
         */
        cameFrom.set(
          neighborId,
          currentId
        );

        /**
         * Update jarak aktual.
         */
        gScore.set(
          neighborId,
          tentativeGScore
        );

        /**
         * Ambil node tetangga.
         */
        const neighborNode =
          nodeMap.get(
            neighborId
          );

        if (!neighborNode) {
          continue;
        }

        /**
         * Hitung:
         *
         * f(n) = g(n) + h(n)
         */
        const estimatedTotalCost =
          tentativeGScore +
          heuristic(
            neighborNode,
            goalNode
          );

        fScore.set(
          neighborId,
          estimatedTotalCost
        );

        /**
         * Masukkan tetangga
         * ke openSet.
         */
        openSet.add(
          neighborId
        );
      }
    }
  }

  /**
   * Tidak ditemukan jalan
   * dari START ke GOAL.
   */
  console.warn(
    "A*: Tidak ditemukan rute dari",
    startNodeId,
    "ke",
    goalNodeId
  );

  return null;
}

/**
 * Membentuk kembali path
 * dari GOAL → START.
 */
function reconstructPath(
  cameFrom: Map<string, string>,
  currentId: string,
  nodeMap: Map<string, RoadNode>
): RoadNode[] {
  const path: RoadNode[] = [];

  let current:
    | string
    | undefined =
    currentId;

  /**
   * Mulai dari GOAL,
   * kemudian mundur menuju START.
   */
  while (current) {
    const node =
      nodeMap.get(
        current
      );

    if (node) {
      path.push(node);
    }

    current =
      cameFrom.get(
        current
      );
  }

  /**
   * Karena path dibangun
   * dari GOAL → START,
   * balik menjadi:
   *
   * START → GOAL
   */
  path.reverse();

  return path;
}