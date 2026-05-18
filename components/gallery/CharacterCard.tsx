"use client";
import { useState } from "react";
import { Character } from "@/types";
import Badge from "@/components/ui/Badge";

interface Props {
  character: Character;
  index: number;
}

export default function CharacterCard({ character: c, index }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="char-card"
      style={{
        animationDelay: `${index * 0.07}s`,
        background:     `linear-gradient(145deg, white, ${c.color}22)`,
        border:         `2.5px solid ${c.color}88`,
        borderRadius:   24,
        padding:        "22px 16px 18px",
        textAlign:      "center",
        boxShadow:      `0 6px 20px ${c.color}30`,
        position:       "relative",
        overflow:       "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Rarity badge */}
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <Badge rarity={c.rarity} />
      </div>

      {/* Avatar */}
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background:  `radial-gradient(circle at 35% 35%, ${c.color}44, ${c.color}BB)`,
        margin:      "0 auto 12px",
        display:     "flex", alignItems: "center", justifyContent: "center",
        fontSize:    36,
        boxShadow:   `0 4px 14px ${c.color}55`,
        border:      `3px solid ${c.color}66`,
        transition:  "transform .2s",
        transform:   hovered ? "scale(1.1) rotate(8deg)" : "scale(1)",
      }}>
        {c.emoji}
      </div>

      <div style={{ fontWeight: 800, fontSize: 16, color: "#3D2D4D", marginBottom: 4 }}>{c.name}</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#FF6B9D", background: "#FFE8F0", borderRadius: 20, padding: "2px 8px" }}>Lv.{c.level}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#6C5CE7", background: "#EDE8FF", borderRadius: 20, padding: "2px 8px" }}>⚔️{c.attack}</span>
      </div>
    </div>
  );
}
