import { createClient } from "@supabase/supabase-js";

function bersihkanUrl(url) {
  if (!url) return "";
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

/**
 * Koneksi Supabase untuk server (bypass RLS dengan SUPABASE_SECRET_KEY).
 * Dipakai untuk membaca data publik seperti katalog dan detail produk.
 */
export function buatKoneksiServer() {
  const supabaseUrl = bersihkanUrl(process.env.SUPABASE_URL);
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
