"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";

const KEY_TERAKHIR_DILIHAT = "katalog_terakhir_dilihat";
const BATAS_MAKSIMAL = 4;

// Helper untuk mencatat produk yang dilihat (dipanggil di halaman detail)
export function simpanTerakhirDilihat(produk) {
  if (typeof window === "undefined" || !produk?.id) return;
  try {
    const raw = localStorage.getItem(KEY_TERAKHIR_DILIHAT);
    let list = raw ? JSON.parse(raw) : [];
    // Hapus jika sudah ada sebelumnya agar pindah ke paling depan
    list = list.filter((p) => String(p.id) !== String(produk.id));
    // Tambah ke urutan terdepan
    list.unshift({
      id: produk.id,
      nama: produk.nama,
      harga: produk.harga,
      kategori: produk.kategori,
      foto_url: produk.foto_url,
    });
    // Batasi maksimal item
    list = list.slice(0, BATAS_MAKSIMAL);
    localStorage.setItem(KEY_TERAKHIR_DILIHAT, JSON.stringify(list));
  } catch (err) {
    console.error("Gagal menyimpan riwayat terakhir dilihat:", err);
  }
}

// Komponen tracker yang dipasang di halaman detail
export function CatatRiwayatLihat({ produk }) {
  useEffect(() => {
    if (produk) {
      simpanTerakhirDilihat(produk);
    }
  }, [produk]);

  return null;
}

// Komponen daftar riwayat yang ditampilkan di beranda
export default function BagianTerakhirDilihat() {
  const [daftar, setDaftar] = useState([]);
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY_TERAKHIR_DILIHAT);
      if (raw) {
        setDaftar(JSON.parse(raw) || []);
      }
    } catch {
      setDaftar([]);
    } finally {
      setSiap(true);
    }
  }, []);

  // Tidak muncul bila kosong atau belum siap
  if (!siap || daftar.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="judul-terakhir-dilihat" className="mt-8 flex flex-col gap-4 border-t border-garis pt-8">
      <div className="flex items-center justify-between">
        <h2 id="judul-terakhir-dilihat" className="text-lg font-bold">
          Terakhir dilihat
        </h2>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem(KEY_TERAKHIR_DILIHAT);
            setDaftar([]);
          }}
          className="text-xs text-teks-lembut hover:text-bahaya underline underline-offset-4"
        >
          Hapus riwayat
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {daftar.map((item) => (
          <Link
            key={item.id}
            href={`/produk/${item.id}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-garis bg-latar p-2 transition-colors hover:border-utama"
          >
            <img
              src={item.foto_url}
              alt={item.nama}
              className="aspect-square w-full rounded-lg bg-permukaan object-cover"
            />
            <div className="mt-2 flex flex-col gap-1">
              <p className="text-[10px] text-teks-lembut truncate">{item.kategori}</p>
              <h3 className="text-xs font-semibold leading-tight line-clamp-1 group-hover:text-utama">
                {item.nama}
              </h3>
              <p className="text-xs font-bold text-harga">{formatRupiah(item.harga)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
