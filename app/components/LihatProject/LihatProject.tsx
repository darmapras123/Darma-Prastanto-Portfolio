"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";

type ProjectBoxProps = {
  href?: string;            // default: "#project"
  isLightMode?: boolean;
  label?: string;           // default: "Lihat Project"
  appear?: boolean;         // true = animasi masuk saat intro
  delaySec?: number;        // jeda animasi intro
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
  popupText?: string;
};

function isExternalLink(u: string): boolean {
  return /^(https?:)?\/\//i.test(u) || u.startsWith("mailto:") || u.startsWith("tel:");
}

// pancarkan event untuk sinkron pill (dan simpan ke localStorage)
function setActivePillToProject() {
  try {
    localStorage.setItem("darma_active_pill", "project");
  } catch {}
  window.dispatchEvent(new CustomEvent("pillnav:setActive", { detail: { key: "project" } }));
}

export default function ProjectBox({
  href = "#project",
  isLightMode = false,
  label = "Lihat Project",
  appear = false,
  delaySec = 0.0,
  align = "left",
  size = "md",
  popupText = "",
}: ProjectBoxProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // mobile-only detector (ssr safe)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const external = isExternalLink(href);
  const showPopup = (hovered || focused) && !!popupText;

  const sizePad = useMemo(() => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-xs md:px-3 md:py-2 md:text-sm";
      case "lg":
        return "px-4 py-3 text-base md:px-5 md:py-4 md:text-base";
      case "md":
      default:
        return "px-4 py-2.5 text-sm md:px-4 md:py-3 md:text-base";
    }
  }, [size]);

  // Wrapper align (tetap)
  const wrapperAlign =
    align === "left" ? "justify-start md:justify-start" : "justify-center md:justify-center";
  const wrapperClass = ["flex w-full md:w-auto", wrapperAlign].join(" ");

  // Kelas tombol diseragamkan feel-nya dengan CVBox
  const containerClasses = useMemo(
    () =>
      [
        "group relative overflow-hidden font-semibold border transition-transform duration-300 select-none",
        // Display & width: full di mobile, auto di desktop
        "flex md:inline-flex w-full md:w-auto justify-center items-center gap-1.5 md:gap-2",
        // Radius dan ukuran responsif
        "rounded-lg md:rounded-xl",
        sizePad,
        // Elevation & focus
        "z-[7] focus:outline-none",
        // Tema
        isLightMode
          ? "text-slate-900 border-black shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
          : "text-white border-white",
        // Ukuran ikon
        "[&_svg]:w-[16px] [&_svg]:h-[16px] md:[&_svg]:w-[18px] md:[&_svg]:h-[18px]",
      ].join(" "),
    [isLightMode, sizePad]
  );

  // Konten di atas overlay: warna ikut terbalik saat hover (sama seperti CVBox)
  const contentClasses = [
    "relative z-[1] inline-flex items-center transition-colors duration-200",
    isLightMode ? "group-hover:text-white" : "group-hover:text-slate-900",
  ].join(" ");

  // === CLICK HANDLER === (mobile-only: paksa pill ke Project)
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = () => {
    if (isMobile) setActivePillToProject();
    // anchor tetap jalan (scroll / buka link)
  };

  // Node anchor dengan animasi masuk, hover scale, dan overlay naik (clipPath) ala CVBox
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
      onClick={handleClick}
      title={popupText || undefined}
    >
      {/* Overlay animasi: dari bawah ke atas saat hover (match CVBox) */}
      <motion.span
        aria-hidden
        className={["absolute inset-0 z-0 pointer-events-none", isLightMode ? "bg-black" : "bg-white"].join(" ")}
        initial={{ clipPath: "inset(100% 0% 0% 0%)", opacity: 0 }}
        animate={{
          clipPath: hovered ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
          opacity: hovered ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.8 }}
      />

      {/* Konten */}
      <span className={contentClasses}>
        <span className="md:hidden">
          <FolderOpen size={16} />
        </span>
        <span className="hidden md:inline">
          <FolderOpen size={18} />
        </span>
        <span className="ml-1.5 md:ml-2 leading-none">{label}</span>
      </span>

      {/* Popup ke atas (muncul membesar) jika popupText diisi */}
      {showPopup && (
        <motion.div
          aria-hidden
          className={[
            "absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full",
            "px-2.5 py-1 rounded-md text-xs font-medium shadow-lg",
            isLightMode ? "bg-black text-white" : "bg-white text-slate-900",
            "whitespace-nowrap pointer-events-none",
          ].join(" ")}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.8 }}
        >
          {popupText}
        </motion.div>
      )}
    </motion.a>
  );

  // Internal link (#project) via Link untuk SPA mulus
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
