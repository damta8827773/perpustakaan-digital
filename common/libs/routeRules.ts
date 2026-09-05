// Aturan akses terpusat (setara "middleware" pada aplikasi berbasis server).
// Aplikasi ini adalah SPA, sehingga penegakan aturan dilakukan oleh penjaga
// rute (route guard) di app/App.tsx. Modul ini mendokumentasikan dan
// menyediakan pemetaan aturan agar mudah dirawat di satu tempat.
//
// CATATAN PENTING: file ini SEBELUMNYA bernama `middleware.ts` di root
// repository. Vercel secara otomatis mendeteksi file bernama itu di root
// sebagai Edge Middleware sungguhan (fitur khusus Next.js) dan mencoba
// menjalankannya sebagai fungsi server di setiap request - padahal modul
// ini cuma dokumentasi/util biasa tanpa default export yang sesuai
// kontrak tersebut. Itu menyebabkan SELURUH situs mengembalikan
// 500 MIDDLEWARE_INVOCATION_FAILED. Jangan pindahkan file ini kembali ke
// root dengan nama `middleware.ts`/`middleware.js`.

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
