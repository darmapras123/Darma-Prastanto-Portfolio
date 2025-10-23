// app/components/Stars/StarsGlobal.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import StarsCanvas from "./StarsCanvas";

/** Deteksi tema saat ini (pakai localStorage 'darma_theme' + fallback class 'dark') */
function detectIsDark(): boolean {
  if (typeof document === "undefined") return false;
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem("darma_theme") : null;
  if (stored) return stored === "dark";
  const root = document.documentElement;
  return root.classList.contains("dark") || root.getAttribute("data-theme") === "dark";
}

/** Komponen global untuk merender StarsCanvas di semua halaman (fixed & pointer-events-none) */
export default function StarsGlobal() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const refreshTheme = useCallback(() => {
    setIsDark(detectIsDark());
  }, []);

  useEffect(() => {
    setMounted(true);
    refreshTheme();

    // Dengarkan kemungkinan event toggle tema milikmu
    const handlers: Array<[string, EventListener]> = [
      ["storage", () => refreshTheme()],                // jika ada perubahan dari tab lain
      ["themeChanged", () => refreshTheme()],           // kalau kamu mem-broadcast custom event ini
      ["mode:changed", () => refreshTheme()],           // atau pakai nama event lain
      ["activeThemeChange", () => refreshTheme()],      // varian lain yang mungkin sudah ada
    ];

    handlers.forEach(([evt, fn]) => window.addEventListener(evt, fn));
    // Juga pantau perubahan atribut pada <html> (class 'dark' / data-theme)
    const mo = new MutationObserver(refreshTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });

    return () => {
      handlers.forEach(([evt, fn]) => window.removeEventListener(evt, fn));
      mo.disconnect();
    };
  }, [refreshTheme]);

  if (!mounted || !isDark) return null;

  return (
    <div
      // Fixed agar selalu menutupi layar di semua route/section; pointer-events-none agar tidak ganggu interaksi
      className="pointer-events-none fixed inset-0 -z-10"
      // Jika kamu tidak pakai Tailwind, style inline berikut ekuivalen:
      // style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:-1 }}
    >
      <StarsCanvas />
    </div>
  );
}
