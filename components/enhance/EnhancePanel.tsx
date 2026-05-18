"use client";

import { useRef, useState } from "react";
import { Character } from "@/types";
import { calcSuccessRate } from "@/lib/constants";
import CharacterSlot from "./CharacterSlot";
import StatPreview from "./StatPreview";
import ResultBanner from "./ResultBanner";
import MaterialSlots from "./MaterialSlots";
import CharacterPickerModal from "./CharacterPickerModal";
import StarBurst from "@/components/ui/StarBurst";

interface Props {
  characters: Character[];
  onUpdate: (char: Character) => void;
}

type Result = "success" | "fail" | null;

export default function EnhancePanel({ characters, onUpdate }: Props) {
  const [selected, setSelected]     = useState<Character | null>(null);
  const [enhancing, setEnhancing]   = useState(false);
  const [result, setResult]         = useState<Result>(null);
  const [shaking, setShaking]       = useState(false);
  const [prevLevel, setPrevLevel]   = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sparks, setSparks]         = useState<{ id: number; x: number; y: number }[]>([]);
  const altarRef = useRef<HTMLDivElement>(null);

  const handleEnhance = async () => {
    if (!selected || enhancing) return;
    setEnhancing(true);
    setResult(null);
    setPrevLevel(selected.level);

    await new Promise(r => setTimeout(r, 1800));

    const rate = calcSuccessRate(selected.level);
    const ok   = Math.random() * 100 < rate;

    if (ok) {
      const updated: Character = { ...selected, level: selected.level + 1, attack: selected.attack + 5 };
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

  const handleSelect = (char: Character) => {
    setSelected(char);
    setResult(null);
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 60px", animation: "slide-up .4s ease" }}>

      {/* Star burst effects */}
      {sparks.map(s => (
        <StarBurst key={s.id} x={s.x} y={s.y} onDone={() => setSparks(p => p.filter(x => x.id !== s.id))} />
      ))}

      {/* Slot */}
      <CharacterSlot
        character={selected}
        enhancing={enhancing}
        shaking={shaking}
        altarRef={altarRef}
        onClick={() => setPickerOpen(true)}
      />

      {/* Stat preview */}
      {selected && <StatPreview character={selected} enhancing={enhancing} />}

      {/* Result */}
      {result && selected && prevLevel !== null && (
        <ResultBanner result={result} prevLevel={prevLevel} newLevel={selected.level} />
      )}

      {/* Enhance button */}
      <button
        className="enhance-btn"
        onClick={handleEnhance}
        disabled={enhancing || !selected}
        style={{
          width: "100%", padding: "20px", borderRadius: 22,
          fontSize: 18, fontWeight: 900, fontFamily: "inherit",
          background: !selected ? "#EEE8F4" : enhancing ? "#EDE0F5" : "linear-gradient(135deg,#FF6B9D,#C44DFF)",
          color: (!selected || enhancing) ? "#BBA0CC" : "white",
          boxShadow: (!selected || enhancing) ? "none" : "0 10px 28px rgba(196,77,255,.42)",
          letterSpacing: 1, position: "relative", overflow: "hidden",
        }}
      >
        {!enhancing && selected && (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)", backgroundSize: "60% 100%", animation: "shimmer 2s linear infinite", pointerEvents: "none" }} />
        )}
        {enhancing
          ? <span style={{ display: "inline-flex", alignItems: "center", gap: 10, position: "relative" }}>
              <span style={{ display: "inline-block", animation: "ring-spin .7s linear infinite" }}>⚙️</span>
              강화 중...
            </span>
          : selected
          ? <span style={{ position: "relative" }}>✨ 강화하기 ✨</span>
          : "캐릭터를 먼저 선택해주세요"}
      </button>

      {/* Material slots */}
      {selected && <MaterialSlots />}

      {/* Picker modal */}
      {pickerOpen && (
        <CharacterPickerModal
          characters={characters}
          selected={selected}
          onSelect={handleSelect}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
