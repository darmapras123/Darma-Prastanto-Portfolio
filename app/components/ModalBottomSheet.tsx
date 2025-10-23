"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  ariaLabel?: string;
  children: React.ReactNode;

  widthClassName?: string;       // default: "w-screen sm:w-[92vw]"
  maxWidthClassName?: string;    // default: "max-w-[900px]"
  maxHeightClassName?: string;   // default: "max-h-[80vh]"

  closeDragOffset?: number;
  closeVelocity?: number;
};

export default function ModalBottomSheet({
  open,
  onClose,
  ariaLabel = "Dialog",
  children,
  widthClassName = "w-screen sm:w-[92vw]",
  maxWidthClassName = "max-w-[900px]",
  maxHeightClassName = "max-h-[80vh]",
  closeDragOffset = 80,
  closeVelocity = 800,
}: Props) {
  const mountedRef = useRef(false);
  const portalElRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    portalElRef.current = document.body;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (open) html.classList.add("overflow-hidden");
    else html.classList.remove("overflow-hidden");
    return () => html.classList.remove("overflow-hidden");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > closeDragOffset || info.velocity.y > closeVelocity) onClose();
  };

  if (!mountedRef.current || !portalElRef.current) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="fixed inset-0 z-[9998] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Wrapper di atas backdrop: klik area kosong menutup */}
          <div
            className="fixed inset-0 z-[9999] flex items-end justify-center px-0 sm:px-6 pb-0"
            aria-hidden
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            {/* Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={ariaLabel}
              className={[
                "relative", // ⬅️ added relative (anchor top-right btn)
                "bg-neutral-950/95 text-white backdrop-blur-md",
                "rounded-t-2xl border border-white/10 shadow-2xl",
                "overflow-hidden mx-auto",
                widthClassName,
                maxWidthClassName,
              ].join(" ")}
              style={{ willChange: "transform" }}
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 32, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={onDragEnd}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="w-full pt-3 pb-2 grid place-items-center">
                <span aria-hidden className="block h-1.5 w-12 rounded-full bg-white/30" />
              </div>

              {/* Isi: mobile hide scrollbar; desktop tampilkan lagi */}
              <div
                className={[
                  "px-4 sm:px-6 pb-[max(env(safe-area-inset-bottom),1rem)] overflow-auto",
                  maxHeightClassName,
                  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                  "md:[-ms-overflow-style:auto] md:[scrollbar-width:auto] md:[&::-webkit-scrollbar]:block",
                ].join(" ")}
              >
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    portalElRef.current
  );
}
