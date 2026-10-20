import KartuProduk from "@/components/KartuProduk";
import { buatKoneksiServer } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";
import Link from "next/link";
import TampilanDaftarFavorit from "@/components/TampilanDaftarFavorit";

export const metadata = {
  title: `Produk Favorit — ${toko.nama}`,
  description: "Daftar produk favorit tersimpan di browser Anda.",
};

export const dynamic = "force-dynamic";

export default async function HalamanFavorit() {
  let semuaProduk = [];
  try {
    const supabase = buatKoneksiServer();
    const { data } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });
    semuaProduk = data || [];
  } catch (err) {
    console.error("Gagal mengambil data produk favorit:", err);
  }

  return (
    <div className="py-8 sm:py-12">
      <Link
        href="/"
        className="mb-4 inline-block text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
      >
        ← Kembali ke katalog
      </Link>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Produk Favorit</h1>
          <p className="mt-1 text-sm text-teks-lembut">
            Produk pilihan Anda yang tersimpan di browser ini.
          </p>
        </div>
      </div>

      <TampilanDaftarFavorit semuaProduk={semuaProduk} />
    </div>
  );
}
