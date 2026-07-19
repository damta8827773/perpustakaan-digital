// AI-driven WAF: menilai skor ancaman tiap request di edge sebelum
// diteruskan ke origin. Bahasa: TypeScript (Cloudflare Workers).
export interface ThreatVerdict {
  score: number;
  block: boolean;
  reason: string;
}

const SQLI = /(union\s+select|or\s+1=1|;\s*drop\s+table)/i;
const XSS = /(<script|javascript:|onerror\s*=)/i;

export function inspect(req: Request): ThreatVerdict {
  const query = decodeURIComponent(new URL(req.url).search);
  let score = 0;
  let reason = "clean";

  if (SQLI.test(query)) {
    score += 10;
    reason = "Potential SQL Injection detected";
  }

  if (XSS.test(query)) {
    score += 10;
    reason = "Potential XSS attack detected";
  }

  return {
    score,
    block: score >= 10,
    reason,
  };
}

export default {
  async fetch(req: Request): Promise<Response> {
    const verdict = inspect(req);
    if (verdict.block) return new Response("Blocked by AI-WAF", { status: 403 });
    return fetch(req);
  },
};
