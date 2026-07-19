<?php
// Jembatan sinkronisasi katalog dari sistem monolitik lama. Bahasa: PHP.
declare(strict_types=1);

function legacyRowToBook(array $row): array {
    return [
        'id' => (string) $row['kd_buku'],
        'title' => trim((string) $row['judul']),
        'author' => trim((string) $row['pengarang']),
        'stockAvailable' => max(0, (int) $row['stok']),
    ];
}

header('Content-Type: application/json');
echo json_encode(['service' => 'catalog-legacy-bridge', 'status' => 'ok']);
