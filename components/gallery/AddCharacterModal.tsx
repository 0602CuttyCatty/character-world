"use client";
import { useState } from "react";
import { Character, Rarity } from "@/types";
import { CHAR_EMOJIS, CHAR_COLORS } from "@/lib/constants";
import Modal from "@/components/ui/Modal";

interface Props {
  count: number;
  onAdd: (char: Character) => void;
  onClose: () => void;
}

export default function AddCharacterModal({ count, onAdd, onClose }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    const newChar: Character = {
      id:      Date.now(),
      name:    name.trim(),
      level:   1,
      attack:  10,
      emoji:   CHAR_EMOJIS[count % CHAR_EMOJIS.length],
      rarity:  "common" as Rarity,
      color:   CHAR_COLORS[count % CHAR_COLORS.length],
    };
    onAdd(newChar);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 42, marginBottom: 8 }}>🌟</div>
        <h2 style={{ fontWeight: 900, fontSize: 22, color: "#3D2D4D" }}>새 캐릭터 추가</h2>
        <p style={{ color: "#C08BAB", fontSize: 13, marginTop: 4 }}>새로운 친구를 데려와봐요!</p>
      </div>

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        placeholder="캐릭터 이름을 입력해줘 🎀"
        style={{
          width: "100%", padding: "14px 18px",
          border: "2.5px solid #F0D0E0", borderRadius: 16,
          fontSize: 15, fontFamily: "inherit", fontWeight: 700,
          color: "#3D2D4D", background: "#FFF8FB", marginBottom: 16,
        }}
      />

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "13px", borderRadius: 14, border: "2.5px solid #F0D0E0", background: "white", fontFamily: "inherit", fontWeight: 800, fontSize: 14, color: "#C08BAB", cursor: "pointer" }}>
          취소
        </button>
        <button onClick={handleSubmit} style={{ flex: 2, padding: "13px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#FF6B9D,#C44DFF)", fontFamily: "inherit", fontWeight: 900, fontSize: 14, color: "white", cursor: "pointer", boxShadow: "0 6px 18px rgba(196,77,255,.35)" }}>
          ✨ 추가하기
        </button>
      </div>
    </Modal>
  );
}
