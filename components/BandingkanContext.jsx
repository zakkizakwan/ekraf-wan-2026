"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";

const BandingkanContext = createContext();
const KEY_BANDINGKAN = "katalog_produk_bandingkan";

export function BandingkanProvider({ children }) {
  const [items, setItems] = useState([]); // array berisi maks 2 id produk
  const [pesan, setPesan] = useState(null);
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY_BANDINGKAN);
      if (raw) setItems(JSON.parse(raw) || []);
    } catch {
      setItems([]);
    } finally {
      setSiap(true);
    }
  }, []);

  useEffect(() => {
    if (siap) {
      localStorage.setItem(KEY_BANDINGKAN, JSON.stringify(items));
    }
  }, [items, siap]);

  const toggleBandingkan = (id) => {
    const stringId = String(id);
    if (items.includes(stringId)) {
      setItems((prev) => prev.filter((i) => i !== stringId));
      setPesan(null);
    } else {
      if (items.length >= 2) {
        // Tampilkan pesan bahwa maksimal hanya 2 produk (atau ganti item pertama)
        setPesan("Maksimal 2 produk untuk dibandingkan. Produk pertama digantikan.");
        setItems((prev) => [prev[1], stringId]);
      } else {
        setItems((prev) => [...prev, stringId]);
        setPesan(null);
      }
    }
  };

  const isBandingkan = (id) => items.includes(String(id));

  const resetBandingkan = () => {
    setItems([]);
    setPesan(null);
  };

  return (
    <BandingkanContext.Provider
      value={{
        items,
        toggleBandingkan,
        isBandingkan,
        resetBandingkan,
        totalBanding: items.length,
        pesan,
      }}
    >
      {children}
      {/* Floating Bar bila ada produk yang dipilih */}
      <BarBandingkan />
    </BandingkanContext.Provider>
  );
}

export function useBandingkan() {
  const context = useContext(BandingkanContext);
  if (!context) {
    throw new Error("useBandingkan harus digunakan di dalam BandingkanProvider");
  }
  return context;
}

export function TombolBandingkan({ id, className = "" }) {
  const { isBandingkan, toggleBandingkan } = useBandingkan();
  const aktif = isBandingkan(id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBandingkan(id);
      }}
      className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
        aktif
          ? "border-utama bg-utama text-white"
          : "border-garis bg-permukaan text-teks-lembut hover:border-utama hover:text-utama"
      } ${className}`}
    >
      {aktif ? "✓ Bandingkan" : "+ Bandingkan"}
    </button>
  );
}

function BarBandingkan() {
  const { items, resetBandingkan, pesan } = useBandingkan();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-2xl border border-garis bg-latar/95 px-5 py-3 shadow-xl backdrop-blur-md">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        {pesan && (
          <p className="text-xs font-medium text-bahaya">{pesan}</p>
        )}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-teks">
            {items.length} / 2 produk dipilih
          </span>
          {items.length === 2 && (
            <Link
              href={`/bandingkan?p1=${items[0]}&p2=${items[1]}`}
              className="rounded-xl bg-utama px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-utama-gelap"
            >
              Bandingkan Sekarang →
            </Link>
          )}
          <button
            type="button"
            onClick={resetBandingkan}
            className="text-xs text-teks-lembut hover:text-bahaya underline"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
