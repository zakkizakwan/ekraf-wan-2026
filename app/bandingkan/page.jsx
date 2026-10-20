import Link from "next/link";
import { notFound } from "next/navigation";
import { buatKoneksiServer } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";
import TombolWhatsApp from "@/components/TombolWhatsApp";

export const metadata = {
  title: `Bandingkan Produk — ${toko.nama}`,
  description: "Perbandingan spesifikasi dan harga dua produk pilihan Anda.",
};

export const dynamic = "force-dynamic";

export default async function HalamanBandingkan({ searchParams }) {
  const params = await searchParams;
  const p1 = params?.p1;
  const p2 = params?.p2;

  // Jika parameter kurang lengkap
  if (!p1 || !p2) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold">Pilih 2 Produk untuk Dibandingkan</h1>
        <p className="max-w-md text-sm text-teks-lembut">
          Silakan pilih 2 produk dari katalog dengan menekan tombol "+ Bandingkan" pada kartu produk.
        </p>
        <Link
          href="/"
          className="rounded-xl bg-utama px-5 py-2.5 text-sm font-semibold text-white hover:bg-utama-gelap"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const supabase = buatKoneksiServer();
  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("*")
    .in("id", [p1, p2]);

  if (error || !daftarProduk || daftarProduk.length < 2) {
    notFound();
  }

  const produkA = daftarProduk.find((p) => String(p.id) === String(p1)) || daftarProduk[0];
  const produkB = daftarProduk.find((p) => String(p.id) === String(p2)) || daftarProduk[1];

  return (
    <div className="py-8 sm:py-12">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
      >
        ← Kembali ke katalog
      </Link>

      <h1 className="text-3xl font-extrabold tracking-tight">Perbandingan Produk</h1>
      <p className="mt-1 text-sm text-teks-lembut">
        Bandingkan foto, kategori, harga, dan rincian produk secara berdampingan.
      </p>

      {/* Tabel Komparasi Berdampingan */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-8">
        {[produkA, produkB].map((item, index) => (
          <div
            key={item.id}
            className="flex flex-col rounded-2xl border border-garis bg-permukaan p-4 sm:p-6"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-latar">
              <img
                src={item.foto_url}
                alt={item.nama}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-2 top-2 rounded-md bg-latar/80 px-2 py-0.5 text-xs font-bold text-teks backdrop-blur-xs">
                Pilihan {index + 1}
              </span>
            </div>

            <div className="mt-4 flex flex-1 flex-col gap-3">
              <div>
                <span className="text-xs font-semibold text-teks-lembut uppercase tracking-wider">
                  Kategori
                </span>
                <p className="text-sm font-bold text-teks">{item.kategori || "-"}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-teks-lembut uppercase tracking-wider">
                  Nama Produk
                </span>
                <h2 className="text-lg font-extrabold text-teks leading-snug">{item.nama}</h2>
              </div>

              <div>
                <span className="text-xs font-semibold text-teks-lembut uppercase tracking-wider">
                  Harga
                </span>
                <p className="text-xl font-extrabold text-harga">
                  {formatRupiah(item.harga)}
                </p>
              </div>

              <div className="flex-1">
                <span className="text-xs font-semibold text-teks-lembut uppercase tracking-wider">
                  Deskripsi
                </span>
                <p className="mt-1 text-sm leading-relaxed text-teks-lembut">
                  {item.deskripsi || "Tidak ada deskripsi."}
                </p>
              </div>

              <div className="pt-4 border-t border-garis">
                <TombolWhatsApp produk={item} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
