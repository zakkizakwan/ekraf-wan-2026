"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const [varian, setVarian] = useState("");

  const kurangiJumlah = () => setJumlah((prev) => Math.max(1, prev - 1));
  const tambahJumlah = () => setJumlah((prev) => prev + 1);

  const totalHarga = (Number(produk?.harga) || 0) * jumlah;
  
  let rincianPesanan = `${produk.nama} (${jumlah}x @ ${formatRupiah(produk.harga)} = ${formatRupiah(totalHarga)})`;
  if (varian.trim()) {
    rincianPesanan += ` - Pilihan varian: ${varian.trim()}`;
  }

  const pesan = `Halo, saya ingin memesan ${rincianPesanan}.`;
  const urlWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Pengatur Jumlah & Varian */}
      <div className="flex flex-col gap-3 rounded-xl border border-garis bg-permukaan p-3.5">
        <div className="flex items-center justify-between">
          <label htmlFor="input-jumlah" className="text-sm font-semibold text-teks">
            Jumlah pesanan:
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={kurangiJumlah}
              aria-label="Kurangi jumlah"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-garis bg-latar text-base font-bold text-teks hover:bg-garis"
            >
              -
            </button>
            <span id="input-jumlah" className="w-8 text-center text-sm font-bold">
              {jumlah}
            </span>
            <button
              type="button"
              onClick={tambahJumlah}
              aria-label="Tambah jumlah"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-garis bg-latar text-base font-bold text-teks hover:bg-garis"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="input-varian" className="text-xs text-teks-lembut">
            Pilihan varian / catatan (opsional):
          </label>
          <input
            id="input-varian"
            type="text"
            value={varian}
            onChange={(e) => setVarian(e.target.value)}
            placeholder="Contoh: Ukuran M / Pedas Sedang / Rasa Cokelat"
            className="rounded-lg border border-garis bg-latar px-3 py-1.5 text-sm text-teks placeholder:text-teks-lembut focus:outline-none focus:ring-2 focus:ring-utama"
          />
        </div>

        <div className="flex items-center justify-between border-t border-garis pt-2 text-xs">
          <span className="text-teks-lembut">Total:</span>
          <span className="font-bold text-harga">{formatRupiah(totalHarga)}</span>
        </div>
      </div>

      <a
        href={urlWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}
