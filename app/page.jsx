import KartuProduk from "@/components/KartuProduk";
import { buatKoneksiServer } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const params = await searchParams;
  const kataKunci = (params?.q || "").trim();
  const kategoriAktif = (params?.kategori || "").trim();

  let daftarProduk = [];
  let daftarKategori = [];
  let pesanError = null;

  try {
    const supabase = buatKoneksiServer();

    // Ambil daftar kategori unik dari semua produk untuk filter pill
    const { data: semuaDataKategori } = await supabase
      .from("produk")
      .select("kategori");

    if (semuaDataKategori) {
      daftarKategori = Array.from(
        new Set(semuaDataKategori.map((p) => p.kategori).filter(Boolean))
      );
    }

    // Query daftar produk dengan filter jika ada
    let query = supabase.from("produk").select("*");

    if (kategoriAktif) {
      query = query.eq("kategori", kategoriAktif);
    }

    if (kataKunci) {
      query = query.ilike("nama", `%${kataKunci}%`);
    }

    const { data, error } = await query.order("id", { ascending: true });

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message || "Gagal mengambil data dari database.";
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>

          {/* Form Pencarian */}
          <form method="GET" action="/" className="flex w-full sm:w-72 items-center gap-2">
            {kategoriAktif && (
              <input type="hidden" name="kategori" value={kategoriAktif} />
            )}
            <input
              type="search"
              name="q"
              defaultValue={kataKunci}
              placeholder="Cari nama produk..."
              className="w-full rounded-xl border border-garis bg-permukaan px-3 py-2 text-sm placeholder:text-teks-lembut focus:bg-latar focus:outline-none focus:ring-2 focus:ring-utama"
            />
            <button
              type="submit"
              className="rounded-xl bg-utama px-4 py-2 text-sm font-semibold text-white hover:bg-utama-gelap"
            >
              Cari
            </button>
          </form>
        </div>

        {/* Filter Kategori */}
        {daftarKategori.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={kataKunci ? `/?q=${encodeURIComponent(kataKunci)}` : "/"}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                !kategoriAktif
                  ? "bg-utama text-white"
                  : "border border-garis bg-permukaan text-teks-lembut hover:border-utama hover:text-utama"
              }`}
            >
              Semua
            </a>
            {daftarKategori.map((kategori) => {
              const url = `/?kategori=${encodeURIComponent(kategori)}${
                kataKunci ? `&q=${encodeURIComponent(kataKunci)}` : ""
              }`;
              const aktif = kategoriAktif === kategori;
              return (
                <a
                  key={kategori}
                  href={url}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                    aktif
                      ? "bg-utama text-white"
                      : "border border-garis bg-permukaan text-teks-lembut hover:border-utama hover:text-utama"
                  }`}
                >
                  {kategori}
                </a>
              );
            })}
          </div>
        )}

        {pesanError ? (
          <div className="rounded-xl border border-garis bg-permukaan p-4 text-sm text-bahaya">
            Gagal mengambil data produk: {pesanError}
          </div>
        ) : daftarProduk.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-teks-lembut">
              {kataKunci || kategoriAktif
                ? "Tidak ada produk yang sesuai dengan pencarian atau filter."
                : "Belum ada produk"}
            </p>
            {(kataKunci || kategoriAktif) && (
              <a
                href="/"
                className="mt-3 inline-block text-xs font-semibold text-utama underline underline-offset-4"
              >
                Reset pencarian & filter
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
