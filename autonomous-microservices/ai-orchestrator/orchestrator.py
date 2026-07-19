"""LLM gateway (Gemini/Claude) untuk pencarian semantik dan asisten AI. Bahasa: Python."""
from dataclasses import dataclass


@dataclass
class SearchHit:
    book_id: str
    score: float


def rerank(hits: list[SearchHit], top_k: int = 5) -> list[SearchHit]:
    return sorted(hits, key=lambda h: h.score, reverse=True)[:top_k]


if __name__ == "__main__":
    print("ai-orchestrator ready")
