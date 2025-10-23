// app/components/HubungiSaya/HubungiSaya.tsx
"use client";

import Link from "next/link";
import { useMemo, useState, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail } from "lucide-react";

export type HubungiSayaProps = {
  href?: string;                 // default "#contact"
  isLightMode?: boolean;
  label?: string;                // default "Hubungi Saya"
  appear?: boolean;              // animasi masuk
  delaySec?: number;             // jeda animasi
  align?: "left" | "center";     // posisi wrapper
  size?: "sm" | "md" | "lg";     // ukuran dasar
  popupText?: string;            // tooltip
};

function isExternalLink(u: string): boolean {
  return /^(https?:)?\/\//i.test(u) || u.startsWith("mailto:") || u.startsWith("tel:");
}

function HubungiSayaRaw({
  href = "#contact",
  isLightMode = false,
  label = "Hubungi Saya",
  appear = false,
  delaySec = 0,
  align = "left",
  size = "md",
  popupText = "",
}: HubungiSayaProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const external = isExternalLink(href);
  const showPopup = (hovered || focused) && !!popupText;

  const sizePad = useMemo(() => {
    switch (size) {
      case "sm":
        // sm tetap
        return "px-2.5 py-1.5 text-xs md:px-3 md:py-2 md:text-sm";
      case "lg":
        // lg tetap
        return "px-3.5 py-2.5 text-sm md:px-5 md:py-4 md:text-base";
      case "md":
      default:
        // ⬇️ diperkecil khusus desktop (md+)
        return "px-4 py-2.5 text-sm md:px-3.5 md:py-2.5 md:text-[15px]";
    }
  }, [size]);

  // Tombol: konsisten dengan CVBox/ProjectBox → full di mobile, auto di desktop.
  const containerClasses = useMemo(
    () =>
      [
        "cv-button group relative overflow-hidden font-semibold border transition-transform duration-300 select-none",
        // Display & lebar responsif
        "flex md:inline-flex w-full md:w-auto justify-center items-center",
        // gap & radius
        "gap-1.5 md:gap-1.5",
        "rounded-lg md:rounded-xl",
        sizePad,
        "z-[7] focus:outline-none focus:ring-2",
        isLightMode
          ? "text-slate-900 border-black focus:ring-violet-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
          : "text-white border-white focus:ring-blue-400/60",
        "[&_svg]:w-[16px] [&_svg]:h-[16px] md:[&_svg]:w-[17px] md:[&_svg]:h-[17px]",
      ].join(" "),
    [isLightMode, sizePad]
  );

  const overlayClasses = isLightMode ? "bg-black" : "bg-white";
  const contentClasses = [
    "relative z-[1] inline-flex items-center gap-2 transition-colors duration-200",
    isLightMode ? "group-hover:text-white" : "group-hover:text-slate-900",
  ].join(" ");

  const justify = align === "left" ? "justify-start" : "justify-center";

  // ✅ Wrapper tampil di mobile & desktop.
  // - Mobile: flex w-full, jarak rapat ke atas: -mt-2
  // - Desktop: inline-flex w-auto; tetap dempet dengan Lihat Project
  const wrapperClass = [
    "flex w-full items-center",          // mobile tampil
    justify,
    "-mt-2 md:mt-0",                     // rapat di mobile
    "md:inline-flex md:w-auto md:ml-1",  // sangat dempet di desktop
  ].join(" ");

  const Anchor = (
    <motion.a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={label}
      className={containerClasses}
      initial={
        appear
          ? { opacity: 0, y: 28, filter: "blur(6px)" }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.7, delay: delaySec }}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {/* Overlay animasi naik dari bawah (match CVBox/ProjectBox) */}
      <motion.span
        aria-hidden
        className={`absolute inset-0 z-0 pointer-events-none ${overlayClasses}`}
        initial={{ clipPath: "inset(100% 0% 0% 0%)", opacity: 0 }}
        animate={{
          clipPath: hovered ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
          opacity: hovered ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.8 }}
      />

      {/* Konten */}
      <span className={contentClasses}>
        <Mail aria-hidden />
        <span>{label}</span>
      </span>

      {/* Popup tooltip (optional) */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            key="hs-popup"
            className={[
              "pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full rounded-xl shadow-lg backdrop-blur border",
              "px-2.5 py-1.5 text-xs min-w-[160px] max-w-[240px]",
              "md:px-3 md:py-2 md:text-sm md:min-w-[220px] md:max-w-[320px]",
              isLightMode
                ? "bg-white/90 text-slate-900 border-black/10"
                : "bg-white/10 text-white border-white/15",
            ].join(" ")}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 28, mass: 0.7 }}
          >
            <div className="text-center leading-snug">{popupText}</div>
            <span
              aria-hidden
              className={[
                "absolute left-1/2 top-full -translate-x-1/2 h-2 w-2 rotate-45 border-l border-t",
                isLightMode ? "bg-white/90 border-black/10" : "bg-white/10 border-white/15",
              ].join(" ")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.a>
  );

  // Internal link (#contact) via Link agar SPA mulus
  if (!external) {
    return (
      <div className={wrapperClass}>
        <Link href={href} legacyBehavior>
          {Anchor}
        </Link>
      </div>
    );
  }

  // External link langsung render anchor
  return <div className={wrapperClass}>{Anchor}</div>;
}

const HubungiSaya = memo(HubungiSayaRaw);
export default HubungiSaya;
