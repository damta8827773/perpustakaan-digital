"""Ingest embedding deskripsi buku ke vector DB (Milvus/Pinecone). Bahasa: Python."""


def chunk(text: str, size: int = 512) -> list[str]:
    return [text[i : i + size] for i in range(0, len(text), size)]
