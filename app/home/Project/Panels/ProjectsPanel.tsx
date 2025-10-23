"use client";

import React from "react";
import PangPang from "../ProjectItems/PangPang";
import Batik from "../ProjectItems/Batik";
import Poster17 from "../ProjectItems/Poster17";
import PosterMendoan from "../ProjectItems/PosterMendoan";
import TampilanAnimasi from "../ProjectItems/TampilanAnimasi";

type Props = {
  isLightMode: boolean;
  onViewerOpenChange?: (open: boolean) => void;
};

export default function ProjectsPanel({ isLightMode, onViewerOpenChange }: Props) {
  void isLightMode;

  return (
    <section className="w-full">
      <div className="w-full">
        {/* MOBILE: 1 kolom, semua center, jarak 0.5cm */}
        <div className="grid grid-cols-1 justify-items-center items-start sm:hidden w-full gap-y-[0.5cm]">
          <PangPang onViewerOpenChange={onViewerOpenChange} />
          <Batik onViewerOpenChange={onViewerOpenChange} />
          <Poster17 onViewerOpenChange={onViewerOpenChange} />
          <PosterMendoan onViewerOpenChange={onViewerOpenChange} />
          <TampilanAnimasi onViewerOpenChange={onViewerOpenChange} />
        </div>

        {/* DESKTOP (≥ sm): 3 kolom sejajar, center, gap 0.5cm */}
        <div
          className="
            hidden sm:grid
            sm:grid-cols-[max-content_max-content_max-content]
            justify-center items-start
            gap-x-[0.5cm] gap-y-[0.5cm]
          "
        >
          {/* Kolom 1: PangPang + PosterMendoan */}
          <div className="flex flex-col items-start gap-y-[0.5cm]">
            <PangPang onViewerOpenChange={onViewerOpenChange} />
            <PosterMendoan onViewerOpenChange={onViewerOpenChange} />
          </div>

          {/* Kolom 2: Batik + Tampilan (Animasi) */}
          <div className="flex flex-col items-start gap-y-[0.5cm]">
            <Batik onViewerOpenChange={onViewerOpenChange} />
            <TampilanAnimasi onViewerOpenChange={onViewerOpenChange} />
          </div>

          {/* Kolom 3: Poster 17 Agustus */}
          <div className="flex flex-col items-start gap-y-[0.5cm]">
            <Poster17 onViewerOpenChange={onViewerOpenChange} />
          </div>
        </div>
      </div>
    </section>
  );
}
