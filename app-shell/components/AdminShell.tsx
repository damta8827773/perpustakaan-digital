import { useCallback } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen, LayoutGrid, Copy, BookMarked, Users, BarChart3, MessageSquare, LogOut, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/services/auth";
import { useIdleLogout } from "@/hooks/useIdleLogout";
import { clearAdminSession, currentAdminEmail } from "@/services/admin";
import { NotificationBell, DropdownMenu } from "@/components/HeaderMenus";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/admin/koleksi", label: "Koleksi Buku", icon: Copy, end: false },
  { to: "/admin/peminjaman", label: "Peminjaman", icon: BookMarked, end: false },
  { to: "/admin/anggota", label: "Anggota", icon: Users, end: false },
  { to: "/admin/umpan-balik", label: "Umpan Balik", icon: MessageSquare, end: false },
  { to: "/admin/laporan", label: "Laporan", icon: BarChart3, end: false },
];

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/koleksi": "Koleksi Buku",
  "/admin/peminjaman": "Peminjaman",
  "/admin/anggota": "Data Anggota",
  "/admin/umpan-balik": "Umpan Balik",
  "/admin/laporan": "Laporan",
};

export default function AdminShell() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? "Dashboard";
  const doLogout = useCallback(() => {
    clearAdminSession();
    void logout().finally(() => navigate("/admin/login", { replace: true }));
  }, [logout, navigate]);
  useIdleLogout(doLogout);

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-line bg-card">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="font-display text-[15px] font-bold">UIN Library</div>
            <div className="text-xs text-muted-fg">Admin Panel</div>
          </div>
        </div>

        <nav className="mt-2 flex flex-col gap-1 border-t border-line px-4 pt-4">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-semibold transition-colors ${
                  isActive
                    ? "border-l-4 border-primary bg-primary-light pl-3 text-primary"
                    : "text-muted-fg hover:bg-muted hover:text-fg"
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-line px-4 py-5">
          <button
            onClick={doLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-semibold text-destructive hover:bg-destructive-light"
          >
            <LogOut size={19} />
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-[76px] items-center justify-between border-b border-line bg-card px-8">
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-[15px] text-muted-fg">Rabu, 17 Juni 2026</span>
            <NotificationBell role="admin" />
            <DropdownMenu
              trigger={() => (
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    AD
                  </div>
                  <span className="text-[15px] font-semibold">Admin</span>
                  <ChevronDown size={16} className="text-muted-fg" />
                </div>
              )}
            >
              {(close) => (
                <>
                  <div className="border-b border-line px-4 py-3">
                    <div className="font-display font-bold">Administrator</div>
                    <div className="truncate text-sm lowercase text-muted-fg">
                      {currentAdminEmail() ?? ""}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      close();
                      doLogout();
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[15px] font-semibold text-destructive hover:bg-destructive-light/50"
                  >
                    <LogOut size={17} /> Keluar
                  </button>
                </>
              )}
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 px-8 py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
