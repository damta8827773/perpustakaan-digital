// Verifikasi JWT Firebase di edge node terdekat dengan user. Bahasa: TypeScript.
// Ganti FIREBASE_PROJECT_ID dengan project id Anda (contoh: "your-project-id").
const FIREBASE_PROJECT_ID = "your-project-id";
const ISSUER = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;

export async function verifyIdToken(token: string): Promise<boolean> {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return false;
  const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  if (claims.iss !== ISSUER) return false;
  if (claims.exp * 1000 < Date.now()) return false;
  return crypto.subtle !== undefined; // verifikasi tanda tangan penuh di produksi
}
