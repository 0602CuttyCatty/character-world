import { Character } from "@/types";
import { calcSuccessRate } from "@/lib/constants";

interface Props {
  character: Character;
  enhancing: boolean;
}

const RATE_COLOR = (r: number) => r >= 60 ? "#00B894" : r >= 30 ? "#FDCB6E" : "#FF7675";

export default function StatPreview({ character: c, enhancing }: Props) {
  const successRate = calcSuccessRate(c.level);
  const rateColor   = RATE_COLOR(successRate);

  return (
    <div style={{
      background: "white", borderRadius: 24, padding: "20px 22px",
      boxShadow: "0 8px 28px rgba(200,100,180,.12)",
      border: "2.5px solid #F0D0E8", marginBottom: 14,
    }}>
      {/* Before → After */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 18 }}>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: 11, color: "#C0A0B8", fontWeight: 700, marginBottom: 4 }}>현재</div>
          <div style={{ fontWeight: 900, fontSize: 22, color: "#3D2D4D" }}>Lv.{c.level}</div>
          <div style={{ fontSize: 13, color: "#A090B0", fontWeight: 700 }}>⚔️ {c.attack}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{ fontSize: 22, animation: enhancing ? "arrow-pulse .5s ease-in-out infinite alternate" : "none" }}>→</div>
          <div style={{ fontSize: 10, color: "#D0A8C0", fontWeight: 700 }}>강화 시</div>
        </div>

        <div style={{
          textAlign: "center", flex: 1,
          background: `linear-gradient(135deg,${c.color}18,${c.color}30)`,
          borderRadius: 16, padding: "10px 8px",
          border: `1.5px solid ${c.color}55`,
        }}>
          <div style={{ fontSize: 11, color: "#C0A0B8", fontWeight: 700, marginBottom: 4 }}>성공 시</div>
          <div style={{ fontWeight: 900, fontSize: 22, color: c.color }}>Lv.{c.level + 1}</div>
          <div style={{ fontSize: 13, color: c.color, fontWeight: 700 }}>⚔️ {c.attack + 5}</div>
        </div>
      </div>

      {/* Rate bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#C08BAB" }}>성공 확률</span>
          <span style={{ fontSize: 15, fontWeight: 900, color: rateColor }}>{successRate}%</span>
        </div>

        <div style={{ height: 12, background: "#F0E0E8", borderRadius: 12, overflow: "hidden", marginBottom: 5 }}>
          <div style={{
            height: "100%", borderRadius: 12, width: `${successRate}%`,
            background: successRate >= 60
              ? "linear-gradient(90deg,#00B894,#55EFC4)"
              : successRate >= 30
              ? "linear-gradient(90deg,#FDCB6E,#E17055)"
              : "linear-gradient(90deg,#FF7675,#D63031)",
            transition: "width .5s ease", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent)", backgroundSize: "80px 100%", animation: "shimmer 1.3s linear infinite" }} />
          </div>
        </div>

        {/* Pip row */}
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: 10 }, (_, i) => {
            const filled = Math.round(successRate / 10) > i;
            return (
              <div key={i} style={{
                flex: 1, height: 5, borderRadius: 3, transition: "background .4s",
                background: filled ? (successRate >= 60 ? "#55EFC4" : successRate >= 30 ? "#FDCB6E" : "#FF7675") : "#F0E0E8",
              }} />
            );
          })}
        </div>
        <p style={{ fontSize: 11, color: "#D0A8C0", marginTop: 5, fontWeight: 600, textAlign: "right" }}>
          레벨이 높을수록 확률이 낮아져요!
        </p>
      </div>
    </div>
  );
}
