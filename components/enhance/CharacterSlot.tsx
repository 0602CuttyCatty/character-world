import { Character } from "@/types";
import { RARITY_COLORS, RARITY_LABEL } from "@/lib/constants";

interface Props {
  character: Character | null;
  enhancing: boolean;
  shaking: boolean;
  altarRef: React.RefObject<HTMLDivElement>;
  onClick: () => void;
}

export default function CharacterSlot({ character: c, enhancing, shaking, altarRef, onClick }: Props) {
  return (
    <div style={{
      background: "white", borderRadius: 28, padding: "28px 24px 22px",
      boxShadow: "0 12px 40px rgba(200,100,180,.16)",
      border: "2.5px solid #F0D0E8", textAlign: "center",
      position: "relative", overflow: "hidden", marginBottom: 14,
    }}>
      {/* shimmer top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: "linear-gradient(90deg,#FF6B9D,#C44DFF,#74B9FF,#FDCB6E,#FF6B9D)",
        backgroundSize: "300% 100%", animation: "shimmer 2.5s linear infinite",
      }} />

      <p style={{ fontSize: 11, fontWeight: 800, color: "#D0A0C0", letterSpacing: 3, marginBottom: 18, textTransform: "uppercase" }}>
        ✦ 강화 슬롯 ✦
      </p>

      {/* slot */}
      <div
        onClick={() => !enhancing && onClick()}
        style={{
          width: "100%", minHeight: 104,
          border: c ? `2.5px solid ${c.color}` : "2.5px dashed #E8C8D8",
          borderRadius: 22,
          background: c ? `linear-gradient(145deg, white, ${c.color}18)` : "linear-gradient(145deg,#FFF8FC,#F8F0FF)",
          display: "flex", alignItems: "center", gap: 18,
          padding: "18px 20px",
          cursor: enhancing ? "default" : "pointer",
          transition: "all .22s cubic-bezier(.34,1.56,.64,1)",
          boxShadow: c ? `0 6px 22px ${c.color}30` : "none",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* shimmer while enhancing */}
        {enhancing && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: 20, zIndex: 2, pointerEvents: "none",
            background: "linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent)",
            backgroundSize: "60% 100%", animation: "shimmer .9s linear infinite",
          }} />
        )}

        {c ? (
          <>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                ref={altarRef}
                className={shaking ? "shaking" : ""}
                style={{
                  width: 70, height: 70, borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 30%,${c.color}44,${c.color}CC)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 36, border: `3px solid ${c.color}`,
                  boxShadow: `0 4px 16px ${c.color}55`,
                  animation: enhancing ? "enhance-float .75s ease-in-out infinite" : "none",
                }}
              >
                {c.emoji}
              </div>
              {/* orbiting ring */}
              <div style={{
                position: "absolute", inset: -8, borderRadius: "50%",
                border: `2px dashed ${c.color}88`, pointerEvents: "none",
                animation: enhancing ? "ring-spin 1s linear infinite" : "none",
              }} />
              {/* level badge */}
              <div style={{
                position: "absolute", bottom: -4, right: -4,
                background: "linear-gradient(135deg,#FF6B9D,#C44DFF)", color: "white",
                fontSize: 11, fontWeight: 900, borderRadius: 20, padding: "2px 8px",
                boxShadow: "0 2px 8px rgba(196,77,255,.4)", border: "2px solid white",
              }}>+{c.level}</div>
            </div>

            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontWeight: 900, fontSize: 18, color: "#3D2D4D", marginBottom: 5 }}>{c.name}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: RARITY_COLORS[c.rarity].text, background: RARITY_COLORS[c.rarity].bg, border: `1.5px solid ${RARITY_COLORS[c.rarity].border}`, borderRadius: 20, padding: "2px 9px" }}>
                  {RARITY_LABEL[c.rarity]}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6C5CE7", background: "#EDE8FF", borderRadius: 20, padding: "2px 9px" }}>⚔️ {c.attack}</span>
              </div>
              {!enhancing && <p style={{ fontSize: 11, color: "#C8A8C0", marginTop: 7, fontWeight: 600 }}>탭해서 교체하기 🔄</p>}
            </div>

            <div style={{ fontSize: 20, color: c.color, opacity: .7, flexShrink: 0 }}>▶</div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "8px 0" }}>
            <div style={{ fontSize: 38, animation: "wiggle 2s ease-in-out infinite" }}>🔮</div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#C08BAB" }}>캐릭터를 슬롯에 올려봐요!</div>
            <div style={{ fontSize: 12, color: "#D5B5C8" }}>탭해서 선택하기 ✨</div>
          </div>
        )}
      </div>
    </div>
  );
}
