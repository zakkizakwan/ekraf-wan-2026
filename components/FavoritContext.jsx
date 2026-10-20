"use client";

import { createContext, useContext, useEffect, useState } from "react";

const FavoritContext = createContext();
const KEY_FAVORIT = "katalog_produk_favorit";

export function FavoritProvider({ children }) {
  const [favoritIds, setFavoritIds] = useState([]);
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY_FAVORIT);
      if (raw) {
        setFavoritIds(JSON.parse(raw) || []);
      }
    } catch {
      setFavoritIds([]);
    } finally {
      setSiap(true);
    }
  }, []);

  useEffect(() => {
    if (siap) {
      localStorage.setItem(KEY_FAVORIT, JSON.stringify(favoritIds));
    }
  }, [favoritIds, siap]);

  const toggleFavorit = (id) => {
    const stringId = String(id);
    setFavoritIds((prev) =>
      prev.includes(stringId)
        ? prev.filter((item) => item !== stringId)
        : [...prev, stringId]
    );
  };

  const isFavorit = (id) => favoritIds.includes(String(id));

  return (
    <FavoritContext.Provider
      value={{
        favoritIds,
        toggleFavorit,
        isFavorit,
        totalFavorit: favoritIds.length,
      }}
    >
      {children}
    </FavoritContext.Provider>
  );
}

export function useFavorit() {
  const context = useContext(FavoritContext);
  if (!context) {
    throw new Error("useFavorit harus digunakan di dalam FavoritProvider");
  }
  return context;
}

// Tombol icon love untuk kartu dan halaman detail
export function TombolFavorit({ id, nama, className = "" }) {
  const { isFavorit, toggleFavorit } = useFavorit();
  const aktif = isFavorit(id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorit(id);
      }}
      aria-label={aktif ? `Hapus ${nama} dari favorit` : `Tambah ${nama} ke favorit`}
      title={aktif ? "Hapus dari favorit" : "Tambah ke favorit"}
      className={`flex items-center justify-center rounded-full transition-transform active:scale-90 ${className}`}
    >
      <span className={`text-base ${aktif ? "text-bahaya scale-110" : "text-teks-lembut hover:text-bahaya"}`}>
        {aktif ? "❤️" : "🤍"}
      </span>
    </button>
  );
}
