"use client";

import { useRef, useEffect } from "react";

export default function Aurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animationFrame: number;

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 200; // tinggi aurora di atas layar
    };
    resize();
    window.addEventListener("resize", resize);

    // Animasi aurora
    let t = 0;
    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        for (let x = 0; x <= canvas.width; x += 10) {
          const y =
            60 * Math.sin((x * 0.01) + t + i) +
            30 * Math.sin((x * 0.02) + t * 1.5);
          ctx.lineTo(x, canvas.height / 2 + y);
        }

        const gradient = ctx.createLinearGradient(
          0, 0, canvas.width, canvas.height
        );
        if (i === 0) gradient.addColorStop(0, "rgba(58,41,255,0.4)");
        if (i === 1) gradient.addColorStop(0, "rgba(255,148,180,0.3)");
        if (i === 2) gradient.addColorStop(0, "rgba(50,255,100,0.25)");

        gradient.addColorStop(1, "transparent");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationFrame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full z-0 pointer-events-none"
    />
  );
}
