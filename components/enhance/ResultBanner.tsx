interface Props {
  result: "success" | "fail";
  prevLevel: number;
  newLevel: number;
}

export default function ResultBanner({ result, prevLevel, newLevel }: Props) {
  const ok = result === "success";
  return (
    <div style={{
      marginBottom: 14, padding: "18px 22px", borderRadius: 22,
      background: ok ? "linear-gradient(135deg,#F0FFF8,#DAFFF0)" : "linear-gradient(135deg,#FFF5F5,#FFE8E8)",
      border: `2.5px solid ${ok ? "#55EFC4" : "#FFBCBC"}`,
      animation: "result-pop .45s cubic-bezier(.34,1.56,.64,1)",
      display: "flex", alignItems: "center", gap: 16,
    }}>
      <div style={{ fontSize: 42, lineHeight: 1 }}>{ok ? "🎉" : "💔"}</div>
      <div>
        <div style={{ fontWeight: 900, fontSize: 18, color: ok ? "#00B894" : "#E17055" }}>
          {ok ? "강화 성공! ✨" : "강화 실패..."}
        </div>
        <div style={{ fontSize: 12, color: "#AAA", marginTop: 2 }}>
          {ok ? `${prevLevel} → ${newLevel} 레벨! 공격력 +5 🎊` : "아직 포기하지 마! 다시 도전! 💪"}
        </div>
      </div>
    </div>
  );
}
