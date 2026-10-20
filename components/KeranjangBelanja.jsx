"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

const KeranjangContext = createContext();

const KEY_KERANJANG = "katalog_keranjang_belanja";

export function KeranjangProvider({ children }) {
  const [items, setItems] = useState([]);
  const [terbuka, setTerbuka] = useState(false);
  const [siap, setSiap] = useState(false);

  // Ambil isi keranjang dari localStorage saat client mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY_KERANJANG);
      if (raw) {
        setItems(JSON.parse(raw) || []);
      }
    } catch {
      setItems([]);
    } finally {
      setSiap(true);
    }
  }, []);

  // Simpan ke localStorage setiap items berubah
  useEffect(() => {
    if (siap) {
      localStorage.setItem(KEY_KERANJANG, JSON.stringify(items));
    }
  }, [items, siap]);

  const tambahItem = (produk, jumlah = 1) => {
    setItems((prev) => {
      const index = prev.findIndex((i) => String(i.id) === String(produk.id));
      if (index > -1) {
        const baru = [...prev];
        baru[index].jumlah += jumlah;
        return baru;
      }
      return [
        ...prev,
        {
          id: produk.id,
          nama: produk.nama,
          harga: Number(produk.harga) || 0,
          foto_url: produk.foto_url,
          kategori: produk.kategori,
          jumlah,
        },
      ];
    });
    setTerbuka(true);
  };

  const updateJumlah = (id, jumlahBaru) => {
    if (jumlahBaru <= 0) {
      hapusItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(id) ? { ...item, jumlah: jumlahBaru } : item
      )
    );
  };

  const hapusItem = (id) => {
    setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const kosongkanKeranjang = () => {
    setItems([]);
  };

  const totalItem = items.reduce((sum, item) => sum + item.jumlah, 0);
  const totalHarga = items.reduce(
    (sum, item) => sum + item.harga * item.jumlah,
    0
  );

  return (
    <KeranjangContext.Provider
      value={{
        items,
        terbuka,
        setTerbuka,
        tambahItem,
        updateJumlah,
        hapusItem,
        kosongkanKeranjang,
        totalItem,
        totalHarga,
      }}
    >
      {children}
      {/* Modal / Drawer Keranjang Belanja */}
      <DrawerKeranjang />
    </KeranjangContext.Provider>
  );
}

export function useKeranjang() {
  const context = useContext(KeranjangContext);
  if (!context) {
    throw new Error("useKeranjang harus digunakan di dalam KeranjangProvider");
  }
  return context;
}

// Drawer Keranjang Belanja
function DrawerKeranjang() {
  const {
    items,
    terbuka,
    setTerbuka,
    updateJumlah,
    hapusItem,
    totalItem,
    totalHarga,
  } = useKeranjang();

  if (!terbuka) return null;

  // Format pesan WhatsApp untuk semua item dalam keranjang (US-21)
  const buatPesanWhatsApp = () => {
    let teks = `Halo ${toko.nama}, saya ingin memesan produk berikut:\n\n`;
    items.forEach((item, idx) => {
      const subtotal = item.harga * item.jumlah;
      teks += `${idx + 1}. ${item.nama} (${item.jumlah}x @ ${formatRupiah(item.harga)}) = ${formatRupiah(subtotal)}\n`;
    });
    teks += `\n*Total Belanja:* ${formatRupiah(totalHarga)}\n`;
    teks += `\nMohon konfirmasi ketersediaan dan cara pembayarannya. Terima kasih!`;
    return `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(teks)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
      <div className="flex h-full w-full max-w-md flex-col bg-latar shadow-2xl">
        {/* Header Drawer */}
        <div className="flex items-center justify-between border-b border-garis px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-teks">Keranjang Belanja</h2>
            <span className="rounded-full bg-utama/10 px-2 py-0.5 text-xs font-bold text-utama">
              {totalItem} item
            </span>
          </div>
          <button
            type="button"
            onClick={() => setTerbuka(false)}
            aria-label="Tutup keranjang"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-teks-lembut hover:bg-permukaan hover:text-teks"
          >
            ✕
          </button>
        </div>

        {/* Daftar Item */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="text-4xl">🛒</span>
              <p className="text-sm font-medium text-teks-lembut">
                Keranjang belanja masih kosong
              </p>
              <button
                type="button"
                onClick={() => setTerbuka(false)}
                className="mt-2 text-xs font-semibold text-utama underline underline-offset-4"
              >
                Mulai belanja produk
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-garis bg-permukaan p-3"
                >
                  <img
                    src={item.foto_url}
                    alt={item.nama}
                    className="h-16 w-16 rounded-lg bg-latar object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-teks line-clamp-1">
                        {item.nama}
                      </h3>
                      <p className="text-xs font-bold text-harga">
                        {formatRupiah(item.harga)}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateJumlah(item.id, item.jumlah - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-garis bg-latar text-xs font-bold hover:bg-garis"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-xs font-bold">
                          {item.jumlah}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateJumlah(item.id, item.jumlah + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-garis bg-latar text-xs font-bold hover:bg-garis"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => hapusItem(item.id)}
                        className="text-xs text-bahaya hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Drawer: Total & Tombol Order WA */}
        {items.length > 0 && (
          <div className="border-t border-garis bg-permukaan p-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-teks-lembut">Total Belanja:</span>
              <span className="text-xl font-extrabold text-harga">
                {formatRupiah(totalHarga)}
              </span>
            </div>
            <a
              href={buatPesanWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-xl bg-utama py-3.5 text-center text-sm font-bold text-white shadow-md transition-colors hover:bg-utama-gelap"
            >
              Pesan Semua via WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
