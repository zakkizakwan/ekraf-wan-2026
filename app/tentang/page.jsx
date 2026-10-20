import Link from "next/link";
import { toko } from "@/lib/toko";

export const metadata = {
  title: `Tentang Kami — ${toko.nama}`,
  description: `Profil dan kontak resmi ${toko.nama}`,
};

export default function HalamanTentang() {
  const urlWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(
    `Halo ${toko.nama}, saya ingin bertanya tentang toko Anda.`
  )}`;

  return (
    <article className="mx-auto max-w-3xl py-10 sm:py-14">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
      >
        ← Kembali ke katalog
      </Link>

      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        Tentang {toko.nama}
      </h1>
      <p className="mt-3 text-lg text-teks-lembut">{toko.tagline}</p>

      <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-garis bg-permukaan p-6 sm:p-8">
        <div>
          <h2 className="text-base font-bold text-teks">Alamat Usaha</h2>
          <p className="mt-1 text-sm text-teks-lembut">{toko.alamat}</p>
        </div>

        <div className="border-t border-garis pt-4">
          <h2 className="text-base font-bold text-teks">Jam Operasional</h2>
          <p className="mt-1 text-sm text-teks-lembut">{toko.jamBuka}</p>
        </div>

        <div className="border-t border-garis pt-4">
          <h2 className="text-base font-bold text-teks">Kontak & Pemesanan</h2>
          <p className="mt-1 text-sm text-teks-lembut">
            WhatsApp: +{toko.nomorWhatsApp}
          </p>
          <div className="mt-4">
            <a
              href={urlWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-utama px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-utama-gelap"
            >
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
