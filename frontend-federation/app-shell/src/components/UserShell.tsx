import { useCallback } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, Home, Search, BookMarked, Book, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../lib/auth";
import { useIdleLogout } from "../lib/security";
import { useCurrentStudent, initialsOf, clearCurrentStudent } from "../lib/sessionStore";
import { NotificationBell, DropdownMenu } from "./HeaderMenus";

const NAV = [
  { to: "/app", label: "Beranda", icon: Home, end: true },
  { to: "/app/cari", label: "Cari Buku", icon: Search, end: false },
  { to: "/app/pinjaman", label: "Pinjaman Saya", icon: BookMarked, end: false },
  { to: "/app/baca", label: "Baca", icon: Book, end: false },
  { to: "/app/profil", label: "Profil", icon: User, end: false },
];

export default function UserShell() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const student = useCurrentStudent();
  const doLogout = useCallback(() => {
    clearCurrentStudent();
    void logout().then(() => navigate("/login"));
  }, [logout, navigate]);
  useIdleLogout(doLogout);
  const [firstName, ...restName] = student.name.split(" ");

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-line bg-card">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center gap-2 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <BookOpen size={20} />
            </div>
            <div className="font-display text-[15px] font-bold leading-tight">
              UIN Digital<br />Library
            </div>
          </div>

          <nav className="ml-6 flex flex-1 items-center gap-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary-light text-primary"
                      : "text-muted-fg hover:bg-muted hover:text-fg"
                  }`
                }
              >
                <Icon size={17} />
                <span className="max-w-[84px] text-center leading-tight">{label}</span>
              </NavLink>
            ))}
          </nav>

          <NotificationBell role="user" />

          <div className="ml-2 border-l border-line pl-4">
            <DropdownMenu
              trigger={() => (
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {initialsOf(student.name)}
                  </div>
                  <div className="max-w-[110px] truncate text-left text-sm font-semibold uppercase leading-tight">
                    {firstName}
                    <br />
                    {restName.join(" ")}
                  </div>
                  <ChevronDown size={16} className="text-muted-fg" />
                </div>
              )}
            >
              {(close) => (
                <>
                  <div className="border-b border-line px-4 py-3">
                    <div className="font-display font-bold uppercase">{student.name}</div>
                    <div className="text-sm text-muted-fg">{student.nim}</div>
                  </div>
                  <button
                    onClick={() => {
                      close();
                      navigate("/app/profil");
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[15px] font-semibold hover:bg-muted"
                  >
                    <User size={17} /> Profil Saya
                  </button>
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
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-5 py-8">
        <Outlet />
      </main>
    </div>
  );
}
