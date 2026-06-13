"use client";

import { MouseEvent } from "react";

type CertificatesBoxProps = {
  isLightMode: boolean;
  scrollTargetId?: string; // tidak dipakai
  tabId?: string;          // tidak dipakai
  syncUrlQuery?: boolean;  // tidak dipakai
  className?: string;
};

export default function CertificatesBox({
  isLightMode: _isLightMode,
  scrollTargetId: _scrollTargetId = "project",
  tabId: _tabId = "certificates",
  syncUrlQuery: _syncUrlQuery = true,
  className,
}: CertificatesBoxProps) {
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // no-op
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative overflow-hidden",
        "inline-flex items-center gap-2 rounded-xl shadow-sm",
        "px-3.5 py-2 border",
        "bg-neutral-300 hover:bg-neutral-400 active:bg-neutral-500",
        "border-neutral-400 text-neutral-900",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-600",
        "transition-colors",
        // ⬇️ jarak khusus mobile (hilang di md+)
        "mt-8 md:mt-0",
        className || "",
      ].join(" ")}
      aria-label="Certificates (non-interaktif)"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-1/2 left-[-55%] h-[220%] w-[46%] shimmer-diag shimmer-run"
      />
      <span className="font-medium">
        <span className="opacity-90">Certificates: 5</span>
      </span>

      <style jsx>{`
        .shimmer-diag {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 35%,
            rgba(255, 255, 255, 0.55) 50%,
            rgba(255, 255, 255, 0.1) 65%,
            rgba(255, 255, 255, 0) 100%
          );
        }
        .shimmer-run {
          transform: translateX(-120%) skewX(-12deg);
          animation: shimmerWithPause 16.8s linear infinite;
          will-change: transform, opacity;
        }
        @keyframes shimmerWithPause {
          0% { transform: translateX(-120%) skewX(-12deg); opacity: 0; }
          0.6% { opacity: 1; }
          10.714% { transform: translateX(220%) skewX(-12deg); opacity: 1; }
          10.815% { opacity: 0; transform: translateX(220%) skewX(-12deg); }
          100% { opacity: 0; transform: translateX(220%) skewX(-12deg); }
        }
      `}</style>
    </button>
  );
}
