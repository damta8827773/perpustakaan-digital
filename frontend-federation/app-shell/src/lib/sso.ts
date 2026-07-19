// ---------------------------------------------------------------------------
// Titik integrasi SSO UIN.
//
// PENTING: mode default di sini adalah "simulasi" untuk keperluan demo.
// Aplikasi web TIDAK BOLEH menerima username/password UIN lalu menyuntikkannya
// ke server UIN, karena itu bukan SSO melainkan pola pencurian kredensial dan
// akan gagal begitu halaman login UIN berubah.
//
// SSO yang benar bekerja lewat redirect + kepercayaan antar-server:
//   1. Aplikasi didaftarkan ke PTIPD UIN dan diberi client_id + endpoint.
//   2. startSso() me-REDIRECT browser ke halaman login resmi UIN.
//   3. UIN yang memverifikasi kredensial (bukan aplikasi kita).
//   4. UIN redirect balik ke /sso/callback membawa "code"/"ticket".
//   5. SERVER kita menukar code itu ke UIN untuk memperoleh profil mahasiswa.
//
// Untuk mengaktifkan SSO asli nanti: ganti SSO_MODE ke "oidc", isi endpoint,
// dan pindahkan penukaran token ke backend (identity-access-mgmt).
// ---------------------------------------------------------------------------

export interface SsoProfile {
  nim: string;
  name: string;
  faculty: string;
  program: string;
}

// "portal-uin" : buka portal SSO UIN asli di tab baru, lalu lanjut sesi
//                demo di aplikasi (dipakai sekarang).
// "oidc"       : redirect OIDC/CAS resmi (aktif setelah terdaftar di PTIPD).
// "simulasi"   : tanpa membuka portal, langsung ke layar callback demo.
export const SSO_MODE: "portal-uin" | "oidc" | "simulasi" = "portal-uin";

// URL portal SSO UIN Jakarta yang sebenarnya.
export const UIN_SSO_PORTAL = "https://e-semesta.uinjkt.ac.id/";

// Konfigurasi OIDC/CAS resmi (diisi setelah aplikasi terdaftar di PTIPD UIN).
export const SSO_CONFIG = {
  authorizeUrl: "https://e-semesta.uinjkt.ac.id/", // ganti ke authorize endpoint resmi
  clientId: "GANTI_DENGAN_CLIENT_ID_RESMI",
  redirectUri: `${window.location.origin}/sso/callback`,
  scope: "openid profile academic",
};

// Profil demo yang seolah "dikembalikan IdP" setelah autentikasi berhasil.
// Sengaja bukan data pribadi asli siapa pun. Pada mode "oidc", profil ini
// diisi dari klaim token resmi, bukan nilai statis.
const DEMO_PROFILE: SsoProfile = {
  nim: "1251440000",
  name: "Mahasiswa Demo SSO",
  faculty: "SAINTEK",
  program: "Sistem Informasi",
};

// Memulai alur SSO.
export function startSso(): void {
  if (SSO_MODE === "portal-uin") {
    // Buka portal SSO UIN yang asli di tab baru (login sebenarnya terjadi di
    // server UIN), lalu lanjutkan sesi demo di aplikasi ini.
    window.open(UIN_SSO_PORTAL, "_blank", "noopener,noreferrer");
    window.location.assign("/sso/callback");
    return;
  }
  if (SSO_MODE === "simulasi") {
    window.location.assign("/sso/callback");
    return;
  }
  const params = new URLSearchParams({
    client_id: SSO_CONFIG.clientId,
    redirect_uri: SSO_CONFIG.redirectUri,
    response_type: "code",
    scope: SSO_CONFIG.scope,
  });
  window.location.assign(`${SSO_CONFIG.authorizeUrl}?${params.toString()}`);
}

// Mengambil profil mahasiswa setelah "handshake" SSO.
// Mode simulasi: mengembalikan profil demo setelah jeda singkat.
// Mode oidc: kode "code" dari URL harus ditukar di BACKEND, bukan di sini.
export async function resolveSsoProfile(): Promise<SsoProfile> {
  await new Promise((r) => setTimeout(r, 1400));
  return DEMO_PROFILE;
}
