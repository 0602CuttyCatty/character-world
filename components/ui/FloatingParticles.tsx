const COLORS = ["#FFD6E0","#FFE8CC","#D4F1F4","#E8D5FF","#FFEAA7","#DFE6E9"];

export default function FloatingParticles() {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    width:           `${6 + (i * 3.7) % 10}px`,
    height:          `${6 + (i * 3.7) % 10}px`,
    left:            `${(i * 17 + 5)  % 100}%`,
    top:             `${(i * 23 + 10) % 100}%`,
    background:      COLORS[i % COLORS.length],
    animationDelay:  `${(i * 0.6) % 4}s`,
    animationDuration:`${3 + (i % 3)}s`,
    opacity:          0.55,
  }));

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute", borderRadius: "50%", pointerEvents: "none",
            animation: "float-up 4s ease-in-out infinite",
            ...p,
          }}
        />
      ))}
    </>
  );
}
