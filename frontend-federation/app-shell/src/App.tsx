import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "./lib/auth";
import Landing from "./pages/Landing";
import LoginMahasiswa from "./pages/LoginMahasiswa";
import SsoLogin from "./pages/SsoLogin";
import AdminLogin from "./pages/AdminLogin";
import UserShell from "./components/UserShell";
import AdminShell from "./components/AdminShell";
import Home from "./pages/user/Home";
import Search from "./pages/user/Search";
import BookDetail from "./pages/user/BookDetail";
import Reservasi from "./pages/user/Reservasi";
import Konfirmasi from "./pages/user/Konfirmasi";
import Berhasil from "./pages/user/Berhasil";
import Pinjaman from "./pages/user/Pinjaman";
import BacaList from "./pages/user/BacaList";
import Reader from "./pages/user/Reader";
import Profil from "./pages/user/Profil";
import Dashboard from "./pages/admin/Dashboard";
import Koleksi from "./pages/admin/Koleksi";
import PeminjamanAdmin from "./pages/admin/Peminjaman";
import Anggota from "./pages/admin/Anggota";
import Laporan from "./pages/admin/Laporan";
import AdminReader from "./pages/admin/AdminReader";

// Mode demo (VITE_DEMO=1): lewati login agar UI bisa dipratinjau
// sebelum provider Email/Password diaktifkan di Firebase Console.
const DEMO = import.meta.env.VITE_DEMO === "1";

function Guard({
  need, children,
}: { need: "student" | "admin"; children: ReactNode }) {
  const { user, role, loading } = useAuth();
  if (DEMO) return <>{children}</>;
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-fg">
        Memuat...
      </div>
    );
  }
  if (!user) {
    return <Navigate to={need === "admin" ? "/admin/login" : "/login"} replace />;
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
            <Route path="laporan" element={<Laporan />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
