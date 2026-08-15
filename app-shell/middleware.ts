// Aturan akses terpusat (setara "middleware" pada aplikasi berbasis server).
// Aplikasi ini adalah SPA, sehingga penegakan aturan dilakukan oleh penjaga
// rute (route guard) di app/App.tsx. Modul ini mendokumentasikan dan
// menyediakan pemetaan aturan agar mudah dirawat di satu tempat.

export type Role = "student" | "admin" | "guest";

// Prefiks rute yang dilindungi beserta peran yang diizinkan.
export const PROTECTED_ROUTES: { prefix: string; role: Exclude<Role, "guest"> }[] = [
  { prefix: "/app", role: "student" },
  { prefix: "/admin", role: "admin" },
];

// Menentukan tujuan pengalihan bila akses tidak sesuai. Mengembalikan null
// bila akses diizinkan.
export function resolveRedirect(pathname: string, role: Role): string | null {
  for (const rule of PROTECTED_ROUTES) {
    if (pathname === "/admin/login") return null;
    if (pathname.startsWith(rule.prefix) && role !== rule.role) {
      return rule.role === "admin" ? "/admin/login" : "/login";
    }
  }
  return null;
}
