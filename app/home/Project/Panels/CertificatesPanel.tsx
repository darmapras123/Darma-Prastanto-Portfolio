"use client";

import { Award } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MouseEvent, useCallback } from "react";

type CertificatesBoxProps = {
  isLightMode: boolean;
  /** id section tempat BottomBar berada (agar di-scroll dulu) */
  scrollTargetId?: string; // default "project"
  /** id tab yang mau dipilih di BottomBar */
  tabId?: string;          // default "certificates"
  /** juga update URL (?tab=...) agar persist saat refresh */
  syncUrlQuery?: boolean;  // default true
  className?: string;
};

export default function CertificatesBox({
  isLightMode,
  scrollTargetId = "project",
  tabId = "certificates",
  syncUrlQuery = true,
  className,
}: CertificatesBoxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectBottomBarTab = useCallback(() => {
    // 1) broadcast ke BottomBar
    window.dispatchEvent(
      new CustomEvent("bottombar:select", { detail: { tab: tabId } })
    );
    // 2) simpan preferensi terakhir (opsional, untuk initial mount)
    try {
      localStorage.setItem("bottombar:last-tab", tabId);
    } catch {}
  }, [tabId]);

  const scrollToBottomBar = useCallback(() => {
    const target = document.getElementById(scrollTargetId);
    if (target) {
      // scroll dulu ke area di mana BottomBar/tabs berada
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // sekaligus set hash agar URL menunjukkan section yang relevan
    try {
      const url = new URL(window.location.href);
      url.hash = scrollTargetId;
      window.history.replaceState(null, "", url);
    } catch {}
  }, [scrollTargetId]);

  const updateQuery = useCallback(() => {
    if (!syncUrlQuery) return;
    // set ?tab=certificates pada URL sekarang
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("tab", tabId);
    router.replace(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams, tabId, syncUrlQuery]);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    scrollToBottomBar();   // 1) bawa user ke area BottomBar
    selectBottomBarTab();  // 2) minta BottomBar pindah tab
    updateQuery();         // 3) (opsional) sync query ?tab=
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-xl",
        "px-3.5 py-2",
        isLightMode ? "border border-black/10" : "border border-white/15",
        "bg-neutral-500/15 backdrop-blur-[2px]",
        "transition-colors",
        isLightMode
          ? "hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-black/30"
          : "hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/30",
        "focus:outline-none",
        className || "",
      ].join(" ")}
      aria-label="Buka tab Certificates"
    >
      <Award
        className={isLightMode ? "text-black/70" : "text-white/80"}
        size={18}
        aria-hidden
      />
      <span className={isLightMode ? "text-black/80" : "text-white/85"}>
        <span className="opacity-75">Certificates</span>
      </span>
    </button>
  );
}
