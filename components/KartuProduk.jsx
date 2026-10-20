"use client";

import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { useKeranjang } from "@/components/KeranjangBelanja";

export default function KartuProduk({ produk }) {
  const { tambahItem } = useKeranjang();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar transition-shadow hover:shadow-md">
      <Link href={`/produk/${produk.id}`} className="flex flex-col">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className="aspect-square w-full bg-permukaan object-cover"
        />
        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <p className="text-xs text-teks-lembut">{produk.kategori}</p>
          <h3 className="font-semibold leading-snug group-hover:text-utama line-clamp-1">{produk.nama}</h3>
          <p className="mt-1 self-start rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
        </div>
      </Link>

      <div className="p-3 pt-0">
        <button
          type="button"
          onClick={() => tambahItem(produk, 1)}
          className="flex w-full items-center justify-center gap-1 rounded-xl border border-garis bg-permukaan py-1.5 text-xs font-semibold text-teks transition-colors hover:border-utama hover:bg-utama hover:text-white"
        >
          <span>+ Keranjang</span>
        </button>
      </div>
    </div>
  );
}
