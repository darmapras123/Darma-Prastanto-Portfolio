// app/components/AppHeader/LogoHeader.tsx
"use client";

import { useEffect, useState } from "react";

type LogoHeaderProps = {
  height?: number;
  headerHeightMobile?: number;   // default 32
  headerHeightDesktop?: number;  // default 44
  offsetPx?: number;             // default 10
  iconScaleMobile?: number;      // default 0.90
  iconScaleDesktop?: number;     // default 0.86
  minIconPx?: number;            // default 16

  className?: string;
  isLightMode?: boolean;
};

export default function LogoHeader({
  height,
  headerHeightMobile = 32,
  headerHeightDesktop = 44,
  offsetPx = 10,
  iconScaleMobile = 0.90,
  iconScaleDesktop = 0.86,
  minIconPx = 16,
  className,
  isLightMode,
}: LogoHeaderProps) {
  const [detectedLight, setDetectedLight] = useState(false);
  useEffect(() => {
    if (isLightMode !== undefined) return;
    const check = () =>
      setDetectedLight(!!document.querySelector('main[data-theme="light"]'));
    check();
    const main = document.querySelector("main");
    if (!main) return;
    const obs = new MutationObserver(check);
    obs.observe(main, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, [isLightMode]);

  const light = isLightMode ?? detectedLight;
  const src = light ? "/logolight.svg" : "/logo.svg";

  return (
    <div
      className={[
        "rounded-full border border-white/10 shadow-xl backdrop-blur-md",
        "flex items-center justify-center",
        light ? "bg-black/70" : "bg-white/95",
        "w-[22px] h-[22px] sm:w-[34px] sm:h-[34px]",
        className || "",
      ].join(" ")}
    >
      <img
        src={src}
        alt="Logo"
        draggable={false}
        className="block max-w-full max-h-full w-[20px] h-[20px] sm:w-[29px] sm:h-[29px]"
      />
    </div>
  );
}
