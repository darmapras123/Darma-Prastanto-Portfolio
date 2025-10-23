"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

type Props = {
  href?: string;
  isLightMode?: boolean;
  label?: string;
  /** true = animasi masuk saat intro (dari bawah) */
  appear?: boolean;
  delaySec?: number;
};

function toDrivePreview(u: string): string {
  const m = u.match(/https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/(view|edit)(\?[^#]*)?/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  const m2 = u.match(/https:\/\/drive\.google\.com\/uc\?id=([^&]+)/);
  if (m2) return `https://drive.google.com/file/d/${m2[1]}/preview`;
  return u;
}

export default function CVBox({
  href = "https://drive.google.com/file/d/1c6tUI9xdFZ0JYEi3jhwbFvdCr45wG7JX/view?usp=sharing",
  isLightMode = false,
  label = "Lihat CV",
  appear = false,
  delaySec = 0.0,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const effectiveHref = useMemo(() => toDrivePreview(href), [href]);

  // ✅ Mobile: full width (flex + w-full + justify-center)
  // ✅ Desktop: ukuran natural (md:inline-flex + md:w-auto)
  const containerClasses = [
    "cv-button group relative overflow-hidden font-semibold border transition-transform duration-300 select-none",
    // display & width
    "flex md:inline-flex w-full md:w-auto justify-center",
    // spacing & radius responsif
    "px-3 py-2 rounded-lg gap-1.5 text-sm",
    "md:px-4 md:py-3 md:rounded-xl md:gap-2 md:text-base",
    // elevation + tanpa focus ring
    "z-[7] focus:outline-none",
    isLightMode
      ? "text-slate-900 border-black shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
      : "text-white border-white",
  ].join(" ");

  const overlayClasses = [
    "absolute inset-0 z-0 pointer-events-none",
    isLightMode ? "bg-black" : "bg-white",
  ].join(" ");

  const contentClasses = [
    "relative z-[1] inline-flex items-center transition-colors duration-200",
    isLightMode ? "group-hover:text-white" : "group-hover:text-slate-900",
  ].join(" ");

  return (
    <motion.a
      href={effectiveHref}
      target="_blank"
      rel="noopener noreferrer"
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
    >
      {/* Overlay animasi: dari bawah ke atas saat hover */}
      <motion.span
        aria-hidden
        className={overlayClasses}
        initial={{ clipPath: "inset(100% 0% 0% 0%)", opacity: 0 }}
        animate={{
          clipPath: hovered ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
          opacity: hovered ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.8 }}
      />

      {/* Konten di atas overlay */}
      <span className={contentClasses}>
        <span className="md:hidden">
          <Download size={16} />
        </span>
        <span className="hidden md:inline">
          <Download size={18} />
        </span>
        <span className="ml-1.5 md:ml-2 leading-none">{label}</span>
      </span>
    </motion.a>
  );
}
