import KartuProduk from "@/components/KartuProduk";
import { buatKoneksiServer } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const params = await searchParams;
  const kataKunci = (params?.q || "").trim();
  const kategoriAktif = (params?.kategori || "").trim();
  const urutan = (params?.urut || "terbaru").trim();
  const halamanSaatIni = Math.max(1, parseInt(params?.hal || "1", 10) || 1);
  const perHalaman = 6;

  let daftarProduk = [];
  let daftarKategori = [];
  let pesanError = null;
  let totalData = 0;
  let totalHalaman = 1;

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

    // Query daftar produk dengan filter & count: "exact"
    let query = supabase.from("produk").select("*", { count: "exact" });

    if (kategoriAktif) {
      query = query.eq("kategori", kategoriAktif);
    }

    if (kataKunci) {
      query = query.ilike("nama", `%${kataKunci}%`);
    }

    // US-15: Pengurutan di tingkat database
    if (urutan === "termurah") {
      query = query.order("harga", { ascending: true });
    } else if (urutan === "termahal") {
      query = query.order("harga", { ascending: false });
    } else {
      // Default terbaru
      query = query.order("id", { ascending: false });
    }

    // US-16: Paginasi di tingkat database (range)
    const dari = (halamanSaatIni - 1) * perHalaman;
    const sampai = dari + perHalaman - 1;
    query = query.range(dari, sampai);

    const { data, error, count } = await query;

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
      totalData = count || 0;
      totalHalaman = Math.max(1, Math.ceil(totalData / perHalaman));
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

          <div className="flex flex-wrap items-center gap-3">
            {/* Form Pencarian & Urutan */}
            <form method="GET" action="/" className="flex flex-wrap items-center gap-2">
              {kategoriAktif && (
                <input type="hidden" name="kategori" value={kategoriAktif} />
              )}
              <input
                type="search"
                name="q"
                defaultValue={kataKunci}
                placeholder="Cari nama produk..."
                className="w-48 sm:w-60 rounded-xl border border-garis bg-permukaan px-3 py-2 text-sm placeholder:text-teks-lembut focus:bg-latar focus:outline-none focus:ring-2 focus:ring-utama"
              />
              
              {/* Dropdown Urutkan */}
              <select
                name="urut"
                defaultValue={urutan}
                className="rounded-xl border border-garis bg-permukaan px-3 py-2 text-sm text-teks focus:bg-latar focus:outline-none focus:ring-2 focus:ring-utama"
              >
                <option value="terbaru">Terbaru</option>
                <option value="termurah">Termurah</option>
                <option value="termahal">Termahal</option>
              </select>

              <button
                type="submit"
                className="rounded-xl bg-utama px-4 py-2 text-sm font-semibold text-white hover:bg-utama-gelap"
              >
                Terapkan
              </button>
            </form>
          </div>
        </div>

        {/* Filter Kategori */}
        {daftarKategori.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`/?${new URLSearchParams({
                ...(kataKunci ? { q: kataKunci } : {}),
                ...(urutan !== "terbaru" ? { urut: urutan } : {}),
              }).toString()}`}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                !kategoriAktif
                  ? "bg-utama text-white"
                  : "border border-garis bg-permukaan text-teks-lembut hover:border-utama hover:text-utama"
              }`}
            >
              Semua
            </a>
            {daftarKategori.map((kategori) => {
              const queryParams = new URLSearchParams({
                kategori,
                ...(kataKunci ? { q: kataKunci } : {}),
                ...(urutan !== "terbaru" ? { urut: urutan } : {}),
              }).toString();
              const aktif = kategoriAktif === kategori;
              return (
                <a
                  key={kategori}
                  href={`/?${queryParams}`}
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
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {daftarProduk.map((produk) => (
                <KartuProduk key={produk.id} produk={produk} />
              ))}
            </div>

            {/* US-16: Kontrol Navigasi Paginasi */}
            {totalHalaman > 1 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-garis pt-6">
                {halamanSaatIni > 1 && (
                  <a
                    href={`/?${new URLSearchParams({
                      ...(kataKunci ? { q: kataKunci } : {}),
                      ...(kategoriAktif ? { kategori: kategoriAktif } : {}),
                      ...(urutan !== "terbaru" ? { urut: urutan } : {}),
                      hal: String(halamanSaatIni - 1),
                    }).toString()}`}
                    className="rounded-xl border border-garis bg-permukaan px-3 py-1.5 text-xs font-semibold text-teks hover:border-utama hover:text-utama"
                  >
                    ← Sebelumnya
                  </a>
                )}

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((nomor) => {
                    const isAktif = nomor === halamanSaatIni;
                    return (
                      <a
                        key={nomor}
                        href={`/?${new URLSearchParams({
                          ...(kataKunci ? { q: kataKunci } : {}),
                          ...(kategoriAktif ? { kategori: kategoriAktif } : {}),
                          ...(urutan !== "terbaru" ? { urut: urutan } : {}),
                          hal: String(nomor),
                        }).toString()}`}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                          isAktif
                            ? "bg-utama text-white"
                            : "border border-garis bg-permukaan text-teks-lembut hover:border-utama hover:text-utama"
                        }`}
                      >
                        {nomor}
                      </a>
                    );
                  })}
                </div>

                {halamanSaatIni < totalHalaman && (
                  <a
                    href={`/?${new URLSearchParams({
                      ...(kataKunci ? { q: kataKunci } : {}),
                      ...(kategoriAktif ? { kategori: kategoriAktif } : {}),
                      ...(urutan !== "terbaru" ? { urut: urutan } : {}),
                      hal: String(halamanSaatIni + 1),
                    }).toString()}`}
                    className="rounded-xl border border-garis bg-permukaan px-3 py-1.5 text-xs font-semibold text-teks hover:border-utama hover:text-utama"
                  >
                    Selanjutnya →
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
