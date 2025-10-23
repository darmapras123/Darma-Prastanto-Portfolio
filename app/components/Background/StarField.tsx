"use client";
import { useEffect, useState } from "react";

export default function StarField() {
  const [stars, setStars] = useState<{x:number;y:number}[]>([]);
  useEffect(() => {
    setStars(Array.from({ length: 200 }, () => ({ x: Math.random(), y: Math.random() })));
  }, []);
  return (
    <svg className="absolute inset-0 w-full h-full">
      {stars.map((s, i) => (
        <circle key={i} cx={`${s.x * 100}%`} cy={`${s.y * 100}%`} r="1" />
      ))}
    </svg>
  );
}
