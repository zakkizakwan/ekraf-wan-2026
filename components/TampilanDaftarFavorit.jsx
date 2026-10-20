"use client";

import { useFavorit } from "@/components/FavoritContext";
import KartuProduk from "@/components/KartuProduk";
import Link from "next/link";

export default function TampilanDaftarFavorit({ semuaProduk }) {
  const { favoritIds } = useFavorit();

  const produkFavorit = semuaProduk.filter((p) =>
    favoritIds.includes(String(p.id))
  );

  if (produkFavorit.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-garis bg-permukaan py-16 text-center">
        <span className="text-4xl">❤️</span>
        <h2 className="text-lg font-bold text-teks">Belum ada produk favorit</h2>
        <p className="max-w-sm text-sm text-teks-lembut">
          Tandai produk yang kamu sukai dengan ikon hati agar tersimpan dan mudah ditemukan di sini.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-xl bg-utama px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-utama-gelap"
        >
          Lihat Katalog Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {produkFavorit.map((produk) => (
        <KartuProduk key={produk.id} produk={produk} />
      ))}
    </div>
  );
}
