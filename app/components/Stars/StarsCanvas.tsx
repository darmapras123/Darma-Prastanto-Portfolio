// app/components/Stars/StarsCanvas.tsx
"use client";

import { useEffect, useRef } from "react";

export default function StarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Star = {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      depth: number;
      vx: number;
      vy: number;
      twinklePhase: number;
      twinkleSpeed: number;
    };

    let stars: Star[] = [];
    let animationId = 0;

    // kursor & smoothing
    let mouseX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
    let mouseY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
    let smoothX = mouseX;
    let smoothY = mouseY;

    // faktor parallax saat mengikuti kursor
    const parallax = 18; // semakin besar, semakin kuat gesernya
    const friction = 0.08; // smoothing gerakan

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(450, Math.floor((w * h) / 3000)); // auto-scale jumlah bintang
      stars = Array.from({ length: count }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const depth = Math.random() * 1 + 0.2; // 0.2–1.2
        const speed = (Math.random() * 0.4 + 0.1) * depth; // kecepatan gerak halus
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 1.4 + 0.3, // ukuran kecil
          depth,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.015 + Math.random() * 0.02,
        };
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    const step = () => {
      // smoothing cursor
      smoothX += (mouseX - smoothX) * friction;
      smoothY += (mouseY - smoothY) * friction;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // random drift halus
        s.x += s.vx * 0.5;
        s.y += s.vy * 0.5;

        // parallax mengikuti kursor (lebih dangkal = gerak lebih sedikit)
        const px = ((smoothX - w / 2) / w) * parallax * (1.4 - s.depth);
        const py = ((smoothY - h / 2) / h) * parallax * (1.4 - s.depth);

        // wrap di tepi layar
        if (s.x < -5) s.x = w + 5;
        if (s.x > w + 5) s.x = -5;
        if (s.y < -5) s.y = h + 5;
        if (s.y > h + 5) s.y = -5;

        // twinkle (kedip)
        s.twinklePhase += s.twinkleSpeed;
        const twinkle = (Math.sin(s.twinklePhase) + 1) * 0.5; // 0..1
        const alpha = 0.35 + twinkle * 0.65; // 0.35..1

        // gambar bintang (lingkaran kecil blur)
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(s.x - px, s.y - py, s.size, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 6 * s.depth;
        ctx.shadowColor = "rgba(255,255,255,0.9)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    animationId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
      aria-hidden="true"
    />
  );
}
