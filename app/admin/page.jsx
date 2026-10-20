import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatKoneksiServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  let daftarProduk = [];
  let pesanError = null;

  try {
    const supabase = buatKoneksiServer();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message || "Gagal mengambil data produk dari database.";
  }

  // US-30: Ringkasan total produk dan per kategori
  const totalProduk = daftarProduk.length;
  const jumlahPerKategori = daftarProduk.reduce((acc, produk) => {
    const kat = produk.kategori || "Tanpa Kategori";
    acc[kat] = (acc[kat] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      {/* US-30: Kartu Ringkasan Dashboard */}
      <section aria-labelledby="judul-ringkasan" className="flex flex-col gap-3">
        <h2 id="judul-ringkasan" className="text-sm font-bold uppercase tracking-wider text-teks-lembut">
          Ringkasan Toko
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-garis bg-permukaan p-4">
            <p className="text-xs text-teks-lembut">Total Produk</p>
            <p className="mt-1 text-2xl font-extrabold text-utama">{totalProduk}</p>
          </div>
          {Object.entries(jumlahPerKategori).map(([kategori, jumlah]) => (
            <div key={kategori} className="rounded-2xl border border-garis bg-permukaan p-4">
              <p className="text-xs text-teks-lembut truncate">{kategori}</p>
              <p className="mt-1 text-2xl font-extrabold text-teks">{jumlah}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-garis pt-6">
        <h1 className="text-2xl font-extrabold">Daftar Produk</h1>
        <div className="flex items-center gap-3">
          {/* US-35: Ekspor produk ke CSV */}
          <a
            href="/admin/produk/ekspor"
            download
            className="rounded-xl border border-garis bg-permukaan px-4 py-2 text-sm font-semibold text-teks hover:border-utama hover:text-utama"
          >
            Ekspor CSV
          </a>
          {/* US-08: tambah produk */}
          <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
        </div>
      </div>

      {pesanError ? (
        <div className="rounded-xl border border-garis bg-permukaan p-4 text-sm text-bahaya">
          Gagal mengambil data produk: {pesanError}
        </div>
      ) : daftarProduk.length === 0 ? (
        <p className="py-8 text-center text-sm text-teks-lembut">Belum ada produk</p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
