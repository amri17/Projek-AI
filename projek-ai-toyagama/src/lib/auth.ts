// Database dummy pengguna (prototype statis)
export const USERS = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    nama: "Administrator",
    role: "Super Admin",
  },
  {
    id: 2,
    username: "kepala",
    password: "kepala123",
    nama: "Dr. Suwardi",
    role: "Kepala Balai",
  },
  {
    id: 3,
    username: "petugas",
    password: "petugas123",
    nama: "Rini Marlina",
    role: "Petugas Rehabilitasi",
  },
];

export function findUser(username: string, password: string) {
  return USERS.find(
    (u) => u.username === username && u.password === password
  ) ?? null;
}
