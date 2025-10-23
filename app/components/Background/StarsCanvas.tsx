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
    };

    let stars: Star[] = [];
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let smoothX = mouseX;
    let smoothY = mouseY;

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      stars = Array.from({ length: 300 }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const depth = Math.random();
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          size: depth * 1.2 + 0.2,
          depth,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        };
      });
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      smoothX += (mouseX - smoothX) * 0.05;
      smoothY += (mouseY - smoothY) * 0.05;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      stars.forEach((star) => {
        star.baseX += star.vx;
        star.baseY += star.vy;

        if (star.baseX < 0 || star.baseX > canvas.width)
          star.baseX = Math.random() * canvas.width;
        if (star.baseY < 0 || star.baseY > canvas.height)
          star.baseY = Math.random() * canvas.height;

        const parallaxStrength = star.depth * 0.05;
        const offsetX = (smoothX - centerX) * parallaxStrength;
        const offsetY = (smoothY - centerY) * parallaxStrength;

        const drawX = star.baseX + offsetX;
        const drawY = star.baseY + offsetY;

        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = "white";

        ctx.globalAlpha =
          0.5 + Math.sin(Date.now() * 0.002 + (star.x as number) * 0.5) * 0.4;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
