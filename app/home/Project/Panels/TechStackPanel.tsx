// app/home/Project/Panels/TechStackPanel.tsx
"use client";

import Image from "next/image";

type Props = { isLightMode: boolean };

// util kelas agar rapi
const boxClass = (isLight: boolean) =>
  [
    "group inline-flex items-center justify-center",
    "rounded-xl border overflow-hidden",
    "p-2 sm:p-3",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60",
    isLight ? "border-black/15 bg-black/5" : "border-white/20 bg-white/5 backdrop-blur-sm",
  ].join(" ");

const iconClass =
  [
    "w-12 h-12 sm:w-14 sm:h-14 object-contain",
    "transition-transform duration-200 ease-out transform-gpu will-change-transform",
    "group-hover:scale-110 group-focus-visible:scale-110",
    "motion-reduce:transition-none motion-reduce:transform-none",
  ].join(" ");

export default function TechStackPanel({ isLightMode }: Props) {
  return (
    <div className="w-full flex items-center justify-center">
      {/* deretan ikon; wrap di layar kecil */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
        {/* After Effects (Ae) */}
        <button type="button" aria-label="Adobe After Effects" className={boxClass(isLightMode)}>
          <Image
            src="/Project/Icon/Ae.png"   // public/Project/Icon/Ae.png
            alt="Adobe After Effects"
            width={56}
            height={56}
            className={iconClass}
          />
        </button>

        {/* Illustrator (Ai) */}
        <button type="button" aria-label="Adobe Illustrator" className={boxClass(isLightMode)}>
          <Image
            src="/Project/Icon/Ai.png"   // public/Project/Icon/Ai.png
            alt="Adobe Illustrator"
            width={56}
            height={56}
            className={iconClass}
          />
        </button>

        {/* Photoshop (Ps) */}
        <button type="button" aria-label="Adobe Photoshop" className={boxClass(isLightMode)}>
          <Image
            src="/Project/Icon/Ps.png"   // public/Project/Icon/Ps.png
            alt="Adobe Photoshop"
            width={56}
            height={56}
            className={iconClass}
          />
        </button>

        {/* CorelDRAW (Cd) */}
        <button type="button" aria-label="CorelDRAW" className={boxClass(isLightMode)}>
          <Image
            src="/Project/Icon/Cd.png"   // public/Project/Icon/Cd.png
            alt="CorelDRAW"
            width={56}
            height={56}
            className={iconClass}
          />
        </button>

        {/* Figma (Fg) */}
        <button type="button" aria-label="Figma" className={boxClass(isLightMode)}>
          <Image
            src="/Project/Icon/Fg.png"   // public/Project/Icon/Fg.png
            alt="Figma"
            width={56}
            height={56}
            className={iconClass}
          />
        </button>
      </div>
    </div>
  );
}
