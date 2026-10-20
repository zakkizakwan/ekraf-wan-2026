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
