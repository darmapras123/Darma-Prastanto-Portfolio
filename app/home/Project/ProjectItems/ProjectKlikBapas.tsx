"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  siteUrl?: string; 
  // ✅ PERBAIKAN TypeScript: Mendaftarkan isLightMode agar tidak eror di ProjectsPanel.tsx
  isLightMode?: boolean; 
  onViewerOpenChange?: (open: boolean) => void;
};

export default function ProjectKlikBapas({ 
  siteUrl = "https://klikbapas.com",
  isLightMode, // status tema dioper di sini
  onViewerOpenChange
}: Props) {
  
  // === HOVER MANAGEMENT (Sama persis seperti logika presisi PangPang) ===
  const [isHovering, setIsHovering] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const lastMouse = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  // Lacak posisi kursor mouse secara real-time
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Fungsi navigasi aman ke tab baru saat thumbnail atau tombol diklik
  const handleOpenSite = () => {
    window.open(siteUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <figure className="text-left">
      {/* Wrapper utama dengan handler hover */}
      <div
        ref={wrapRef}
        className="relative inline-block rounded-xl overflow-hidden cursor-pointer group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleOpenSite}
      >
        {/* Ikon Eksternal Link (Berubah warna jadi biru langit saat hover) */}
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={[
            "pointer-events-none absolute right-1.5 top-1.5 md:right-2 md:top-2 z-30 w-6 h-6 md:w-7 md:h-7",
            "[filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.65))]",
            "transition-colors duration-200 ease-out",
            isHovering ? "text-sky-300" : "text-white",
          ].join(" ")}
          fill="none"
        >
          <path d="M10 6H7a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
          <path d="M13 5h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M19 5l-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>

        {/* Thumbnail Website Klik Bapas sebagai Tombol Klik */}
        <button
          type="button"
          aria-label="Buka website Klik Bapas di tab baru"
          className="relative z-10 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 rounded-md bg-transparent border-none p-0 cursor-pointer"
        >
          <Image
            // ✅ PERBAIKAN LOKASI GAMBAR: Sekarang mengarah ke /public/Project/klikBapas/thumbnail.png
            src="/Project/klikBapas/thumbnail.png" 
            alt="Website Klik BAPAS"
            width={280}
            height={180}
            priority
            className={[
              "h-auto w-[220px] md:w-[280px] select-none rounded-xl", // menambahkan rounded-xl agar thumbnailnya rapi
              "transition-transform duration-200 ease-out will-change-transform transform-gpu origin-bottom",
              isHovering ? "scale-[1.07]" : "scale-100",
            ].join(" ")}
          />
        </button>

        {/* Tombol LIHAT WEBSITE — Mengikuti struktur animasi span PangPang */}
        <div
          className={[
            "absolute left-3 z-20 inline-flex items-center",
            "rounded-md px-2.5 py-1 text-[10px] sm:text-xs font-semibold",
            "border backdrop-blur-[1px] transition-[color,border-color] duration-300 ease-out",
            "overflow-hidden bottom-[104px]",
            "border-white/40",
            isHovering ? "border-sky-300/80" : "",
          ].join(" ")}
        >
          {/* Efek Warna Biru Langit Naik dari Bawah */}
          <span
            aria-hidden
            className={[
              "absolute inset-x-0 bottom-0 bg-sky-300 z-0",
              "transition-[height] duration-300 ease-out",
              isHovering ? "h-full" : "h-0",
            ].join(" ")}
          />
          {/* Teks Tombol: Berubah hitam saat disorot */}
          <span
            className={[
              "relative z-10",
              "transition-colors duration-200",
              isHovering ? "text-black" : "text-white/90",
            ].join(" ")}
          >
            Lihat website
          </span>

          {/* Garis bawah dekoratif tipis */}
          <span className="absolute left-2.5 right-2.5 -bottom-[3px] h-px bg-white/40 pointer-events-none z-10" />
        </div>

        {/* Overlay Info Deskripsi Proyek Instansi Klik Bapas */}
        <figcaption
          className="
            absolute inset-x-0 bottom-0 z-10
            bg-black/65 text-white px-3
            h-24 flex flex-col justify-end overflow-hidden pb-2 pt-2
          "
        >
          <span className="block font-semibold text-[11px] sm:text-sm leading-snug">
            Klik BAPAS
          </span>
          <span className="block opacity-90 text-[10px] sm:text-xs leading-tight">
            Kanal layanan Informasi Klien terintegrasi untuk Balai Pemasyarakatan.
          </span>

          {/* Badge Teknologi Website */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-[2px] text-[10px] sm:text-xs font-medium bg-white/12 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.16)_inset] backdrop-blur-[1px]">
              <i className="inline-block h-2 w-2 rounded-full bg-[#f43f5e]" />
              Laravel
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-[2px] text-[10px] sm:text-xs font-medium bg-white/12 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.16)_inset] backdrop-blur-[1px]">
              <i className="inline-block h-2 w-2 rounded-full bg-[#06b6d4]" />
              Tailwind CSS
            </span>
          </div>
        </figcaption>
      </div>
    </figure>
  );
}