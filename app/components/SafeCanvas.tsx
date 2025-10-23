"use client";

import React, { PropsWithChildren, useRef } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

// Cek ketersediaan WebGL (client-only)
function webglSupported(kind: "webgl" | "webgl2" = "webgl2") {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext(kind) ||
      canvas.getContext(kind === "webgl2" ? "webgl" : "experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

// Import Canvas dari @react-three/fiber hanya di client
const Canvas = dynamic(() => import("@react-three/fiber").then((m) => m.Canvas), {
  ssr: false,
});

type SafeCanvasProps = PropsWithChildren<{
  /** Kelas Tailwind untuk tinggi wrapper, mis. "h-[360px]" (default: "h-[320px]") */
  heightClass?: string;
  /** ClassName ekstra untuk wrapper */
  className?: string;
  /** Tampilkan placeholder kubus kalau children tidak diberikan */
  showPlaceholderBox?: boolean;
}>;

/**
 * SafeCanvas
 * - Aman dipakai meskipun WebGL tidak tersedia (akan fallback ke div biasa).
 * - Tanpa inline style, jadi tidak kena peringatan "no-inline-styles".
 * - Atur tinggi dengan Tailwind via `heightClass` (h-[...]).
 */
export default function SafeCanvas({
  heightClass = "h-[320px]",
  className = "",
  children,
  showPlaceholderBox = false,
}: SafeCanvasProps) {
  const ok = webglSupported("webgl2") || webglSupported("webgl");

  // Gabungkan kelas wrapper: tinggi + tambahan user
  const wrapperClass = ["w-full", heightClass, className].join(" ");

  if (!ok) {
    // Fallback aman kalau WebGL tidak tersedia
    return (
      <div
        className={[
          wrapperClass,
          "rounded-2xl border p-6 text-center text-sm opacity-80",
          "border-black/10 dark:border-white/10",
        ].join(" ")}
        role="img"
        aria-label="WebGL not available - showing static fallback"
      >
        WebGL tidak tersedia di browser/mesin ini. Menampilkan fallback statis.
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <Canvas
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        {children ?? (showPlaceholderBox ? <PlaceholderBox /> : null)}
      </Canvas>
    </div>
  );
}

/** PlaceholderBox: konten sederhana supaya Canvas terlihat “hidup” kalau children tidak diisi */
function PlaceholderBox() {
  const ref = useRef<Mesh | null>(null);

  // Putar kubus pelan
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.6;
      ref.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <>
      {/* eslint-disable react/no-unknown-property */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 3, 5]} intensity={1} />
      <mesh ref={ref}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial />
      </mesh>
      {/* eslint-enable react/no-unknown-property */}
    </>
  );
}
