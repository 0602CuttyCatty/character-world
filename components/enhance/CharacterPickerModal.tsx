import { Character } from "@/types";
import Modal from "@/components/ui/Modal";

interface Props {
  characters: Character[];
  selected: Character | null;
  onSelect: (char: Character) => void;
  onClose: () => void;
}

export default function CharacterPickerModal({ characters, selected, onSelect, onClose }: Props) {
  return (
    <Modal onClose={onClose} width={360} maxHeight="80vh">
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 36, marginBottom: 6 }}>🎯</div>
        <h2 style={{ fontWeight: 900, fontSize: 20, color: "#3D2D4D" }}>강화할 캐릭터 선택</h2>
        <p style={{ color: "#C08BAB", fontSize: 12, marginTop: 3 }}>제단에 올릴 친구를 골라봐요!</p>
      </div>

      <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 10, paddingRight: 4 }}>
        {characters.map(char => {
          const active = selected?.id === char.id;
          return (
            <div
              key={char.id}
              className="pick-item"
              onClick={() => { onSelect(char); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                background: active ? `linear-gradient(135deg,${char.color}22,${char.color}44)` : "#FFF8FC",
                border: `2px solid ${active ? char.color : "#F0D8E8"}`,
                borderRadius: 18, padding: "12px 16px",
              }}
            >
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: `radial-gradient(circle,${char.color}44,${char.color}AA)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, border: `2px solid ${char.color}66` }}>
                {char.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: "#3D2D4D", fontSize: 15 }}>{char.name}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#FF6B9D", background: "#FFE8F0", borderRadius: 20, padding: "1px 8px" }}>Lv.{char.level}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#6C5CE7", background: "#EDE8FF", borderRadius: 20, padding: "1px 8px" }}>⚔️{char.attack}</span>
                </div>
              </div>
              {active && <span style={{ fontSize: 20 }}>✓</span>}
            </div>
          );
        })}
      </div>

      <button onClick={onClose} style={{ marginTop: 18, padding: "12px", borderRadius: 14, border: "2px solid #F0D0E0", background: "white", fontFamily: "inherit", fontWeight: 800, fontSize: 14, color: "#C08BAB", cursor: "pointer", width: "100%" }}>
        닫기
      </button>
    </Modal>
  );
}
