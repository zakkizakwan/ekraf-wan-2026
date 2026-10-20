import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol, action, errors = {}, values = {} }) {
  const dataForm = { ...produk, ...values };

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {dataForm?.id && <input type="hidden" name="id" value={dataForm.id} />}
      <Input
        label="Nama produk"
        name="nama"
        defaultValue={dataForm.nama}
        error={errors?.nama}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={dataForm.harga}
        error={errors?.harga}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        defaultValue={dataForm.kategori}
        error={errors?.kategori}
      />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={dataForm.foto_url}
        error={errors?.foto_url}
      />
      <Input
        label="Deskripsi"
        name="deskripsi"
        textarea
        defaultValue={dataForm.deskripsi}
        error={errors?.deskripsi}
      />
      <div className="flex gap-3">
        <Tombol type="submit">{labelTombol}</Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
