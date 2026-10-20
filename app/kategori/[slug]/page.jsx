import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import { buatKoneksiServer } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

// US-26 & US-49: Metadata SEO untuk halaman kategori
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const decodedKategori = decodeURIComponent(slug);

  return {
    title: `Kategori ${decodedKategori} — ${toko.nama}`,
    description: `Lihat koleksi produk kategori ${decodedKategori} di ${toko.nama}.`,
  };
}

export default async function HalamanKategori({ params }) {
  const { slug } = await params;
  const decodedKategori = decodeURIComponent(slug).trim();

  const supabase = buatKoneksiServer();

  // Query produk berdasarkan kategori (case-insensitive via ilike atau eq)
  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("*")
    .ilike("kategori", decodedKategori)
    .order("id", { ascending: false });

  // Kriteria US-49: Kategori yang tidak ada menampilkan "tidak ditemukan"
  if (error || !daftarProduk || daftarProduk.length === 0) {
    notFound();
  }

  // Ambil nama kategori asli dari hasil produk
  const namaKategoriAsli = daftarProduk[0]?.kategori || decodedKategori;

  return (
    <div className="flex flex-col gap-8 py-8 md:py-12">
      {/* Header Kategori */}
      <div className="flex flex-col gap-3">
        <Link
          href="/"
          className="self-start text-xs font-semibold text-teks-lembut hover:text-utama"
        >
          &larr; Kembali ke semua produk
        </Link>
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-garis pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-utama">
              Kategori Produk
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-teks">
              {namaKategoriAsli}
            </h1>
          </div>
          <p className="text-sm text-teks-lembut">
            Menampilkan <span className="font-bold text-teks">{daftarProduk.length}</span> produk
          </p>
        </div>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {daftarProduk.map((produk) => (
          <KartuProduk key={produk.id} produk={produk} />
        ))}
      </div>
    </div>
  );
}
