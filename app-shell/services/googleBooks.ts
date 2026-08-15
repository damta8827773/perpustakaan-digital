// Integrasi Google Books API: mengambil data buku sungguhan (judul, penulis,
// penerbit, tahun terbit, deskripsi, dan sampul asli) untuk memvalidasi dan
// melengkapi katalog, serta membantu admin mengisi formulir tambah buku.
//
// Endpoint publik ini tidak memerlukan API key untuk pencarian dasar. Setiap
// pemanggilan dilindungi timeout dan penanganan galat: jika API tidak dapat
// dihubungi atau kuota habis, pemanggil selalu menerima null/array kosong
// alih-alih membuat aplikasi gagal, sehingga sampul warna bawaan tetap tampil.
const ENDPOINT = "https://www.googleapis.com/books/v1/volumes";
const TIMEOUT_MS = 6000;
const CACHE_KEY = "perpus.googlebooks.cache";
const CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 hari

export interface GoogleBookResult {
  id: string;
  title: string;
  authors: string[];
  publisher?: string;
  publishedYear?: number;
  description?: string;
  pageCount?: number;
  isbn?: string;
  thumbnail?: string;
  infoLink?: string;
}

interface CacheEntry { at: number; data: GoogleBookResult[] }

function readCache(): Record<string, CacheEntry> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCache(key: string, data: GoogleBookResult[]) {
  try {
    const all = readCache();
    all[key] = { at: Date.now(), data };
    localStorage.setItem(CACHE_KEY, JSON.stringify(all));
  } catch {
    /* penyimpanan penuh atau tidak tersedia: lewati cache */
  }
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

interface RawVolume {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    industryIdentifiers?: { type: string; identifier: string }[];
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    infoLink?: string;
  };
}

function mapVolume(v: RawVolume): GoogleBookResult {
  const info = v.volumeInfo ?? {};
  const isbn13 = info.industryIdentifiers?.find((i) => i.type === "ISBN_13")?.identifier;
  const isbn10 = info.industryIdentifiers?.find((i) => i.type === "ISBN_10")?.identifier;
  const thumb = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail;
  return {
    id: v.id,
    title: info.title ?? "Tanpa judul",
    authors: info.authors ?? [],
    publisher: info.publisher,
    publishedYear: info.publishedDate ? Number(info.publishedDate.slice(0, 4)) || undefined : undefined,
    description: info.description,
    pageCount: info.pageCount,
    isbn: isbn13 ?? isbn10,
    // Google Books menyajikan thumbnail lewat http; naikkan ke https agar
    // tidak diblokir oleh kebijakan konten aman peramban.
    thumbnail: thumb?.replace(/^http:/, "https:"),
    infoLink: info.infoLink,
  };
}

/**
 * Mencari buku di Google Books. Selalu mengembalikan array (kosong bila
 * gagal/tidak ada hasil) sehingga pemanggil tidak perlu menangani exception.
 */
export async function searchGoogleBooks(
  query: string,
  maxResults = 5,
): Promise<GoogleBookResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const cacheKey = `${q.toLowerCase()}::${maxResults}`;
  const cached = readCache()[cacheKey];
  if (cached && Date.now() - cached.at < CACHE_TTL) return cached.data;

  try {
    const url = `${ENDPOINT}?q=${encodeURIComponent(q)}&maxResults=${maxResults}&printType=books`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return [];
    const json = (await res.json()) as { items?: RawVolume[] };
    const results = (json.items ?? []).map(mapVolume);
    writeCache(cacheKey, results);
    return results;
  } catch {
    // Timeout, offline, kuota API, atau format tak terduga: gagal secara
    // senyap dan biarkan pemanggil memakai data/sampul bawaan.
    return [];
  }
}

/** Mencari satu buku spesifik berdasarkan judul dan penulis, untuk sampul. */
export async function findGoogleBookCover(
  title: string,
  author: string,
): Promise<string | undefined> {
  const results = await searchGoogleBooks(`intitle:${title} inauthor:${author}`, 1);
  return results[0]?.thumbnail;
}
