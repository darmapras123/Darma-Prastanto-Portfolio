// app/home/Project/ProjectItems/CertificateDOT.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ModalBottomSheet from "../../../components/ModalBottomSheet";

type Props = { onViewerOpenChange?: (open: boolean) => void };

const OVERLAY_H = 96;        // h-24
const BUTTON_BOTTOM = 104;   // OVERLAY_H + 8

export default function CertificateDOT({ onViewerOpenChange }: Props) {
  const [open, setOpen] = useState(false);

  // Hover persisten (aktif saat modal terbuka)
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

  // Saat modal ditutup, matikan hover jika pointer di luar elemen
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

  const hovering = open || isHovering;

  return (
    <figure className="text-left">
      <div
        ref={wrapRef}
        className="relative inline-block rounded-xl overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => { if (!open) setIsHovering(false); }}
      >
        {/* Ikon panah kanan-atas */}
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={[
            "pointer-events-none absolute right-1.5 top-1.5 md:right-2 md:top-2 z-30 w-6 h-6 md:w-7 md:h-7",
            "[filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.65))]",
            "transition-colors duration-200 ease-out",
            hovering ? "text-sky-300" : "text-white",
          ].join(" ")}
          fill="none"
        >
          <path d="M10 6H7a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
          <path d="M13 5h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M19 5l-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>

        {/* Thumbnail — DOT2.png */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka pratinjau sertifikat DOT"
          className="relative z-10 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 rounded-md"
        >
          <Image
            src="/certificates/DOT2.png"
            alt="DOT Certificate (thumbnail)"
            className={[
              "h-auto w-[280px] md:w-[360px] select-none",
              "transition-transform duration-200 ease-out will-change-transform transform-gpu origin-bottom",
              hovering ? "scale-[1.07]" : "scale-100",
            ].join(" ")}
            width={360}
            height={255}
            priority={false}
          />
        </button>

        {/* Tombol LIHAT DETAIL — border, garis, dan TEKS hitam */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Lihat detail sertifikat DOT"
          className={[
            "absolute left-3 z-20 inline-flex items-center",
            "rounded-md px-2.5 py-1 text-[10px] sm:text-xs font-semibold",
            "border backdrop-blur-[1px] transition-[color,border-color] duration-300 ease-out",
            "overflow-hidden",
            "border-black/50",
            hovering ? "border-sky-300/80" : "",
            "bottom-[104px]",
          ].join(" ")}
        >
          <span
            aria-hidden
            className={[
              "absolute inset-x-0 bottom-0 bg-sky-300 z-0",
              "transition-[height] duration-300 ease-out",
              hovering ? "h-full" : "h-0",
            ].join(" ")}
          />
          <span
            className={[
              "relative z-10",
              "transition-colors duration-200",
              "text-black",
            ].join(" ")}
          >
            Lihat detail
          </span>
          <span className="relative z-10 block absolute left-2.5 right-2.5 -bottom-[3px] h-px bg-black/60 pointer-events-none" />
        </button>

        {/* Overlay info (thumbnail) */}
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-black/50 text-white px-3 h-24 flex flex-col justify-end overflow-hidden pb-2 pt-3">
          <span className="block font-semibold text-[11px] sm:text-sm leading-snug">
            Microsoft Office - DOT
          </span>
          <div className="mt-0.5 flex items-center justify-between">
            <span className="block opacity-90 text-[10px] sm:text-xs leading-tight">
              Trust Training Partner
            </span>
            <span className="ml-2 inline-flex items-center rounded-full px-2 py-[2px] text-[10px] sm:text-xs font-medium bg-white/12 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.16)_inset] backdrop-blur-[1px]">
              Feb, 2024
            </span>
          </div>
        </figcaption>
      </div>

      {/* ===== Modal — DOT.png (panel abu-abu dipersempit) ===== */}
      <ModalBottomSheet
        open={open}
        onClose={() => setOpen(false)}
        ariaLabel="Pratinjau sertifikat DOT"
        widthClassName="w-[96vw] sm:w-[84vw]"   // dipersempit
        maxWidthClassName="max-w-[1100px]"      // dipersempit
        maxHeightClassName="max-h-[90vh]"
      >
        {/* Tombol X (desktop) */}
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
            <path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 0 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l-4.9-4.9a1 1 0 0 0 0-1.4z"/>
          </svg>
        </button>

        {/* === Wrapper penuh modal (relative) + header info pojok kiri atas === */}
        <div className="relative w-full">
          {/* Header info (tanpa box; hanya tanggal oval) */}
          <div className="absolute left-4 top-4 sm:left-6 sm:top-5 z-20 text-white">
            <p className="text-sm sm:text-base font-semibold leading-tight">
              Applied Microsoft Office – Trust Training Partners
            </p>

            {/* Baris: Univ + oval "Feb 2024" di sampingnya */}
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-xs sm:text-sm opacity-90 leading-tight">
                Univ Amikom Purwokerto
              </span>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] sm:text-xs font-medium bg-white/10 text-white border border-white/20 backdrop-blur">
                Feb 2024
              </span>
            </div>

            {/* ⬇️ Button Download (biru kehitaman + shimmer tebal) */}
            <div className="mt-2">
              <a
                href="/certificates/DOT.png"
                download="DOT.png"
                className={[
                  "relative overflow-hidden inline-flex items-center gap-2",
                  "px-3 py-1.5 rounded-md border",
                  // === Biru kehitaman, tidak terlalu gelap ===
                  "bg-[#1f2a3a] hover:bg-[#243048] active:bg-[#1b2436]",
                  "border-[#2a3950] text-white",
                  "shadow transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                ].join(" ")}
              >
                {/* SHIMMER DIAGONAL — diperlebar & diperkuat */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-1/2 left-[-60%] h-[230%] w-[60%] shimmer-diag shimmer-run"
                />
                {/* Ikon download */}
                <svg aria-hidden viewBox="0 0 24 24" className="w-4 h-4 relative z-10" fill="currentColor">
                  <path d="M12 3a1 1 0 011 1v8.586l2.293-2.293a1 1 0 111.414 1.414l-4.007 4.007a1.5 1.5 0 01-2.121 0L6.572 11.707a1 1 0 111.414-1.414L10.28 12.99V4a1 1 0 011-1z" />
                  <path d="M5 17a1 1 0 011-1h12a1 1 0 011 1v2.5A2.5 2.5 0 0116.5 22h-9A2.5 2.5 0 015 19.5V17z" />
                </svg>
                <span className="relative z-10">Download</span>
              </a>
            </div>
          </div>

          {/* Konten gambar: diberi padding-top agar tidak tertimpa header */}
          <div className="mx-auto w-[90vw] sm:w-full sm:max-w-[560px] md:max-w-[680px] lg:max-w-[760px] pt-[92px] sm:pt-[100px]">
            <Image
              src="/certificates/DOT.png"
              alt="DOT Certificate"
              className="w-full h-auto max-h-[80vh] object-contain select-none rounded-xl"
              width={760}
              height={538}
              priority
              sizes="(min-width: 1024px) 760px, (min-width: 768px) 680px, (min-width: 640px) 560px, 90vw"
            />
            <p className="mt-3 text-center text-xs text-white/70">Seret ke bawah untuk menutup</p>
          </div>
        </div>
      </ModalBottomSheet>

      {/* ==== CSS lokal untuk shimmer download button ==== */}
      <style jsx>{`
        .shimmer-diag {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.28) 32%,
            rgba(255, 255, 255, 0.78) 50%,
            rgba(255, 255, 255, 0.28) 68%,
            rgba(255, 255, 255, 0) 100%
          );
          filter: blur(0.2px);
          transform: translateX(-120%) skewX(-18deg);
          border-radius: 12px;
        }
        .shimmer-run {
          animation: shimmerDiagFull 1.8s linear infinite;
          will-change: transform, opacity;
        }
        /* Bergerak miring kiri→kanan sampai mentok penuh */
        @keyframes shimmerDiagFull {
          0%   { transform: translateX(-120%) skewX(-18deg); opacity: 0.0; }
          8%   { opacity: 1; }
          100% { transform: translateX(220%)  skewX(-18deg); opacity: 1; }
        }
      `}</style>
    </figure>
  );
}
