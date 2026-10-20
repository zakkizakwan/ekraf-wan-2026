"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { buatKoneksiSesi } from "@/lib/supabase/server";

export async function masuk(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const email = data?.get?.("email")?.toString()?.trim() || "";
  const password = data?.get?.("password")?.toString() || "";

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await buatKoneksiSesi();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.code === "invalid_credentials" || error.message === "Invalid login credentials") {
      return { error: "Email atau password salah." };
    }
    return { error: error.message || "Gagal masuk. Periksa kembali email dan password." };
  }

  redirect("/admin");
}

export async function keluar() {
  const supabase = await buatKoneksiSesi();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const passwordBaru = data?.get?.("password_baru")?.toString() || "";
  const konfirmasiPassword = data?.get?.("konfirmasi_password")?.toString() || "";

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password tidak sama." };
  }

  const supabase = await buatKoneksiSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Akses ditolak. Anda harus login terlebih dahulu." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return { error: error.message || "Gagal mengganti password." };
  }

  return { success: true, message: "Password berhasil diperbarui." };
}

export async function tambahProduk(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const nama = data?.get?.("nama")?.toString()?.trim() || "";
  const hargaRaw = data?.get?.("harga")?.toString()?.trim() || "";
  const kategori = data?.get?.("kategori")?.toString()?.trim() || "";
  const foto_url = data?.get?.("foto_url")?.toString()?.trim() || "";
  const deskripsi = data?.get?.("deskripsi")?.toString()?.trim() || "";

  const values = { nama, harga: hargaRaw, kategori, foto_url, deskripsi };
  const fieldErrors = {};

  if (!nama) {
    fieldErrors.nama = "Nama produk wajib diisi.";
  }

  const hargaNum = Number(hargaRaw);
  if (!hargaRaw || isNaN(hargaNum) || hargaNum < 0) {
    fieldErrors.harga = "Harga harus berupa angka positif.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Terdapat data yang belum sesuai. Silakan periksa formulir.",
      errors: fieldErrors,
      values,
    };
  }

  const harga = Math.floor(hargaNum);

  const supabase = await buatKoneksiSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Akses ditolak. Anda harus login terlebih dahulu.", values };
  }

  const { error: insertError } = await supabase.from("produk").insert([
    {
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    },
  ]);

  if (insertError) {
    return { error: insertError.message || "Gagal menyimpan produk.", values };
  }

  redirect("/admin");
}

export async function ubahProduk(prevStateOrFormData, maybeFormData) {
  const data = maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;
  const id = data?.get?.("id")?.toString();
  const nama = data?.get?.("nama")?.toString()?.trim() || "";
  const hargaRaw = data?.get?.("harga")?.toString()?.trim() || "";
  const kategori = data?.get?.("kategori")?.toString()?.trim() || "";
  const foto_url = data?.get?.("foto_url")?.toString()?.trim() || "";
  const deskripsi = data?.get?.("deskripsi")?.toString()?.trim() || "";

  const values = { id, nama, harga: hargaRaw, kategori, foto_url, deskripsi };
  const fieldErrors = {};

  if (!id) {
    return { error: "ID produk tidak valid.", values };
  }

  if (!nama) {
    fieldErrors.nama = "Nama produk wajib diisi.";
  }

  const hargaNum = Number(hargaRaw);
  if (!hargaRaw || isNaN(hargaNum) || hargaNum < 0) {
    fieldErrors.harga = "Harga harus berupa angka positif.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Terdapat data yang belum sesuai. Silakan periksa formulir.",
      errors: fieldErrors,
      values,
    };
  }

  const harga = Math.floor(hargaNum);

  const supabase = await buatKoneksiSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Akses ditolak. Anda harus login terlebih dahulu.", values };
  }

  const { error: updateError } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (updateError) {
    return { error: updateError.message || "Gagal mengubah produk.", values };
  }

  redirect("/admin");
}

export async function hapusProduk(formData) {
  const id = formData?.get?.("id")?.toString();

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  const supabase = await buatKoneksiSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Akses ditolak. Anda harus login terlebih dahulu." };
  }

  const { error: deleteError } = await supabase
    .from("produk")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { error: deleteError.message || "Gagal menghapus produk." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
}
