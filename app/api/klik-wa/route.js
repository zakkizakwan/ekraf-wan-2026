import { buatKoneksiServer } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const produkId = searchParams.get("produk_id");

    if (!produkId) {
      return Response.json({ error: "produk_id wajib diisi" }, { status: 400 });
    }

    const supabase = buatKoneksiServer();

    // Simpan ke tabel klik_whatsapp jika tabel ada
    // Supabase RLS / skema aman; gunakan try/catch bila tabel belum dibuat
    try {
      await supabase.from("klik_whatsapp").insert([
        {
          produk_id: parseInt(produkId, 10),
          created_at: new Date().toISOString(),
        },
      ]);
    } catch {
      // Abaikan jika tabel opsional belum dimigrasikan
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
