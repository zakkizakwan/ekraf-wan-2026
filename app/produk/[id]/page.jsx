import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import TombolBagikan from "@/components/TombolBagikan";
import { CatatRiwayatLihat } from "@/components/TerakhirDilihat";
import { TombolFavorit } from "@/components/FavoritContext";
import KartuProduk from "@/components/KartuProduk";
import GaleriFotoProduk from "@/components/GaleriFotoProduk";
import BagianUlasanProduk from "@/components/BagianUlasanProduk";
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

  // US-38: Ambil ulasan dari database (jika tabel ulasan ada)
  let daftarUlasan = [];
  try {
    const { data: ulasanData } = await supabase
      .from("ulasan")
      .select("*")
      .eq("produk_id", id)
      .eq("is_hidden", false)
      .order("id", { ascending: false });
    daftarUlasan = ulasanData || [];
  } catch {
    // Abaikan jika tabel ulasan belum dibuat
  }

  // US-19 & US-20: Cek stok, diskon, dan badge
  const isHabis = produk.stok !== undefined && produk.stok !== null && Number(produk.stok) <= 0;
  const hargaDiskon = produk.harga_diskon ? Number(produk.harga_diskon) : null;
  const punyaDiskon = hargaDiskon !== null && hargaDiskon > 0 && hargaDiskon < produk.harga;
  const hargaTampil = punyaDiskon ? hargaDiskon : produk.harga;
  const dibuatBaru = produk.created_at && (new Date() - new Date(produk.created_at)) < (1000 * 60 * 60 * 24 * 7);
  const badgeBaru = produk.is_baru || dibuatBaru;
  const badgeTerlaris = Boolean(produk.is_terlaris);

  return (
    <div className="flex flex-col gap-12 py-8 md:py-12">
      <article className="grid gap-8 md:grid-cols-2">
        {/* US-18: Galeri foto produk */}
        <GaleriFotoProduk
          fotoUtama={produk.foto_url}
          daftarFoto={produk.foto_lain || []}
          namaProduk={produk.nama}
        />
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
            Kembali ke katalog
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {isHabis && (
              <span className="rounded-md bg-merah px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                Stok Habis
              </span>
            )}
            {punyaDiskon && (
              <span className="rounded-md bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                Promo Diskon
              </span>
            )}
            {!isHabis && badgeTerlaris && (
              <span className="rounded-md bg-utama px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                Terlaris
              </span>
            )}
            {!isHabis && !badgeTerlaris && badgeBaru && (
              <span className="rounded-md bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                Produk Baru
              </span>
            )}
          </div>

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
          
          {/* US-20: Harga tampil & harga coret jika ada diskon */}
          <div className="flex items-baseline gap-3">
            <span className="rounded-md bg-harga-latar px-3 py-1 text-2xl font-bold text-harga">
              {formatRupiah(hargaTampil)}
            </span>
            {punyaDiskon && (
              <span className="text-base text-teks-lembut line-through">
                {formatRupiah(produk.harga)}
              </span>
            )}
          </div>

          <p className="max-w-prose leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
          <TombolWhatsApp produk={{ ...produk, harga: hargaTampil }} />
          {/* US-23: Tombol Bagikan / Salin link */}
          <TombolBagikan namaProduk={produk.nama} />
          {/* US-36: Catat riwayat produk yang sedang dilihat */}
          <CatatRiwayatLihat produk={produk} />
        </div>
      </article>

      {/* US-38: Bagian Ulasan dan Rating Pembeli */}
      <BagianUlasanProduk produkId={produk.id} daftarUlasan={daftarUlasan} />

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
