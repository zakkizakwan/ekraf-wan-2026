"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "chat-theme";

export default function TombolTema() {
  const [tema, setTema] = useState("light");
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      const initial =
        saved === "dark" ||
        (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
          ? "dark"
          : "light";

      setTema(initial);
      document.documentElement.setAttribute("data-theme", initial);
      if (initial === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      setTema("light");
    } finally {
      setSiap(true);
    }
  }, []);

  const toggleTema = () => {
    const baru = tema === "dark" ? "light" : "dark";
    setTema(baru);
    try {
      localStorage.setItem(THEME_KEY, baru);
    } catch {}
    document.documentElement.setAttribute("data-theme", baru);
    if (baru === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!siap) {
    return <div className="h-8 w-8" />;
  }

  return (
    <button
      type="button"
      onClick={toggleTema}
      aria-label={`Ganti ke mode ${tema === "dark" ? "terang" : "gelap"}`}
      title={`Ganti ke mode ${tema === "dark" ? "terang" : "gelap"}`}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-garis bg-permukaan text-sm transition-colors hover:border-utama hover:text-utama"
    >
      {tema === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
