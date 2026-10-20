"use client";

import { useState } from "react";

export default function GaleriFotoProduk({ fotoUtama, daftarFoto = [], namaProduk = "Produk" }) {
  // Satukan fotoUtama dan daftarFoto jika ada
  const semuaFoto = Array.from(
    new Set([fotoUtama, ...(Array.isArray(daftarFoto) ? daftarFoto : [])].filter(Boolean))
  );

  const [fotoAktif, setFotoAktif] = useState(semuaFoto[0] || fotoUtama);

  return (
    <div className="flex flex-col gap-3">
      {/* Foto Utama Aktif */}
      <div className="overflow-hidden rounded-2xl border border-garis bg-permukaan">
        <img
          src={fotoAktif}
          alt={namaProduk}
          className="aspect-square w-full object-cover transition-all duration-300"
        />
      </div>

      {/* Baris Thumbnail (Jika foto lebih dari 1) */}
      {semuaFoto.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {semuaFoto.map((foto, index) => {
            const isSelected = foto === fotoAktif;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setFotoAktif(foto)}
                aria-label={`Lihat foto ${index + 1}`}
                className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-utama ring-2 ring-utama/30 ring-offset-1"
                    : "border-garis opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={foto}
                  alt={`${namaProduk} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
