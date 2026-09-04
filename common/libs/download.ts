// jsPDF & write-excel-file di-import dinamis (bukan di top-level) supaya kedua
// library ini (dan dependensinya) tidak ikut ke bundle utama yang diunduh
// SEMUA pengguna (termasuk mahasiswa) - hanya termuat saat admin benar-benar
// klik tombol ekspor di halaman Laporan.

/** Unduh laporan sebagai PDF sungguhan (tabel berjudul), bukan teks CSV berlabel .pdf. */
export async function downloadReportPdf(
  filename: string,
  title: string,
  headers: string[],
  rows: (string | number)[][],
): Promise<void> {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(title, 14, 16);
  doc.setFontSize(9);
  doc.text(`Diunduh: ${new Date().toLocaleString("id-ID")}`, 14, 22);
  autoTable(doc, {
    head: [headers],
    body: rows.map((r) => r.map(String)),
    startY: 28,
    headStyles: { fillColor: [26, 115, 200] },
    styles: { fontSize: 9 },
  });
  doc.save(filename);
}

/** Unduh laporan sebagai Excel (.xlsx) sungguhan, bukan CSV berlabel Excel. */
export async function downloadReportXlsx(
  filename: string,
  sheetHeaders: string[],
  rows: (string | number)[][],
): Promise<void> {
  const { default: writeXlsxFile } = await import("write-excel-file/browser");
  const headerRow = sheetHeaders.map((h) => ({ value: h, fontWeight: "bold" as const, type: String }));
  const dataRows = rows.map((r) =>
    r.map((cell) =>
      typeof cell === "number" ? { value: cell, type: Number } : { value: String(cell), type: String },
    ),
  );
  const file = await writeXlsxFile([headerRow, ...dataRows]);
  await file.toFile(filename);
}
