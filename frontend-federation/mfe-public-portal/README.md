# mfe-public-portal

Module federation untuk portal Mahasiswa. Rute `/`, `/login`, dan `/app/*`
saat ini di-serve oleh `../app-shell` (React + Vite). Saat dipecah menjadi
micro-frontend penuh, seluruh halaman di `app-shell/src/pages/user` dan
`app-shell/src/pages/Landing.tsx` pindah ke modul ini.
