"use server";

import { redirect } from "next/navigation";
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
  const hargaRaw = data?.get?.("harga")?.toString() || "0";
  const harga = parseInt(hargaRaw, 10);
  const kategori = data?.get?.("kategori")?.toString()?.trim() || "";
  const foto_url = data?.get?.("foto_url")?.toString()?.trim() || "";
  const deskripsi = data?.get?.("deskripsi")?.toString()?.trim() || "";

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka positif." };
  }

  const supabase = await buatKoneksiSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Akses ditolak. Anda harus login terlebih dahulu." };
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
    return { error: insertError.message || "Gagal menyimpan produk." };
  }

  redirect("/admin");
}

export async function ubahProduk(prevStateOrFormData, maybeFormData) {
  const data = maybeFormData instanceof FormData ? maybeFormData : prevStateOrFormData;
  const id = data?.get?.("id")?.toString();
  const nama = data?.get?.("nama")?.toString()?.trim() || "";
  const hargaRaw = data?.get?.("harga")?.toString() || "0";
  const harga = parseInt(hargaRaw, 10);
  const kategori = data?.get?.("kategori")?.toString()?.trim() || "";
  const foto_url = data?.get?.("foto_url")?.toString()?.trim() || "";
  const deskripsi = data?.get?.("deskripsi")?.toString()?.trim() || "";

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka positif." };
  }

  const supabase = await buatKoneksiSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Akses ditolak. Anda harus login terlebih dahulu." };
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
    return { error: updateError.message || "Gagal mengubah produk." };
  }

  redirect("/admin");
}
