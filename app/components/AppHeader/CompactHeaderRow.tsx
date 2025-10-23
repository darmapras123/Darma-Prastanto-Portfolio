// app/components/AppHeader/CompactHeaderRow.tsx
"use client";

import React, { useEffect } from "react";
import AppHeader from "./AppHeader";
import LogoHeader from "./LogoHeader";

type Props = {
  activeSection: string;
  setActiveSection: (id: string) => void;

  isLightMode: boolean;
  triggerTransition: (toLight: boolean) => void;

  /** jarak dari atas */
  top?: number;

  /** tinggi logo (forward) */
  logoHeight?: number;

  /** abaikan; kita pakai fixed supaya benar-benar standby */
  sticky?: boolean; // tetap ada untuk kompatibilitas, tapi tidak dipakai
};

/**
 * CompactHeaderRow
 * - FIXED di viewport (standby saat scrolling).
 * - Menempatkan LogoHeader di kiri, AppHeader di kanan dalam satu baris.
 * - Menggunakan pointer-events wrapper agar elemen di bawah tetap bisa diklik.
 */
export default function CompactHeaderRow({
  activeSection,
  setActiveSection,
  isLightMode,
  triggerTransition,
  top = 16,
  logoHeight = 48,
}: Props) {
  // ✅ Tambahan: dengarkan event eksternal untuk sinkron pill (mobile-only)
  useEffect(() => {
    function onExternalSet(e: Event) {
      const ev = e as CustomEvent<{
        key: "home" | "about" | "project" | "contact" | "lanyard-section";
      }>;
      const raw = ev?.detail?.key;
      if (!raw) return;

      // peta "home" → id sebenarnya "lanyard-section"
      const mapped =
        raw === "home"
          ? ("lanyard-section" as const)
          : (raw as "lanyard-section" | "about" | "project" | "contact");

      // jalankan hanya di mobile
      if (window.matchMedia("(max-width: 767px)").matches) {
        setActiveSection(mapped);
      }
    }

    window.addEventListener("pillnav:setActive", onExternalSet);
    return () => window.removeEventListener("pillnav:setActive", onExternalSet);
  }, [setActiveSection]);

  return (
    <div
      className={[
        "fixed inset-x-0",
        "z-[1000] w-full",
        "flex justify-center",
        "pointer-events-none",
        // top via CSS var agar tidak pakai inline style
        "top-[var(--top)]",
        "[--top:16px] sm:[--top:20px]",
      ].join(" ")}
    >
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-2">
        {/* Logo di sebelah kiri */}
        <div className="logo-compact transform-gpu scale-[0.88] sm:scale-100">
          <LogoHeader height={logoHeight} isLightMode={isLightMode} />
        </div>

        {/* AppHeader versi inline (tanpa wrapper fixed) */}
        <div className="appheader-compact">
          <AppHeader
            renderInline
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isLightMode={isLightMode}
            triggerTransition={triggerTransition}
          />
        </div>
      </div>
    </div>
  );
}
