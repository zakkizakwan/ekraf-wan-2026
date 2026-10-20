import { NextResponse } from "next/server";
import { buatKoneksiServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = buatKoneksiServer();

    // Pastikan admin login (keamanan nomor 3 & US-35)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: daftarProduk, error } = await supabase
      .from("produk")
      .select("id, nama, harga, kategori, deskripsi, foto_url, created_at")
      .order("id", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Helper untuk escape karakter khusus CSV (kutip, koma, newline)
    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const text = String(str).replace(/"/g, '""');
      return `"${text}"`;
    };

    const header = ["ID", "Nama", "Harga", "Kategori", "Deskripsi", "Foto URL", "Created At"];
    const rows = (daftarProduk || []).map((p) => [
      escapeCsv(p.id),
      escapeCsv(p.nama),
      escapeCsv(p.harga),
      escapeCsv(p.kategori),
      escapeCsv(p.deskripsi),
      escapeCsv(p.foto_url),
      escapeCsv(p.created_at),
    ]);

    const csvContent = [header.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="produk-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
