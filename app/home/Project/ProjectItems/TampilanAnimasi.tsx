// app/home/Project/ProjectItems/TampilanAnimasi.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ModalBottomSheet from "../../../components/ModalBottomSheet";
import TAMPILAN from "@/public/Project/Animasi/tampilan.png";

type Props = { onViewerOpenChange?: (open: boolean) => void };

const OVERLAY_H = 96; // h-24

export default function TampilanAnimasi({ onViewerOpenChange }: Props) {
  const [open, setOpen] = useState(false);

  // === HOVER persisten (tanpa group-hover) ===
  const [isHovering, setIsHovering] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const lastMouse = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

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

  useEffect(() => {
    onViewerOpenChange?.(open);
  }, [open, onViewerOpenChange]);

  const onPointerMoveInside = (e: React.PointerEvent<HTMLDivElement>) => {
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const hoverVisual = open || isHovering;

  return (
    <figure className="text-left">
      {/* ===== KARTU/THUMBNAIL ===== */}
      <div
        ref={wrapRef}
        className="relative inline-block rounded-xl overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => { if (!open) setIsHovering(false); }}
        onPointerMove={onPointerMoveInside}
      >
        {/* Ikon panah pojok kanan atas */}
        <svg
          aria-hidden viewBox="0 0 24 24"
          className={[
            "pointer-events-none absolute right-1.5 top-1.5 md:right-2 md:top-2 z-30 w-6 h-6 md:w-7 md:h-7",
            "[filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.65))]",
            "transition-colors duration-200 ease-out",
            hoverVisual ? "text-sky-300" : "text-white",
          ].join(" ")}
          fill="none"
        >
          <path d="M10 6H7a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
          <path d="M13 5h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M19 5l-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>

        {/* Thumbnail (klik buka modal) */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Putar pratinjau animasi"
          className="relative z-10 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 rounded-md"
        >
          <Image
            src={TAMPILAN}
            alt="Tampilan (Animasi)"
            className={[
              "h-auto w-[220px] md:w-[280px] select-none",
              "transition-transform duration-200 ease-out will-change-transform transform-gpu",
              hoverVisual ? "scale-[1.07]" : "scale-100",
            ].join(" ")}
            priority={false}
          />

          {/* PLAY overlay */}
          <span aria-hidden className="absolute inset-0 grid place-items-center">
            <span
              className={[
                "rounded-full w-12 h-12 sm:w-14 sm:h-14",
                "bg-black/70 ring-2 ring-white/70 shadow-[0_6px_18px_rgba(0,0,0,0.45)]",
                "flex items-center justify-center backdrop-blur-[1px]",
                "transition-transform transition-opacity duration-200",
                hoverVisual ? "opacity-100 scale-105" : "opacity-90 scale-100",
              ].join(" ")}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>

        {/* ===== BOX "LIHAT DETAIL" ===== */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Lihat detail animasi"
          className={[
            "absolute left-3 z-30 inline-flex items-center",
            "rounded-md px-2.5 py-1 text-[10px] sm:text-xs font-semibold",
            "border backdrop-blur-[1px]",
            hoverVisual ? "border-sky-300/80 text-sky-950" : "border-white/60 text-white/90",
            "transition-[color,border-color] duration-300 ease-out",
            "overflow-hidden",
            "before:content-[''] before:absolute before:inset-x-0 before:bottom-0",
            hoverVisual ? "before:h-full" : "before:h-0",
            "before:bg-sky-300 before:transition-[height] before:duration-300 before:ease-out",
            "bottom-[104px]",
          ].join(" ")}
        >
          <span className="relative z-10">Lihat detail</span>
        </button>

        {/* Overlay info — fixed height */}
        <figcaption
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-black/50 text-white px-3
                     h-24 flex flex-col justify-end overflow-hidden pb-2 pt-3"
        >
          <span className="block font-semibold text-[11px] sm:text-sm leading-snug">
            Tampilan (Animasi)
          </span>
          <span className="block opacity-90 text-[10px] sm:text-xs leading-tight">
            cuplikan animasi — tap untuk melihat video.
          </span>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-[2px] text-[10px] sm:text-xs font-medium bg-white/12 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.16)_inset] backdrop-blur-[1px]">
              <i className="inline-block h-2 w-2 rounded-full bg-[#9999FF]" />
              After Effects
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-[2px] text-[10px] sm:text-xs font-medium bg-white/12 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.16)_inset] backdrop-blur-[1px]">
              <i className="inline-block h-2 w-2 rounded-full bg-[#9999FF]" />
              Premiere Pro
            </span>
          </div>
        </figcaption>
      </div>

      {/* ===== MODAL ===== */}
      <ModalBottomSheet
        open={open}
        onClose={() => setOpen(false)}
        ariaLabel="Pratinjau video animasi"
        widthClassName="w-screen sm:w-[96vw]"
        maxWidthClassName="max-w-[1200px]"
        // Paksa panel modal: mobile = 50vh, desktop tetap 90vh
        maxHeightClassName="!max-h-[70vh] sm:!max-h-[90vh]"

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

        {/* Player: mobile tinggi tetap agar total modal ≈ 50vh; desktop kembali 16:9 */}
        <div className="mx-auto w-[94vw] sm:w-full sm:max-w-[960px] -translate-y-2 sm:-translate-y-3">
          <div className="relative w-full h-[58vh] sm:h-auto sm:pt-[56.25%]">
            <iframe
              className="absolute inset-0 w-full h-full rounded-xl"
              src="https://drive.google.com/file/d/1pjbsv40rO_QpZARRPN_LEXOTzpxPqRwL/preview"
              allow="autoplay; fullscreen"
              allowFullScreen
              loading="lazy"
              title="Pratinjau video animasi"
            />
          </div>
          <p className="mt-3 text-center text-xs text-white/70">Seret ke bawah untuk menutup</p>
        </div>
      </ModalBottomSheet>
    </figure>
  );
}
