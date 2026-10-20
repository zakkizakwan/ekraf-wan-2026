import { buatKoneksiServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const baseUrl = "https://ekraf-wan-2026-wakaranai31s-projects.vercel.app";

  let ruteProduk = [];
  try {
    const supabase = buatKoneksiServer();
    const { data: daftarProduk } = await supabase
      .from("produk")
      .select("id, created_at");

    if (daftarProduk) {
      ruteProduk = daftarProduk.map((p) => ({
        url: `${baseUrl}/produk/${p.id}`,
        lastModified: p.created_at ? new Date(p.created_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("Gagal membuat rute sitemap:", err);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...ruteProduk,
  ];
}
