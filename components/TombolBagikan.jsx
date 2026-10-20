"use client";

import { useState } from "react";

export default function TombolBagikan({ namaProduk }) {
  const [pesanTersalin, setPesanTersalin] = useState(false);

  const tanganiBagikan = async () => {
    const url = window.location.href;
    const shareData = {
      title: namaProduk,
      text: `Lihat produk ${namaProduk} di katalog kami!`,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Jika dibatalkan user atau tidak didukung, fallback ke clipboard
        if (err.name === "AbortError") return;
      }
    }

    // Salin ke clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setPesanTersalin(true);
      setTimeout(() => setPesanTersalin(false), 2500);
    } catch (e) {
      console.error("Gagal menyalin link:", e);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={tanganiBagikan}
        className="inline-flex items-center gap-2 rounded-lg border border-garis bg-permukaan px-3 py-2 text-xs font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Bagikan produk
      </button>

      {pesanTersalin && (
        <span className="text-xs font-medium text-utama animate-pulse">
          ✓ Link tersalin ke clipboard!
        </span>
      )}
    </div>
  );
}
