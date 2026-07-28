// ---------------------------------------------------------------------------
// Titik integrasi SSO UIN.
//
// Alur default "simulasi" berlangsung SEPENUHNYA di dalam aplikasi: pengguna
// menekan "Masuk dengan SSO UIN", mengisi identitas pada layar SSO kampus,
// lalu OTOMATIS kembali dan masuk ke sistem ini. Tidak pernah tersangkut di
// halaman luar.
//
// Catatan penting: aplikasi web tidak boleh mengirim username/password UIN ke
// server UIN secara langsung; itu bukan SSO melainkan pola pencurian kredensial.
// SSO yang benar (mode "oidc") bekerja lewat redirect + kepercayaan antar-server:
//   1. Aplikasi didaftarkan ke PTIPD UIN dan diberi client_id + endpoint.
//   2. startSso() me-REDIRECT ke halaman login resmi UIN.
//   3. UIN memverifikasi kredensial, lalu redirect balik ke /sso/callback.
//   4. SERVER kita menukar "code" itu ke UIN untuk memperoleh profil mahasiswa.
// ---------------------------------------------------------------------------

export interface SsoProfile {
  nim: string;
  name: string;
  faculty: string;
  program: string;
}

// "simulasi" : layar SSO in-app, otomatis kembali ke sistem (dipakai sekarang).
// "oidc"     : redirect OIDC/CAS resmi (aktif setelah terdaftar di PTIPD UIN).
export const SSO_MODE: "simulasi" | "oidc" = "simulasi";

// URL portal SSO UIN Jakarta yang sebenarnya (referensi untuk mode "oidc").
export const UIN_SSO_PORTAL = "https://e-semesta.uinjkt.ac.id/";

// Konfigurasi OIDC/CAS resmi (diisi setelah aplikasi terdaftar di PTIPD UIN).
export const SSO_CONFIG = {
  authorizeUrl: "https://e-semesta.uinjkt.ac.id/", // ganti ke authorize endpoint resmi
  clientId: "GANTI_DENGAN_CLIENT_ID_RESMI",
  redirectUri: `${window.location.origin}/sso/callback`,
  scope: "openid profile academic",
};

// NIM contoh yang otomatis terisi pada layar SSO simulasi.
export const DEMO_NIM = "11200000001";

const FACULTIES = ["SAINTEK", "SYARIAH", "FST", "FEBI", "ADAB", "FISIP"];

// Menyusun profil mahasiswa dari NIM. Pada mode "oidc", profil ini diisi dari
// klaim token resmi UIN, bukan diturunkan dari NIM.
export function profileFromNim(nim: string): SsoProfile {
  const clean = nim.trim();
  const digitSum = clean.split("").reduce((s, c) => s + (Number(c) || 0), 0);
  return {
    nim: clean,
    name: clean === DEMO_NIM ? "Ahmad Fauzi" : `Mahasiswa ${clean.slice(-4)}`,
    faculty: FACULTIES[digitSum % FACULTIES.length],
    program: "Sistem Informasi",
  };
}

// Memulai alur SSO. Mode simulasi tetap di dalam aplikasi (navigasi router).
export function startSso(navigate: (path: string) => void): void {
  if (SSO_MODE === "oidc") {
    const params = new URLSearchParams({
      client_id: SSO_CONFIG.clientId,
      redirect_uri: SSO_CONFIG.redirectUri,
      response_type: "code",
      scope: SSO_CONFIG.scope,
    });
    window.location.assign(`${SSO_CONFIG.authorizeUrl}?${params.toString()}`);
    return;
  }
  navigate("/sso");
}
