import { useCallback } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, Home, Search, BookMarked, Book, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/services/auth";
import { useIdleLogout } from "@/hooks/useIdleLogout";
import { useCurrentStudent, clearCurrentStudent } from "@/services/sessionStore";
import { NotificationBell, DropdownMenu } from "@/components/HeaderMenus";
import { Avatar } from "@/components/ui";
import { ChatWidget } from "@/components/ChatWidget";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslate } from "@/services/localeStore";

const NAV = [
  { to: "/app", key: "nav.home", icon: Home, end: true },
  { to: "/app/cari", key: "nav.search", icon: Search, end: false },
  { to: "/app/pinjaman", key: "nav.loans", icon: BookMarked, end: false },
  { to: "/app/baca", key: "nav.read", icon: Book, end: false },
  { to: "/app/profil", key: "nav.profile", icon: User, end: false },
];

export default function UserShell() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const student = useCurrentStudent();
  const t = useTranslate();
  const doLogout = useCallback(() => {
    clearCurrentStudent();
    void logout().then(() => navigate("/login"));
  }, [logout, navigate]);
  useIdleLogout(doLogout);
  const [firstName, ...restName] = student.name.split(" ");

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-line bg-card">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center gap-2 px-4 sm:px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
              <BookOpen size={20} />
            </div>
            <div className="hidden font-display text-[15px] font-bold leading-tight sm:block">
              UIN Digital<br />Library
            </div>
          </div>

          {/* Nav horizontal cuma tampil dari breakpoint lg ke atas (laptop/TV) -
              di layar sempit (HP, tablet) pindah ke bilah bawah supaya tidak
              terpotong/perlu geser horizontal. */}
          <nav className="ml-6 hidden flex-1 items-center gap-1 lg:flex">
            {NAV.map(({ to, key, icon: Icon, end }) => (
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
                <span className="max-w-[84px] text-center leading-tight">{t(key)}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-1 lg:flex-none lg:gap-2">
            <LanguageSwitcher />
            <NotificationBell role="user" />

            <div className="ml-1 border-l border-line pl-2 sm:ml-2 sm:pl-4">
              <DropdownMenu
                trigger={() => (
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <Avatar photoURL={student.photoURL} name={student.name} className="h-10 w-10 shrink-0" />
                    <div className="hidden max-w-[110px] truncate text-left text-sm font-semibold uppercase leading-tight sm:block">
                      {firstName}
                      <br />
                      {restName.join(" ")}
                    </div>
                    <ChevronDown size={16} className="hidden text-muted-fg sm:block" />
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
                      <User size={17} /> {t("nav.profile")}
                    </button>
                    <button
                      onClick={() => {
                        close();
                        doLogout();
                      }}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[15px] font-semibold text-destructive hover:bg-destructive-light/50"
                    >
                      <LogOut size={17} /> {t("action.logout")}
                    </button>
                  </>
                )}
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-5 py-8 pb-28 lg:pb-8">
        <Outlet />
      </main>

      {/* Bilah navigasi bawah - cuma di layar sempit (di bawah breakpoint lg),
          pengganti nav horizontal header yang disembunyikan di atas. */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-card lg:hidden">
        {NAV.map(({ to, key, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${
                isActive ? "text-primary" : "text-muted-fg"
              }`
            }
          >
            <Icon size={20} />
            <span className="max-w-full truncate px-1">{t(key)}</span>
          </NavLink>
        ))}
      </nav>

      <ChatWidget />
    </div>
  );
}
