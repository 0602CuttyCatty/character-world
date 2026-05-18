export default function Header() {
  return (
    <div style={{ textAlign: "center", padding: "44px 20px 28px" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 36, display: "inline-block", animation: "wiggle 2s ease-in-out infinite" }}>🎀</span>
        <h1 style={{
          fontSize: 38, fontWeight: 900, letterSpacing: -1, lineHeight: 1,
          background: "linear-gradient(135deg,#FF6B9D,#C44DFF,#4D79FF)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          캐릭터 월드
        </h1>
        <span style={{ fontSize: 36, display: "inline-block", animation: "wiggle 2s ease-in-out infinite", animationDelay: ".5s" }}>🎀</span>
      </div>
      <p style={{ color: "#C08BAB", fontSize: 14, fontWeight: 600, letterSpacing: 2 }}>
        CHARACTER WORLD ✦ 나만의 컬렉션
      </p>
    </div>
  );
}
