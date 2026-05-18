import { Tab } from "@/app/page";

interface Props {
  tab: Tab;
  onChange: (tab: Tab) => void;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "gallery", label: "🖼️ 갤러리" },
  { key: "enhance", label: "⚔️ 강화하기" },
];

export default function TabBar({ tab, onChange }: Props) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 32 }}>
      {TABS.map(t => (
        <button
          key={t.key}
          className={`tab-btn${tab === t.key ? " active" : ""}`}
          onClick={() => onChange(t.key)}
          style={{
            padding: "12px 30px", borderRadius: 50, fontSize: 15, fontWeight: 800, fontFamily: "inherit",
            background: tab === t.key ? "linear-gradient(135deg,#FF6B9D,#C44DFF)" : "white",
            color:      tab === t.key ? "white" : "#B07090",
            boxShadow:  tab === t.key ? "0 6px 20px rgba(196,77,255,.35)" : "0 4px 14px rgba(200,120,180,.15)",
            border:     tab === t.key ? "none" : "2.5px solid #F0D0E0",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
