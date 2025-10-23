// app/home/Project/ProjectItems/Batik.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ModalBottomSheet from "../../../components/ModalBottomSheet";

// Pastikan path sesuai struktur kamu
import BATIK from "@/public/Project/logo Brand/Batik.png";
import MODAL_BATIK from "@/public/Project/logo Brand/Modal_batik.png";

type Props = { onViewerOpenChange?: (open: boolean) => void };

export default function Batik({ onViewerOpenChange }: Props) {
  const [open, setOpen] = useState(false);

  // === HOVER persisten (tetap aktif saat modal terbuka) ===
  const [isHovering, setIsHovering] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const lastMouse = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  // Lacak posisi kursor (untuk cek setelah modal ditutup)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Saat modal ditutup, hanya kembalikan normal kalau mouse sudah benar2 keluar
  useEffect(() => {
    if (!open) {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const { x, y } = lastMouse.current;
      const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      if (!inside) setIsHovering(false);
    }
  }, [open]);

  // Notifikasi parent (opsional)
  useEffect(() => {
    onViewerOpenChange?.(open);
  }, [open, onViewerOpenChange]);

  return (
    <figure className="text-left">
      <div
        ref={wrapRef}
        className="relative inline-block rounded-xl overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          // Jangan matikan hover kalau modal masih terbuka
          if (!open) setIsHovering(false);
        }}
      >
        {/* Ikon panah (pojok kanan atas) */}
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

        {/* Thumbnail sebagai tombol */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka pratinjau Batik"
          className="relative z-10 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 rounded-md"
        >
          <Image
            src={BATIK}
            alt="Batik"
            className={[
              "h-auto w-[220px] md:w-[280px] select-none",
              "transition-transform duration-200 ease-out will-change-transform transform-gpu origin-bottom",
              isHovering ? "scale-[1.07]" : "scale-100",
            ].join(" ")}
            priority={false}
          />
        </button>

        {/* Tombol LIHAT DETAIL — default border putih tipis; animasi fill biru naik dari bawah */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Lihat detail Batik"
          className={[
            "absolute left-3 bottom-[104px] z-20 inline-flex items-center", // 96 (h-24) + 8
            "rounded-md px-2.5 py-1 text-[10px] sm:text-xs font-semibold",
            "border backdrop-blur-[1px] transition-[color,border-color] duration-300 ease-out",
            "overflow-hidden",
            // default: border putih tipis
            "border-white/40",
            // hover: border biru muda (teks di-handle di span supaya pasti override)
            isHovering ? "border-sky-300/80" : "",
          ].join(" ")}
        >
          {/* Fill biru naik dari bawah */}
          <span
            aria-hidden
            className={[
              "absolute inset-x-0 bottom-0 bg-sky-300 z-0",
              "transition-[height] duration-300 ease-out",
              isHovering ? "h-full" : "h-0",
            ].join(" ")}
          />
          {/* ⬇️ Warna teks dipindah ke span ini agar pasti berubah ke hitam saat hover */}
          <span
            className={[
              "relative z-10",
              "transition-colors duration-200",
              isHovering ? "text-black" : "text-white/90",
            ].join(" ")}
          >
            Lihat detail
          </span>

          {/* (opsional) underline putih tipis yang tetap ada */}
          <span className="relative z-10 block absolute left-2.5 right-2.5 -bottom-[3px] h-px bg-white/40 pointer-events-none" />
        </button>

        {/* Overlay info — fixed height + badges */}
        <figcaption
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-black/50 text-white px-3
                     h-24 flex flex-col justify-end overflow-hidden pb-2 pt-3"
        >
          <span className="block font-semibold text-[11px] sm:text-sm leading-snug">
            Batik
          </span>
          <span className="block opacity-90 text-[10px] sm:text-xs leading-tight">
            logo/brand bertema batik.
          </span>

          {/* OVAL badges: Illustrator & Photoshop */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-[2px] text-[10px] sm:text-xs font-medium bg-white/12 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.16)_inset] backdrop-blur-[1px]">
              <i className="inline-block h-2 w-2 rounded-full bg-[#FF9A00]" />
              Illustrator
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-[2px] text-[10px] sm:text-xs font-medium bg-white/12 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.16)_inset] backdrop-blur-[1px]">
              <i className="inline-block h-2 w-2 rounded-full bg-[#31A8FF]" />
              Photoshop
            </span>
          </div>
        </figcaption>
      </div>

      {/* Modal — mobile full width, PNG kecil & center */}
      <ModalBottomSheet
        open={open}
        onClose={() => setOpen(false)}
        ariaLabel="Pratinjau Batik"
        widthClassName="w-screen sm:w-[92vw]"
        maxWidthClassName="max-w-[900px]"
        maxHeightClassName="max-h-[80vh]"
      >
        {/* Tombol X merah (desktop only) */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Tutup"
          className="
            hidden md:inline-flex items-center justify-center
            absolute top-2 right-2 w-8 h-8 rounded-md
            bg-red-600 text-white ring-1 ring-red-400/60
            shadow-[0_6px_18px_rgba(0,0,0,0.35)]
            hover:bg-red-500 active:bg-red-600
            focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300
            z-20
          "
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
            <path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 0 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z"/>
          </svg>
        </button>

        <div className="mx-auto w-full max-w-[210px] sm:max-w-[320px] md:max-w-[320px]">
          <Image
            src={MODAL_BATIK}
            alt="Batik (Modal)"
            className="w-full h-auto select-none rounded-xl"
            sizes="(min-width: 768px) 320px, (min-width: 640px) 320px, 210px"
            priority
          />
          <p className="mt-3 text-center text-xs text-white/70">Seret ke bawah untuk menutup</p>
        </div>
      </ModalBottomSheet>
    </figure>
  );
}
