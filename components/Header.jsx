import Link from "next/link";
import { toko } from "@/lib/toko";

export default function Header() {
  return (
    <header className="border-b border-garis bg-latar">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-utama">
          {toko.nama}
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold text-teks-lembut">
          <Link href="/" className="hover:text-utama">
            Katalog
          </Link>
          <Link href="/tentang" className="hover:text-utama">
            Tentang
          </Link>
        </nav>
      </div>
    </header>
  );
}
