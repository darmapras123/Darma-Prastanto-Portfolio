"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  innerMaxWClass?: string;
  /** padding DI DALAM panel/card (gutter antara border panel dan konten) */
  contentPaddingClass?: string;
  outerClassName?: string;
  panelClassName?: string;
  outlined?: boolean;
  shrinkDesktop?: boolean;
};

export default function PanelContainer({
  children,
  innerMaxWClass = "max-w-[420px]",
  contentPaddingClass = "p-[0.5cm]", // ⬅️ 0.5cm di semua sisi (mobile gutter)
  outerClassName = "",
  panelClassName = "",
  outlined = true,
  shrinkDesktop = false,
}: Props) {
  const innerBase = [
    "mx-auto",
    shrinkDesktop ? "sm:w-fit sm:max-w-none" : "w-full",
    innerMaxWClass,
  ].join(" ");

  return (
    <div className={["w-full", outerClassName].join(" ")}>
      <div className={innerBase}>
        <div
          className={[
            outlined ? "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm" : "",
            "shadow-[0_10px_30px_-12px_rgba(37,99,235,0.25)]",
            contentPaddingClass,   // ⬅️ padding internal
            panelClassName,
          ].join(" ")}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
