"use client";
import { useState } from "react";
import { Character } from "@/types";
import CharacterCard from "./CharacterCard";
import AddCharacterModal from "./AddCharacterModal";

interface Props {
  characters: Character[];
  onAdd: (char: Character) => void;
}

export default function GalleryGrid({ characters, onAdd }: Props) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 60px", animation: "slide-up .4s ease" }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <p style={{ color: "#C08BAB", fontWeight: 700, fontSize: 15 }}>
          총 <span style={{ color: "#FF6B9D", fontSize: 18 }}>{characters.length}</span>마리의 캐릭터
        </p>
        <button
          onClick={() => setAddOpen(true)}
          style={{
            width: 46, height: 46, borderRadius: "50%", fontSize: 22, color: "white",
            background: "linear-gradient(135deg,#FF6B9D,#C44DFF)", border: "none", cursor: "pointer",
            boxShadow: "0 6px 18px rgba(196,77,255,.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform .18s cubic-bezier(.34,1.56,.64,1)",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.12) rotate(8deg)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >+</button>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: 18 }}>
        {characters.map((char, i) => (
          <CharacterCard key={char.id} character={char} index={i} />
        ))}
      </div>

      {/* Modal */}
      {addOpen && (
        <AddCharacterModal
          count={characters.length}
          onAdd={onAdd}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  );
}
