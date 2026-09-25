export type ToyagamaLocation = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export const toyagamaLocations: ToyagamaLocation[] = [
  {
    id: 1,
    name: "Toyagama Yogyakarta",
    address: "Yogyakarta, DI Yogyakarta",
    latitude: -7.7956,
    longitude: 110.3695,
  },
  {
    id: 2,
    name: "Toyagama Sleman",
    address: "Sleman, DI Yogyakarta",
    latitude: -7.7169,
    longitude: 110.3556,
  },
  {
    id: 3,
    name: "Toyagama Bantul",
    address: "Bantul, DI Yogyakarta",
    latitude: -7.8881,
    longitude: 110.3282,
  },
  {
    id: 4,
    name: "Toyagama Kota Yogyakarta",
    address: "Kota Yogyakarta, DI Yogyakarta",
    latitude: -7.8014,
    longitude: 110.3647,
  },
];

export function calculateDistance(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
): number {
  const earthRadius = 6371;

  const dLatitude = ((latitude2 - latitude1) * Math.PI) / 180;
  const dLongitude = ((longitude2 - longitude1) * Math.PI) / 180;

  const latitude1Radians = (latitude1 * Math.PI) / 180;
  const latitude2Radians = (latitude2 * Math.PI) / 180;

  const a =
    Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) +
    Math.cos(latitude1Radians) *
      Math.cos(latitude2Radians) *
      Math.sin(dLongitude / 2) *
      Math.sin(dLongitude / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}