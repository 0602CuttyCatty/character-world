"use client";
import { useState, useRef } from "react";
import { Character } from "@/types";
import { calcSuccessRate } from "@/lib/constants";

export function useEnhance(onUpdate: (char: Character) => void) {
  const [selected, setSelected]   = useState<Character | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [result, setResult]       = useState<"success" | "fail" | null>(null);
  const [shaking, setShaking]     = useState(false);
  const [prevLevel, setPrevLevel] = useState<number | null>(null);
  const [sparks, setSparks]       = useState<{ id: number; x: number; y: number }[]>([]);
  const altarRef = useRef<HTMLDivElement>(null);

  const enhance = async () => {
    if (!selected || enhancing) return;
    setEnhancing(true);
    setResult(null);
    setPrevLevel(selected.level);

    // 로컬 확률 계산 (DB 연동 후엔 /api/enhance 호출로 교체)
    await new Promise(r => setTimeout(r, 1800));
    const rate = calcSuccessRate(selected.level);
    const ok   = Math.random() * 100 < rate;

    // DB 연동 버전:
    // const res = await fetch("/api/enhance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ characterId: selected.id }) });
    // const { success, character: updated } = await res.json();

    if (ok) {
      const updated = { ...selected, level: selected.level + 1, attack: selected.attack + 5 };
      setSelected(updated);
      onUpdate(updated);
      setResult("success");
      if (altarRef.current) {
        const r = altarRef.current.getBoundingClientRect();
        setSparks(prev => [...prev, { id: Date.now(), x: r.left + r.width / 2, y: r.top + r.height / 2 }]);
      }
    } else {
      setResult("fail");
      setShaking(true);
      setTimeout(() => setShaking(false), 700);
    }
    setEnhancing(false);
  };

  const removeSpark = (id: number) => setSparks(prev => prev.filter(s => s.id !== id));

  return { selected, setSelected, enhancing, result, setResult, shaking, prevLevel, sparks, altarRef, enhance, removeSpark };
}
