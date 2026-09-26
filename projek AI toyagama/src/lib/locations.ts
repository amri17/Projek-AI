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
  {
    id: 5,
    name: "Toyagama DTETI FT UGM",
    address: "Komplek Fakultas Teknik UGM",
    latitude: -7.765791,
    longitude: 110.371650,
  },
  {
    id: 6,
    name: "Toyagama DTK FT UGM",
    address: "Komplek Fakultas Teknik UGM",
    latitude: -7.765350,
    longitude: 110.371387,
  },
  {
    id: 7,
    name: "Toyagama DTMI FT UGM",
    address: "Komplek Fakultas Teknik UGM",
    latitude: -7.765680,
    longitude: 110.371257,
  },
  {
    id: 8,
    name: "Toyagama Masjid Teknik",
    address: "Komplek Fakultas Teknik UGM",
    latitude: -7.764691,
    longitude: 110.372114,
  },
  {
    id: 9,
    name: "Toyagama DTGL FT UGM",
    address: "Komplek Fakultas Teknik UGM",
    latitude: -7.765716,
    longitude: 110.373071,
  },
  {
    id: 10,
    name: "Toyagama DTNTF FT UGM",
    address: "Komplek Fakultas Teknik UGM",
    latitude: -7.765594,
    longitude: 110.372994,
  },
  {
    id: 11,
    name: "Toyagama DTAP FT UGM",
    address: "Komplek Fakultas Teknik UGM",
    latitude: -7.764268,
    longitude: 110.371962,
  },
  {
    id: 12,
    name: "Toyagama DTGD FT UGM",
    address: "Komplek Fakultas Teknik UGM",
    latitude: -7.763983,
    longitude: 110.372344,
  },
  {
    id: 13,
    name: "Toyagama DTSL FT UGM",
    address: "Komplek Fakultas Teknik UGM",
    latitude: -7.764137,
    longitude: 110.372919,
  },
  {
    id: 14,
    name: "Toyagama Perpustakaan FT UGM",
    address: "Komplek Fakultas Teknik UGM",
    latitude: -7.765662,
    longitude: 110.372539,
  }
  /*

  Toyagama DTNTF FT UGM 
  Lat: -7.765594
  Lon: 110.372994

  Toyagama DTAP FT UGM
  Lat: -7.764268
  Lon: 110.371962

  Toyagama DTGD FT UGM 
  Lat: -7.763983
  Lon: 110.372344

  Toyagama DTSL FT UGM 
  Lat: -7.764137
  Lon: 110.372919

  Toyagama Perpustaaakn FT UGM
  Lat: -7.765662
  Lon: 110.372539
  */
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