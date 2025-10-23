"use client";

import React, { useMemo } from "react";

/**
 * StarBolder
 * - SVG layer of bold, twinkling stars
 * - Works on any background; colors adapt with Tailwind classes you pass
 *
 * Tips warna:
 * - Untuk dark page: gunakan className "text-white"
 * - Untuk light page: gunakan className "text-black"
 */
type StarBolderProps = {
  /** Lebar area (px). Default: 800 */
  width?: number;
  /** Tinggi area (px). Default: 240 */
  height?: number;
  /** Jumlah bintang. Default: 70 */
  count?: number;
  /** Seed agar pola stabil di setiap render. Default: 7 */
  seed?: number;
  /** Skala radius bintang (0.6–1.8 rekomendasi). Default: 1 */
  sizeScale?: number;
  /** Kecepatan animasi (1 = normal; >1 = lebih cepat). Default: 1 */
  speed?: number;
  /** Kelas Tailwind tambahan (posisi/z-index/warna). */
  className?: string;
};

function seededRand(seed: number) {
  // Xorshift sederhana: deterministik, ringan
  let x = seed || 7;
  return () => {
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    // 0..1
    return Math.abs(x) / 0x7fffffff;
  };
}

export default function StarBolder({
  width = 800,
  height = 240,
  count = 70,
  seed = 7,
  sizeScale = 1,
  speed = 1,
  className,
}: StarBolderProps) {
  // Pre-generate star positions & params (deterministik via seed)
  const stars = useMemo(() => {
    const rnd = seededRand(seed);
    return Array.from({ length: count }).map((_, i) => {
      const x = Math.floor(rnd() * width);
      const y = Math.floor(rnd() * height);
      // radius lebih “bold” (0.8–2.2 * scale)
      const r = (0.8 + rnd() * 1.4) * sizeScale;

      // twinkle delay & durasi acak
      const delay = rnd() * 3; // s
      const dur = 2.2 + rnd() * 2.4; // s

      // sedikit parallax horizontal
      const drift = (rnd() - 0.5) * 10; // px range total
      const driftDur = 4 + rnd() * 6; // s

      // intensitas opacity
      const baseOpacity = 0.6 + rnd() * 0.35;

      return { id: i, x, y, r, delay, dur, drift, driftDur, baseOpacity };
    });
  }, [count, width, height, seed, sizeScale]);

  return (
    <div
      className={[
        // PENTING: biar tidak mengganggu click/scroll
        "pointer-events-none select-none",
        // biar bisa ditaruh absolute/relative sesuai kebutuhan parent
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      // Untuk aksesibilitas: purely decorative
      aria-hidden="true"
    >
      {/* SVG inherit warna dari currentColor (pakai text-XXX) */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        className="block"
      >
        {/* Glow lembut di belakang bintang (feGaussianBlur) */}
        <defs>
          <filter id="sb-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* keyframes CSS-in-SVG (shadow DOM safe) */}
          <style>
            {`
              @keyframes sb-twinkle {
                0%   { opacity: 0.65; transform: scale(1);   }
                50%  { opacity: 1;    transform: scale(1.25);}
                100% { opacity: 0.65; transform: scale(1);   }
              }
              @keyframes sb-parallax {
                0%   { transform: translateX(0px);   }
                50%  { transform: translateX(var(--sb-drift)); }
                100% { transform: translateX(0px);   }
              }
            `}
          </style>
        </defs>

        <g
          // currentColor akan mengikuti className text-*
          fill="currentColor"
          filter="url(#sb-glow)"
        >
          {stars.map((s) => (
            <g
              key={s.id}
              style={
                {
                  // CSS variables untuk drift
                
                  "--sb-drift": `${s.drift}px`,
                  animation: `
                    sb-parallax ${s.driftDur / speed}s ease-in-out ${s.delay / speed}s infinite
                  `,
                } as React.CSSProperties
              }
              transform={`translate(${s.x}, ${s.y})`}
            >
              <circle
                cx={0}
                cy={0}
                r={s.r}
                style={{
                  opacity: s.baseOpacity,
                  transformOrigin: "center",
                  animation: `sb-twinkle ${s.dur / speed}s ease-in-out ${s.delay / speed}s infinite`,
                }}
              />
              {/* plus bentuk "plus" tipis untuk kesan bold/spark */}
              <rect
                x={-s.r * 0.9}
                y={-0.3}
                width={s.r * 1.8}
                height={0.6}
                rx={0.3}
                style={{
                  opacity: s.baseOpacity * 0.6,
                  animation: `sb-twinkle ${(s.dur * 0.9) / speed}s ease-in-out ${(s.delay * 1.1) / speed}s infinite`,
                }}
              />
              <rect
                x={-0.3}
                y={-s.r * 0.9}
                width={0.6}
                height={s.r * 1.8}
                rx={0.3}
                style={{
                  opacity: s.baseOpacity * 0.6,
                  animation: `sb-twinkle ${(s.dur * 1.1) / speed}s ease-in-out ${(s.delay * 0.9) / speed}s infinite`,
                }}
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
