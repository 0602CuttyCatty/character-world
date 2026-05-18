"use client";
import { useEffect } from "react";

interface Props { x: number; y: number; onDone: () => void; }

export default function StarBurst({ x, y, onDone }: Props) {
  useEffect(() => { const t = setTimeout(onDone, 1000); return () => clearTimeout(t); }, []);
  const items = ["✨","⭐","💫","🌟","✨","⭐","💫"];
  return (
    <div style={{ position: "fixed", left: x-40, top: y-40, width: 80, height: 80, pointerEvents: "none", zIndex: 9999 }}>
      {items.map((s, i) => (
        <span key={i} style={{
          position: "absolute", fontSize: 20, left: "50%", top: "50%", opacity: 0,
          animation: `burst-out 1s ease-out ${i * 0.06}s forwards`,
          // @ts-ignore
          "--angle": `${(360 / items.length) * i}deg`,
        }}>{s}</span>
      ))}
    </div>
  );
}
