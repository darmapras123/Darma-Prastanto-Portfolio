"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";

// Optional: scene contentmu
function Scene() {
  // … objek 3D kamu di sini
  return null;
}

export default function SceneCanvas() {
  // Hindari crash saat WebGL unavailable → fallback UI
  const webglOK = useMemo(() => {
    if (typeof window === "undefined") return false;
    try {
      const c = document.createElement("canvas");
      const ok =
        !!window.WebGLRenderingContext &&
        (c.getContext("webgl") || c.getContext("experimental-webgl"));
      return !!ok;
    } catch {
      return false;
    }
  }, []);

  if (!webglOK) {
    return (
      <div className="w-full h-64 grid place-items-center rounded-xl border border-black/10 dark:border-white/10">
        <p className="text-sm text-black/70 dark:text-white/70">
          WebGL tidak tersedia di browser/perangkat ini.
        </p>
      </div>
    );
  }

  return (
    <Canvas
      /** Gunakan renderer WebGL1 (lebih kompatibel di device lama) */
      legacy
      /** Minimalkan opsi supaya context lebih mudah dibuat */
      gl={{
        antialias: false,            // antialias off = lebih ringan
        alpha: false,                // kanvas opaque
        stencil: false,              // kurangin beban
        depth: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      }}
      /** Batasi DPR agar tidak terlalu berat di layar high-DPI */
      dpr={[1, 1.5]}
      /** Penting: ukuran kanvas harus terlihat (bukan display:none) */
      style={{ width: "100%", height: "100%" }}
      /** Optional: warna background */
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0); // transparent
      }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
