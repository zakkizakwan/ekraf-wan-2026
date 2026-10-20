# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-02 Detail produk

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-03 Pesan via WhatsApp

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

### US-07 List Produk Admin
- **Fitur:** Menampilkan seluruh daftar produk dari Supabase di `/admin`.
- **Hasil:** Berhasil menampilkan produk beserta foto, harga, dan kategori.

### US-08 Tambah Produk Baru
- **Fitur:** Form tambah produk admin dengan proteksi otentikasi server.
- **Hasil:** Produk baru berhasil ditambahkan dan langsung muncul di list admin serta katalog.

### US-09 Ubah Data Produk
- **Fitur:** Edit data produk yang sudah ada di `/admin/produk/[id]/ubah`.
- **Hasil:** Form terisi data awal dan perubahan tersimpan ke Supabase.

### US-10 Hapus Produk
- **Fitur:** Hapus produk dengan dialog konfirmasi `window.confirm` dan server action.
- **Hasil:** Produk berhasil dihapus dari tabel produk di database.

### US-11 Filter Kategori dan Pencarian Produk
- **Fitur:** Pencarian nama produk dengan `ilike` dan filter kategori dinamis di beranda katalog.
- **Hasil:** Pengunjung dapat mencari nama produk serta menyaring berdasarkan kategori produk secara langsung di sisi server.

### US-12 Pilih Jumlah atau Varian
- **Fitur:** Pilihan jumlah (quantity counter) dan catatan varian di halaman detail produk.
- **Hasil:** Pengunjung dapat memilih jumlah pesanan dan varian/catatan, yang otomatis terhitung total harga dan tercantum di teks pesan WhatsApp.

### US-13 PWA (Progressive Web App)
- **Fitur:** Web app manifest dinamis di `app/manifest.js` yang merujuk ikon `public/icons/icon-192.png` & `public/icons/icon-512.png`.
- **Hasil:** Aplikasi dapat di-install ke layar utama HP/desktop sebagai Progressive Web App dengan rute `/manifest.webmanifest`.

### US-15 Urutkan Produk
- **Fitur:** Pilihan urutan produk (Termurah, Termahal, Terbaru) dengan dropdown di katalog.
- **Hasil:** Pengurutan diterapkan langsung pada query database Supabase (`order('harga', { ascending })`).

### US-16 Paginasi Produk
- **Fitur:** Memecah produk per halaman dengan `.range(dari, sampai)` dan `count: "exact"` di Supabase (6 produk per halaman).
- **Hasil:** Menampilkan navigasi tombol Sebelumnya, nomor halaman, dan Selanjutnya dengan mempertahankan status filter & pencarian di URL.

### US-17 Produk Terkait di Halaman Detail
- **Fitur:** Menampilkan produk dari kategori yang sama di halaman detail produk dari database (mengecualikan produk yang sedang aktif).
- **Hasil:** Bagian "Produk terkait" otomatis muncul di bawah detail produk menggunakan komponen `KartuProduk`.

### US-22 Halaman Tentang dan Kontak Toko
- **Fitur:** Membuat halaman profil `/tentang` berisi deskripsi usaha, alamat, jam operasional, dan tombol kontak WhatsApp, serta menautkannya di Header & Footer.
- **Hasil:** Halaman `/tentang` dapat diakses dari navigasi atas maupun footer dengan informasi identitas toko yang lengkap.

### US-23 Bagikan atau Salin Link Produk
- **Fitur:** Tombol bagikan produk di halaman detail menggunakan Web Share API dan Clipboard API.
- **Hasil:** Pengunjung dapat membagikan produk atau menyalin link produk dengan umpan balik visual "Link tersalin ke clipboard!".

### US-26 Metadata SEO dan Open Graph
- **Fitur:** Implementasi `generateMetadata` dinamis di `app/produk/[id]/page.jsx` untuk judul, deskripsi, serta Open Graph meta tags (og:title, og:description, og:image).
- **Hasil:** Setiap halaman detail produk memiliki metadata SEO dan preview kartu Open Graph yang sesuai dengan data produk dari database.

### US-27 sitemap.xml dan robots.txt
- **Fitur:** Membuat `app/sitemap.js` yang menarik seluruh URL produk dari database Supabase secara dinamis, dan `app/robots.js` yang valid mengarah ke sitemap serta memblokir perayapan bot ke rute `/admin/`.
- **Hasil:** Rute `/sitemap.xml` dan `/robots.txt` aktif secara otomatis dan valid.

### US-28 Halaman 404 dan Loading Kustom
- **Fitur:** Halaman 404 kustom di `app/not-found.jsx` dengan link kembali ke katalog, serta implementasi `loading.jsx` skeleton animasi di katalog utama dan halaman detail produk.
- **Hasil:** Pengalaman pengguna saat menunggu pengambilan data server menjadi mulus dengan skeleton loading responsif.

### US-30 Dashboard Ringkasan Admin
- **Fitur:** Menampilkan kartu ringkasan total jumlah produk dan jumlah produk per kategori di dashboard `/admin` langsung dari data database Supabase.
- **Hasil:** Admin dapat melihat statistik katalog produk sekilas setelah login dengan proteksi rute `proxy.js`.

### US-35 Ekspor Produk ke CSV
- **Fitur:** Endpoint Route Handler `/admin/produk/ekspor` di server yang memeriksa otentikasi login admin, meng-escape karakter khusus koma/kutip, dan mengunduh seluruh produk dalam format `.csv`.
- **Hasil:** Tombol "Ekspor CSV" di halaman admin dapat mengunduh data katalog produk yang siap dibuka di Microsoft Excel atau Google Sheets.

### US-36 Terakhir Dilihat
- **Fitur:** Menyimpan riwayat produk yang dibuka di `localStorage` browser (maksimal 4 item) melalui tracker di halaman detail, serta menampilkan bagian "Terakhir dilihat" di beranda jika ada data riwayat.
- **Hasil:** Pengunjung dapat melihat kembali produk-produk yang baru saja dibuka dengan cepat langsung di beranda katalog.
