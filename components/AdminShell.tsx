import { useCallback } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen, LayoutGrid, Copy, BookMarked, Users, BarChart3, MessageSquare, MessageCircle, LogOut, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/services/auth";
import { useIdleLogout } from "@/hooks/useIdleLogout";
import { clearAdminSession } from "@/services/admin";
import { NotificationBell, DropdownMenu } from "@/components/HeaderMenus";
import { Avatar } from "@/components/ui";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/admin/koleksi", label: "Koleksi Buku", icon: Copy, end: false },
  { to: "/admin/peminjaman", label: "Peminjaman", icon: BookMarked, end: false },
  { to: "/admin/anggota", label: "Anggota", icon: Users, end: false },
  { to: "/admin/pesan", label: "Live Chat", icon: MessageCircle, end: false },
  { to: "/admin/umpan-balik", label: "Umpan Balik", icon: MessageSquare, end: false },
  { to: "/admin/laporan", label: "Laporan", icon: BarChart3, end: false },
];

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/koleksi": "Koleksi Buku",
  "/admin/peminjaman": "Peminjaman",
  "/admin/anggota": "Data Anggota",
  "/admin/pesan": "Live Chat",
  "/admin/umpan-balik": "Umpan Balik",
  "/admin/laporan": "Laporan",
};

export default function AdminShell() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? "Dashboard";
  const doLogout = useCallback(() => {
    clearAdminSession();
    void logout().finally(() => navigate("/admin/login", { replace: true }));
  }, [logout, navigate]);
  useIdleLogout(doLogout);

  return (
    <div className="theme-admin flex min-h-screen bg-bg">
      <aside className="flex w-[260px] shrink-0 flex-col bg-[var(--color-admin-sidebar)]">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="font-display text-[15px] font-bold text-white">UIN Library</div>
            <span className="mt-0.5 inline-block rounded-full bg-primary/25 px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary-light">
              ADMIN
            </span>
          </div>
        </div>

        <nav className="mt-2 flex flex-col gap-1 border-t border-[var(--color-admin-sidebar-border)] px-4 pt-4">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-semibold transition-colors ${
                  isActive
                    ? "border-l-4 border-primary bg-[var(--color-admin-sidebar-active)] pl-3 text-white"
                    : "text-[var(--color-admin-sidebar-fg)] hover:bg-[var(--color-admin-sidebar-hover)] hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-[var(--color-admin-sidebar-border)] px-4 py-5">
          <button
            onClick={doLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-semibold text-red-400 hover:bg-red-500/10"
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
                  <Avatar photoURL={user?.photoURL} name="Admin" className="h-10 w-10" />
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
                      {user?.email ?? ""}
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
