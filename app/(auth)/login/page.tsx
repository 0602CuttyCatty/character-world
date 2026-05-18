import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito','Noto Sans KR',sans-serif" }}>
      <div style={{ background: "white", borderRadius: 28, padding: "48px 40px", boxShadow: "0 20px 60px rgba(200,100,180,.2)", textAlign: "center", width: 340 }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🎀</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#3D2D4D", marginBottom: 6 }}>캐릭터 월드</h1>
        <p style={{ color: "#C08BAB", fontSize: 14, marginBottom: 32 }}>로그인하고 나만의 컬렉션을 만들어봐요!</p>

        <form action={async () => { "use server"; await signIn("google", { redirectTo: "/" }); }}>
          <button type="submit" style={{ width: "100%", padding: "14px", borderRadius: 16, border: "2px solid #E8D0E0", background: "white", fontFamily: "inherit", fontWeight: 800, fontSize: 15, color: "#3D2D4D", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
            <span>🌐</span> Google로 로그인
          </button>
        </form>

        <form action={async () => { "use server"; await signIn("github", { redirectTo: "/" }); }}>
          <button type="submit" style={{ width: "100%", padding: "14px", borderRadius: 16, border: "none", background: "linear-gradient(135deg,#FF6B9D,#C44DFF)", fontFamily: "inherit", fontWeight: 800, fontSize: 15, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 6px 18px rgba(196,77,255,.35)" }}>
            <span>🐙</span> GitHub로 로그인
          </button>
        </form>
      </div>
    </div>
  );
}
