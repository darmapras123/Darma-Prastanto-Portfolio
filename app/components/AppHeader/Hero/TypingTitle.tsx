"use client";
import { useEffect, useState } from "react";

export default function TypingTitle() {
  const full = "Design Graphic";        // teks final
  const [txt, setTxt] = useState(full); // sama dgn output SSR

  useEffect(() => {
    setTxt("");                         // mulai animasi SETELAH mount
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTxt(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 70);
    return () => clearInterval(id);
  }, []);

  return <span>{txt}</span>;
}
