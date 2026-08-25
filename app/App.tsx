import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/services/auth";
import { isAdminAuthed } from "@/services/admin";
import Landing from "@/modules/auth/Landing";
import LoginMahasiswa from "@/modules/auth/LoginMahasiswa";
import Daftar from "@/modules/auth/Daftar";
import SsoLogin from "@/modules/auth/SsoLogin";
import AdminLogin from "@/modules/auth/AdminLogin";
import UserShell from "@/components/UserShell";
import AdminShell from "@/components/AdminShell";
import Home from "@/modules/user/Home";
import Search from "@/modules/user/Search";
import BookDetail from "@/modules/user/BookDetail";
import Reservasi from "@/modules/user/Reservasi";
import Konfirmasi from "@/modules/user/Konfirmasi";
import Berhasil from "@/modules/user/Berhasil";
import Pinjaman from "@/modules/user/Pinjaman";
import BacaList from "@/modules/user/BacaList";
import Reader from "@/modules/user/Reader";
import Profil from "@/modules/user/Profil";
import Dashboard from "@/modules/admin/Dashboard";
import Koleksi from "@/modules/admin/Koleksi";
import PeminjamanAdmin from "@/modules/admin/Peminjaman";
import Anggota from "@/modules/admin/Anggota";
import Pesan from "@/modules/admin/Pesan";
import Laporan from "@/modules/admin/Laporan";
import UmpanBalik from "@/modules/admin/UmpanBalik";
import AdminReader from "@/modules/admin/AdminReader";

// Mode demo (VITE_DEMO=1): lewati login agar UI bisa dipratinjau
// sebelum provider Email/Password diaktifkan di Firebase Console.
const DEMO = import.meta.env.VITE_DEMO === "1";

function Guard({
  need, children,
}: { need: "student" | "admin"; children: ReactNode }) {
  const { user, role, loading } = useAuth();

  // Panel admin SELALU dibatasi ke email dalam allowlist, termasuk mode demo.
  //
  // PENTING (perbaikan keamanan): sebelumnya jalur ini HANYA mengecek
  // isAdminAuthed(), yaitu flag localStorage ("perpus.admin.session") yang
  // sama sekali lepas dari status login Firebase yang sesungguhnya. Siapa
  // pun yang bisa membuka DevTools bisa menjalankan
  // `localStorage.setItem("perpus.admin.session","damtafaiz@gmail.com")`
  // lalu reload, dan Guard ini akan meloloskannya ke /admin TANPA pernah
  // benar-benar login sebagai admin di Firebase. Sekarang jalur non-demo
  // WAJIB memverifikasi sesi Firebase asli (`user` + `role` dari
  // useAuth(), yang dihitung dari email token, bukan dari localStorage).
  if (need === "admin") {
    if (DEMO) {
      if (!isAdminAuthed()) return <Navigate to="/admin/login" replace />;
      return <>{children}</>;
    }
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center text-muted-fg">
          Memuat...
        </div>
      );
    }
    if (!user || role !== "admin") return <Navigate to="/admin/login" replace />;
    return <>{children}</>;
  }

  // Area mahasiswa: mode demo dilewati untuk kemudahan pratinjau.
  if (DEMO) return <>{children}</>;
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-fg">
        Memuat...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role !== need) {
    return <Navigate to={role === "admin" ? "/admin" : "/app"} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginMahasiswa />} />
          <Route path="/daftar" element={<Daftar />} />
          <Route path="/sso" element={<SsoLogin />} />
          <Route path="/sso/callback" element={<SsoLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/app"
            element={
              <Guard need="student">
                <UserShell />
              </Guard>
            }
          >
            <Route index element={<Home />} />
            <Route path="cari" element={<Search />} />
            <Route path="buku/:id" element={<BookDetail />} />
            <Route path="buku/:id/reservasi" element={<Reservasi />} />
            <Route path="buku/:id/konfirmasi" element={<Konfirmasi />} />
            <Route path="buku/:id/berhasil" element={<Berhasil />} />
            <Route path="pinjaman" element={<Pinjaman />} />
            <Route path="baca" element={<BacaList />} />
            <Route path="baca/:id" element={<Reader />} />
            <Route path="profil" element={<Profil />} />
          </Route>

          <Route
            path="/admin/baca/:id"
            element={
              <Guard need="admin">
                <AdminReader />
              </Guard>
            }
          />

          <Route
            path="/admin"
            element={
              <Guard need="admin">
                <AdminShell />
              </Guard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="koleksi" element={<Koleksi />} />
            <Route path="peminjaman" element={<PeminjamanAdmin />} />
            <Route path="anggota" element={<Anggota />} />
            <Route path="pesan" element={<Pesan />} />
            <Route path="umpan-balik" element={<UmpanBalik />} />
            <Route path="laporan" element={<Laporan />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
