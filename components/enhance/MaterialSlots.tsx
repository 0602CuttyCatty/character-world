const MATERIALS = [
  { emoji: "💎", label: "강화석",    color: "#C44DFF" },
  { emoji: "🍀", label: "행운의 풀잎", color: "#00B894" },
  { emoji: "🌙", label: "달빛 가루",  color: "#FDCB6E" },
];

export default function MaterialSlots() {
  return (
    <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
      {MATERIALS.map(m => (
        <div key={m.label} style={{
          flex: 1, background: "white", borderRadius: 16, padding: "12px 14px",
          border: "2px dashed #F0D0E0", textAlign: "center",
        }}>
          <div style={{ fontSize: 22, marginBottom: 2 }}>{m.emoji}</div>
          <div style={{ fontSize: 11, color: "#D0A0C0", fontWeight: 700 }}>{m.label}</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: m.color }}>×∞</div>
        </div>
      ))}
    </div>
  );
}
