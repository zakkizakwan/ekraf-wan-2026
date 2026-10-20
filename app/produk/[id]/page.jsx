import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import TombolBagikan from "@/components/TombolBagikan";
import { CatatRiwayatLihat } from "@/components/TerakhirDilihat";
import { TombolFavorit } from "@/components/FavoritContext";
import KartuProduk from "@/components/KartuProduk";
import { buatKoneksiServer } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/format";

import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

// US-26: Metadata SEO dan Open Graph
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const supabase = buatKoneksiServer();
    const { data: produk } = await supabase
      .from("produk")
      .select("nama, deskripsi, foto_url")
      .eq("id", id)
      .maybeSingle();

    if (!produk) {
      return {
        title: `Produk Tidak Ditemukan — ${toko.nama}`,
      };
    }

    return {
      title: `${produk.nama} — ${toko.nama}`,
      description: produk.deskripsi || `${produk.nama} di ${toko.nama}`,
      openGraph: {
        title: produk.nama,
        description: produk.deskripsi || `${produk.nama} di ${toko.nama}`,
        images: produk.foto_url ? [{ url: produk.foto_url, alt: produk.nama }] : [],
      },
    };
  } catch {
    return {
      title: `Detail Produk — ${toko.nama}`,
    };
  }
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  const supabase = buatKoneksiServer();
  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !produk) {
    notFound();
  }

  // US-17: Ambil produk terkait dari kategori yang sama dari database
  let produkTerkait = [];
  if (produk.kategori) {
    const { data: terkait } = await supabase
      .from("produk")
      .select("*")
      .eq("kategori", produk.kategori)
      .neq("id", id)
      .limit(4);

    produkTerkait = terkait || [];
  }

  return (
    <div className="flex flex-col gap-12 py-8 md:py-12">
      <article className="grid gap-8 md:grid-cols-2">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
        />
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
            Kembali ke katalog
          </Link>
          <div className="flex items-center justify-between">
            {produk.kategori ? (
              <Link
                href={`/kategori/${encodeURIComponent(produk.kategori)}`}
                className="text-sm font-semibold text-utama hover:underline"
              >
                {produk.kategori}
              </Link>
            ) : (
              <span className="text-sm text-teks-lembut">Umum</span>
            )}
            {/* US-24: Tombol Favorit di halaman detail */}
            <div className="flex items-center gap-1 text-xs text-teks-lembut">
              <span>Favorit:</span>
              <TombolFavorit id={produk.id} nama={produk.nama} className="p-1" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>
          <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
          <p className="max-w-prose leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
          <TombolWhatsApp produk={produk} />
          {/* US-23: Tombol Bagikan / Salin link */}
          <TombolBagikan namaProduk={produk.nama} />
          {/* US-36: Catat riwayat produk yang sedang dilihat */}
          <CatatRiwayatLihat produk={produk} />
        </div>
      </article>

      {/* US-17: Bagian Produk Terkait */}
      {produkTerkait.length > 0 && (
        <section className="flex flex-col gap-4 border-t border-garis pt-8">
          <h2 className="text-xl font-bold">Produk terkait</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {produkTerkait.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
