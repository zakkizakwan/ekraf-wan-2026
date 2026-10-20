"use client";

import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { useKeranjang } from "@/components/KeranjangBelanja";
import { TombolFavorit } from "@/components/FavoritContext";
import { TombolBandingkan } from "@/components/BandingkanContext";

export default function KartuProduk({ produk }) {
  const { tambahItem } = useKeranjang();

  const isHabis = produk.stok !== undefined && produk.stok !== null && Number(produk.stok) <= 0;
  
  // Perhitungan badge & harga coret
  const hargaDiskon = produk.harga_diskon ? Number(produk.harga_diskon) : null;
  const punyaDiskon = hargaDiskon !== null && hargaDiskon > 0 && hargaDiskon < produk.harga;
  const hargaTampil = punyaDiskon ? hargaDiskon : produk.harga;

  // Logika badge Baru / Terlaris
  const dibuatBaru = produk.created_at && (new Date() - new Date(produk.created_at)) < (1000 * 60 * 60 * 24 * 7); // < 7 hari
  const badgeBaru = produk.is_baru || dibuatBaru;
  const badgeTerlaris = Boolean(produk.is_terlaris);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar transition-shadow hover:shadow-md">
      {/* US-19 & US-20: Badge status stok & label promo / baru / terlaris */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1 items-start">
        {isHabis && (
          <span className="rounded-md bg-merah px-2 py-0.5 text-xs font-bold text-white shadow-xs">
            Habis
          </span>
        )}
        {punyaDiskon && (
          <span className="rounded-md bg-amber-500 px-2 py-0.5 text-xs font-bold text-white shadow-xs">
            Diskon
          </span>
        )}
        {!isHabis && badgeTerlaris && (
          <span className="rounded-md bg-utama px-2 py-0.5 text-xs font-bold text-white shadow-xs">
            Terlaris
          </span>
        )}
        {!isHabis && !badgeTerlaris && badgeBaru && (
          <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white shadow-xs">
            Baru
          </span>
        )}
      </div>

      {/* US-24: Tombol Favorit */}
      <div className="absolute right-2 top-2 z-10 rounded-full bg-latar/80 p-1 backdrop-blur-xs shadow-xs">
        <TombolFavorit id={produk.id} nama={produk.nama} />
      </div>

      <Link href={`/produk/${produk.id}`} className="flex flex-col">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className={`aspect-square w-full bg-permukaan object-cover ${isHabis ? "opacity-60 grayscale-50" : ""}`}
        />
        <div className="flex flex-1 flex-col gap-1.5 p-3">
          {produk.kategori && (
            <Link
              href={`/kategori/${encodeURIComponent(produk.kategori)}`}
              onClick={(e) => e.stopPropagation()}
              className="self-start text-xs text-teks-lembut hover:text-utama hover:underline"
            >
              {produk.kategori}
            </Link>
          )}
          <h3 className="font-semibold leading-snug group-hover:text-utama line-clamp-1">{produk.nama}</h3>
          
          <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
            <span className="rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
              {formatRupiah(hargaTampil)}
            </span>
            {punyaDiskon && (
              <span className="text-xs text-teks-lembut line-through">
                {formatRupiah(produk.harga)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2 p-3 pt-0">
        {isHabis ? (
          <button
            type="button"
            disabled
            className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-garis bg-permukaan py-1.5 text-xs font-medium text-teks-lembut cursor-not-allowed opacity-70"
          >
            <span>Stok Habis</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => tambahItem({ ...produk, harga: hargaTampil }, 1)}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-garis bg-permukaan py-1.5 text-xs font-semibold text-teks transition-colors hover:border-utama hover:bg-utama hover:text-white"
          >
            <span>+ Keranjang</span>
          </button>
        )}
        <TombolBandingkan id={produk.id} />
      </div>
    </div>
  );
}
