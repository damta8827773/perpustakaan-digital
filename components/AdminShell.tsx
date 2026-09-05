import { useCallback, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen, LayoutGrid, Copy, BookMarked, Users, BarChart3, MessageSquare, MessageCircle, LogOut, ChevronDown, Menu, X,
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
  const [navOpen, setNavOpen] = useState(false);
  const doLogout = useCallback(() => {
    clearAdminSession();
    void logout().finally(() => navigate("/admin/login", { replace: true }));
  }, [logout, navigate]);
  useIdleLogout(doLogout);

  const sidebarBrand = (
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
  );

  const sidebarNav = (
    <nav className="mt-2 flex flex-col gap-1 border-t border-[var(--color-admin-sidebar-border)] px-4 pt-4">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setNavOpen(false)}
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
  );

  const sidebarLogout = (
    <div className="mt-auto border-t border-[var(--color-admin-sidebar-border)] px-4 py-5">
      <button
        onClick={doLogout}
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-semibold text-red-400 hover:bg-red-500/10"
      >
        <LogOut size={19} />
        Keluar
      </button>
    </div>
  );

  return (
    <div className="theme-admin flex min-h-screen bg-bg">
      {/* Sidebar tetap - cuma tampil dari breakpoint lg ke atas (laptop/TV).
          Di layar sempit (HP, tablet) diganti drawer yang dibuka lewat tombol
          hamburger di header, supaya tidak memaksa halaman melebar 260px. */}
      <aside className="hidden w-[260px] shrink-0 flex-col bg-[var(--color-admin-sidebar)] lg:flex">
        {sidebarBrand}
        {sidebarNav}
        {sidebarLogout}
      </aside>

      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setNavOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative flex h-full w-[260px] max-w-[80vw] flex-col bg-[var(--color-admin-sidebar)] shadow-2xl">
            <div className="flex items-center justify-between pr-4">
              {sidebarBrand}
              <button
                onClick={() => setNavOpen(false)}
                aria-label="Tutup menu"
                className="cursor-pointer text-[var(--color-admin-sidebar-fg)] hover:text-white"
              >
                <X size={22} />
              </button>
            </div>
            {sidebarNav}
            {sidebarLogout}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-[76px] items-center justify-between border-b border-line bg-card px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setNavOpen(true)}
              aria-label="Buka menu"
              className="cursor-pointer text-fg lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="truncate font-display text-lg font-bold sm:text-2xl">{title}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <span className="hidden text-[15px] text-muted-fg md:block">Rabu, 17 Juni 2026</span>
            <NotificationBell role="admin" />
            <DropdownMenu
              trigger={() => (
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <Avatar photoURL={user?.photoURL} name="Admin" className="h-10 w-10 shrink-0" />
                  <span className="hidden text-[15px] font-semibold sm:block">Admin</span>
                  <ChevronDown size={16} className="hidden text-muted-fg sm:block" />
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

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
