"use client";

import Link from "next/link";
import { toko } from "@/lib/toko";
import { useKeranjang } from "@/components/KeranjangBelanja";
import TombolTema from "@/components/TombolTema";

export default function Header() {
  const { totalItem, setTerbuka } = useKeranjang();

  return (
    <header className="border-b border-garis bg-latar sticky top-0 z-40 backdrop-blur-md bg-latar/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-utama">
          {toko.nama}
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="flex items-center gap-3 sm:gap-4 text-sm font-semibold text-teks-lembut">
            <Link href="/" className="hover:text-utama">
              Katalog
            </Link>
            <Link href="/favorit" className="hover:text-utama">
              Favorit
            </Link>
            <Link href="/tentang" className="hover:text-utama">
              Tentang
            </Link>
          </nav>

          {/* US-25: Tombol Ganti Mode Gelap/Terang */}
          <TombolTema />

          {/* Tombol Keranjang Belanja */}
          <button
            type="button"
            onClick={() => setTerbuka(true)}
            aria-label="Buka keranjang belanja"
            className="relative flex items-center gap-1.5 rounded-full border border-garis bg-permukaan px-3 py-1.5 text-xs font-bold text-teks hover:border-utama hover:text-utama"
          >
            <span>🛒</span>
            <span className="hidden sm:inline">Keranjang</span>
            {totalItem > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-utama px-1 text-[11px] font-bold text-white">
                {totalItem}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
