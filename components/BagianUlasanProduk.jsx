"use client";

import { useActionState, useState } from "react";
import { kirimUlasanAction } from "@/app/produk/[id]/actions";

export default function BagianUlasanProduk({ produkId, daftarUlasan = [] }) {
  const [state, formAction, isPending] = useActionState(kirimUlasanAction, null);
  const [bintangPilihan, setBintangPilihan] = useState(5);

  // Hitung rata-rata rating
  const totalRating = daftarUlasan.reduce((acc, u) => acc + (Number(u.rating) || 0), 0);
  const rataRata = daftarUlasan.length > 0 ? (totalRating / daftarUlasan.length).toFixed(1) : null;

  return (
    <section className="flex flex-col gap-6 border-t border-garis pt-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Ulasan & Rating Pembeli</h2>
          <p className="text-xs text-teks-lembut">
            Lihat pengalaman pembeli atau berikan penilaian untuk produk ini
          </p>
        </div>

        {rataRata ? (
          <div className="flex items-center gap-2 rounded-xl border border-garis bg-permukaan px-3 py-1.5 self-start">
            <span className="text-amber-500 text-lg">★</span>
            <span className="text-lg font-extrabold text-teks">{rataRata}</span>
            <span className="text-xs text-teks-lembut">/ 5.0 ({daftarUlasan.length} ulasan)</span>
          </div>
        ) : (
          <span className="text-xs text-teks-lembut">Belum ada rating</span>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Form Tambah Ulasan */}
        <div className="rounded-2xl border border-garis bg-permukaan p-5">
          <h3 className="font-semibold text-sm mb-3">Tulis Ulasan Anda</h3>

          {state?.success && (
            <div className="mb-4 rounded-xl border border-garis bg-latar p-3 text-xs font-semibold text-utama">
              {state.message}
            </div>
          )}

          {state?.error && (
            <div className="mb-4 rounded-xl border border-merah/20 bg-merah-latar p-3 text-xs font-semibold text-merah">
              {state.error}
            </div>
          )}

          <form action={formAction} className="flex flex-col gap-3">
            <input type="hidden" name="produk_id" value={produkId} />
            <input type="hidden" name="rating" value={bintangPilihan} />

            {/* Honeypot Spam Protection (Tersembunyi dari manusia) */}
            <input
              type="text"
              name="website_url"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
            />

            <div>
              <label className="text-xs font-semibold text-teks-lembut">Beri Nilai Bintang:</label>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((bintang) => (
                  <button
                    key={bintang}
                    type="button"
                    onClick={() => setBintangPilihan(bintang)}
                    className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                  >
                    <span className={bintang <= bintangPilihan ? "text-amber-500" : "text-garis"}>
                      ★
                    </span>
                  </button>
                ))}
                <span className="ml-2 text-xs font-bold text-teks">{bintangPilihan} dari 5</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="ulasan-nama" className="text-xs font-semibold text-teks-lembut">
                Nama Anda:
              </label>
              <input
                id="ulasan-nama"
                name="nama"
                type="text"
                required
                maxLength={50}
                placeholder="Nama Anda"
                className="rounded-xl border border-garis bg-latar px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-utama"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="ulasan-komentar" className="text-xs font-semibold text-teks-lembut">
                Komentar / Pengalaman:
              </label>
              <textarea
                id="ulasan-komentar"
                name="komentar"
                rows={3}
                required
                maxLength={500}
                placeholder="Bagikan ulasan Anda tentang kualitas, kemasan, atau rasa produk ini..."
                className="rounded-xl border border-garis bg-latar px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-utama resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-1 rounded-xl bg-utama py-2 text-xs font-bold text-white hover:bg-utama-gelap disabled:opacity-50"
            >
              {isPending ? "Mengirim..." : "Kirim Ulasan"}
            </button>
          </form>
        </div>

        {/* Daftar Ulasan Terakhir */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-sm">Ulasan Pengunjung</h3>
          {daftarUlasan.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-garis p-6 text-center text-xs text-teks-lembut">
              Jadilah yang pertama memberikan ulasan untuk produk ini!
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
              {daftarUlasan.map((u) => (
                <div key={u.id} className="rounded-xl border border-garis bg-permukaan p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-teks">{u.nama}</span>
                    <div className="flex text-amber-500 text-xs">
                      {"★".repeat(u.rating || 5)}
                      <span className="text-garis">{"★".repeat(5 - (u.rating || 5))}</span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs text-teks-lembut leading-relaxed">{u.komentar}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
