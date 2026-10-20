import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatKoneksiServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin({ searchParams }) {
  const params = await searchParams;
  const kataKunci = (params?.q || "").trim();
  const halamanSaatIni = Math.max(1, parseInt(params?.hal || "1", 10) || 1);
  const perHalaman = 10;

  let daftarProduk = [];
  let semuaProdukRingkasan = [];
  let pesanError = null;
  let totalData = 0;
  let totalHalaman = 1;
  let produkTerlarisList = [];

  try {
    const supabase = buatKoneksiServer();

    // Ambil data untuk ringkasan dashboard (US-30)
    const { data: semuaData } = await supabase
      .from("produk")
      .select("id, kategori");
    semuaProdukRingkasan = semuaData || [];

    // Query daftar produk dengan filter pencarian dan paginasi (US-33)
    let query = supabase.from("produk").select("*", { count: "exact" });

    if (kataKunci) {
      query = query.ilike("nama", `%${kataKunci}%`);
    }

    const dari = (halamanSaatIni - 1) * perHalaman;
    const sampai = dari + perHalaman - 1;
    query = query.order("id", { ascending: true }).range(dari, sampai);

    const { data, error, count } = await query;

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
      totalData = count || 0;
      totalHalaman = Math.max(1, Math.ceil(totalData / perHalaman));
    }

    // US-41: Produk terlaris di dashboard dari pencatatan klik
    try {
      const { data: klikData } = await supabase
        .from("klik_whatsapp")
        .select("produk_id");

      if (klikData && klikData.length > 0) {
        const hitungan = {};
        for (const item of klikData) {
          hitungan[item.produk_id] = (hitungan[item.produk_id] || 0) + 1;
        }
        const topIds = Object.entries(hitungan)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        if (topIds.length > 0) {
          const ids = topIds.map(([id]) => parseInt(id, 10));
          const { data: detailTop } = await supabase
            .from("produk")
            .select("id, nama, harga")
            .in("id", ids);

          if (detailTop) {
            produkTerlarisList = topIds.map(([id, totalKlik]) => {
              const item = detailTop.find((p) => String(p.id) === String(id));
              return {
                id,
                nama: item?.nama || `Produk #${id}`,
                harga: item?.harga || 0,
                totalKlik,
              };
            });
          }
        }
      }
    } catch {
      // Abaikan jika tabel klik_whatsapp belum ada
    }
  } catch (err) {
    pesanError = err.message || "Gagal mengambil data produk dari database.";
  }

  // US-30: Ringkasan total produk dan per kategori
  const totalProduk = semuaProdukRingkasan.length;
  const jumlahPerKategori = semuaProdukRingkasan.reduce((acc, produk) => {
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

      {/* US-41: 5 Produk Terlaris (Klik Pesan Terbanyak) */}
      <section className="flex flex-col gap-3 rounded-2xl border border-garis bg-permukaan p-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-teks-lembut">
          Top 5 Produk Paling Sering Dipesan (WhatsApp)
        </h2>
        {produkTerlarisList.length === 0 ? (
          <p className="text-xs text-teks-lembut py-2">
            Belum ada data pemesanan WhatsApp yang tercatat.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {produkTerlarisList.map((item, idx) => (
              <div key={item.id} className="rounded-xl border border-garis bg-latar p-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-utama">#{idx + 1}</span>
                  <p className="text-sm font-semibold text-teks line-clamp-1">{item.nama}</p>
                </div>
                <p className="mt-2 text-xs font-medium text-teks-lembut">
                  <span className="font-bold text-teks">{item.totalKlik}</span> klik pesan
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Header Bar Daftar Produk & Tombol Aksi */}
      <div className="flex flex-col gap-4 border-t border-garis pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Daftar Produk</h1>
          <p className="text-xs text-teks-lembut mt-0.5">
            Total {totalData} produk ditemukan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* US-33: Form Pencarian Admin */}
          <form method="GET" action="/admin" className="flex items-center gap-2">
            <input
              type="search"
              name="q"
              defaultValue={kataKunci}
              placeholder="Cari produk..."
              className="w-48 sm:w-56 rounded-xl border border-garis bg-permukaan px-3 py-1.5 text-sm placeholder:text-teks-lembut focus:bg-latar focus:outline-none focus:ring-2 focus:ring-utama"
            />
            <button
              type="submit"
              className="rounded-xl bg-utama px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-utama-gelap"
            >
              Cari
            </button>
          </form>

          {/* US-35: Ekspor produk ke CSV */}
          <a
            href="/admin/produk/ekspor"
            download
            className="rounded-xl border border-garis bg-permukaan px-3.5 py-1.5 text-xs font-semibold text-teks hover:border-utama hover:text-utama"
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
        <div className="py-12 text-center">
          <p className="text-sm font-medium text-teks-lembut">
            {kataKunci ? "Tidak ada produk yang cocok dengan pencarian." : "Belum ada produk"}
          </p>
          {kataKunci && (
            <a href="/admin" className="mt-2 inline-block text-xs font-semibold text-utama underline underline-offset-4">
              Reset pencarian
            </a>
          )}
        </div>
      ) : (
        <>
          <TabelProduk daftarProduk={daftarProduk} />

          {/* US-33: Kontrol Paginasi List Admin */}
          {totalHalaman > 1 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-garis pt-4 text-xs">
              <span className="text-teks-lembut">
                Halaman {halamanSaatIni} dari {totalHalaman}
              </span>

              <div className="flex items-center gap-2">
                {halamanSaatIni > 1 && (
                  <a
                    href={`/admin?${new URLSearchParams({
                      ...(kataKunci ? { q: kataKunci } : {}),
                      hal: String(halamanSaatIni - 1),
                    }).toString()}`}
                    className="rounded-lg border border-garis bg-permukaan px-3 py-1.5 font-semibold text-teks hover:border-utama hover:text-utama"
                  >
                    ← Sebelumnya
                  </a>
                )}
                {halamanSaatIni < totalHalaman && (
                  <a
                    href={`/admin?${new URLSearchParams({
                      ...(kataKunci ? { q: kataKunci } : {}),
                      hal: String(halamanSaatIni + 1),
                    }).toString()}`}
                    className="rounded-lg border border-garis bg-permukaan px-3 py-1.5 font-semibold text-teks hover:border-utama hover:text-utama"
                  >
                    Selanjutnya →
                  </a>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
