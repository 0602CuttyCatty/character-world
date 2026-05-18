"use client";
import { useState, useEffect, useRef } from "react";

const TABLE = [
  { lv:0,  rate:100, cost:0,      sellPrice:500,    fragDrop:0  },
  { lv:1,  rate:90,  cost:200,    sellPrice:1000,   fragDrop:1  },
  { lv:2,  rate:85,  cost:400,    sellPrice:2000,   fragDrop:1  },
  { lv:3,  rate:80,  cost:700,    sellPrice:3500,   fragDrop:2  },
  { lv:4,  rate:74,  cost:1100,   sellPrice:5500,   fragDrop:2  },
  { lv:5,  rate:68,  cost:1700,   sellPrice:8500,   fragDrop:3  },
  { lv:6,  rate:60,  cost:2500,   sellPrice:13000,  fragDrop:3  },
  { lv:7,  rate:52,  cost:3600,   sellPrice:19000,  fragDrop:4  },
  { lv:8,  rate:44,  cost:5000,   sellPrice:28000,  fragDrop:4  },
  { lv:9,  rate:37,  cost:7000,   sellPrice:40000,  fragDrop:5  },
  { lv:10, rate:30,  cost:9500,   sellPrice:57000,  fragDrop:6  },
  { lv:11, rate:24,  cost:13000,  sellPrice:79000,  fragDrop:7  },
  { lv:12, rate:19,  cost:17500,  sellPrice:108000, fragDrop:8  },
  { lv:13, rate:15,  cost:23000,  sellPrice:145000, fragDrop:10 },
  { lv:14, rate:11,  cost:30000,  sellPrice:195000, fragDrop:12 },
  { lv:15, rate:8,   cost:39000,  sellPrice:260000, fragDrop:14 },
  { lv:16, rate:6,   cost:50000,  sellPrice:345000, fragDrop:16 },
  { lv:17, rate:4,   cost:64000,  sellPrice:455000, fragDrop:18 },
  { lv:18, rate:3,   cost:80000,  sellPrice:595000, fragDrop:20 },
  { lv:19, rate:2,   cost:100000, sellPrice:800000, fragDrop:25 },
];

const WARP_ITEMS = [
  { targetLv:5,  fragCost:8,  label:"+5강 워프권",  emoji:"🌀" },
  { targetLv:9,  fragCost:20, label:"+9강 워프권",  emoji:"💫" },
  { targetLv:13, fragCost:45, label:"+13강 워프권", emoji:"⚡" },
  { targetLv:15, fragCost:70, label:"+15강 워프권", emoji:"🌟" },
];

const PROTECT_COST = 5000;

const ENHANCE_COLOR = (lv: number): string => {
  if (lv >= 18) return "#FF2D55";
  if (lv >= 15) return "#FF6B00";
  if (lv >= 12) return "#CC44FF";
  if (lv >= 9)  return "#FFD700";
  if (lv >= 6)  return "#00CEC9";
  if (lv >= 3)  return "#74B9FF";
  return "#AAAAAA";
};

const RARITY_LABEL: Record<string, string> = {
  common:"일반", rare:"희귀", epic:"영웅", legendary:"전설",
};
const RARITY_COLORS: Record<string, { bg:string; border:string; text:string }> = {
  common:    { bg:"#f0f0f0", border:"#ccc",    text:"#666"    },
  rare:      { bg:"#e8f4fd", border:"#74B9FF", text:"#0984e3" },
  epic:      { bg:"#f0eeff", border:"#A29BFE", text:"#6c5ce7" },
  legendary: { bg:"#fffbe8", border:"#FFD700", text:"#e17055" },
};

const MOCK_GALLERY = [
  { id:1, name:"별이",   emoji:"🌟", rarity:"legendary", color:"#FFD700", imageUrl:null as string|null },
  { id:2, name:"뭉이",   emoji:"🐻", rarity:"rare",      color:"#74B9FF", imageUrl:null as string|null },
  { id:3, name:"초코",   emoji:"🍫", rarity:"epic",      color:"#A29BFE", imageUrl:null as string|null },
  { id:4, name:"솜사탕", emoji:"🍬", rarity:"common",    color:"#FD79A8", imageUrl:null as string|null },
  { id:5, name:"구름이", emoji:"☁️", rarity:"legendary", color:"#00CEC9", imageUrl:null as string|null },
  { id:6, name:"복숭아", emoji:"🍑", rarity:"rare",      color:"#FDCB6E", imageUrl:null as string|null },
];

// ── SUB COMPONENTS ──────────────────────────

function FloatingParticle({ style }: { style: React.CSSProperties }) {
  return (
    <div style={{
      position:"absolute", borderRadius:"50%", pointerEvents:"none",
      animation:"float-up 4s ease-in-out infinite", ...style,
    }} />
  );
}

function StarBurst({ x, y, onDone }: { x:number; y:number; onDone:()=>void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{ position:"fixed", left:x-40, top:y-40, width:80, height:80, pointerEvents:"none", zIndex:9999 }}>
      {["✨","⭐","💫","🌟","✨","⭐","💫"].map((s, i) => (
        <span
          key={i}
          style={{
            position:"absolute", fontSize:20, left:"50%", top:"50%", opacity:0,
            animation:`burst-out 1s ease-out ${i * 0.06}s forwards`,
            ["--angle" as string]: `${(360 / 7) * i}deg`,
          }}
        >{s}</span>
      ))}
    </div>
  );
}

function EnhBadge({ lv, size = 1 }: { lv:number; size?:number }) {
  const color = ENHANCE_COLOR(lv);
  return (
    <div style={{
      display:"inline-flex", alignItems:"center", justifyContent:"center",
      background: lv === 0 ? "#e8e8e8" : `linear-gradient(135deg,${color}DD,${color})`,
      color: lv === 0 ? "#888" : "white",
      fontWeight:900, fontFamily:"inherit",
      fontSize: 13 * size,
      padding: `${4 * size}px ${11 * size}px`,
      borderRadius: 8 * size,
      boxShadow: lv >= 10
        ? `0 0 ${10 * size}px ${5 * size}px ${color}66`
        : `0 2px ${5 * size}px ${color}44`,
      border: `${1.5 * size}px solid ${lv === 0 ? "#ccc" : color}`,
      letterSpacing: 0.5, whiteSpace:"nowrap", transition:"all .3s",
    }}>
      {lv === 0 ? "강화 전" : `+${lv}강`}
    </div>
  );
}

// ── MAIN ────────────────────────────────────

type TabType    = "gallery" | "enhance";
type SubTabType = "enhance" | "shop";
type ResultType = "break" | "protected" | null;

interface GalleryItem {
  id: number;
  name: string;
  emoji: string;
  rarity: string;
  color: string;
  imageUrl: string | null;
}

interface Spark { id:number; x:number; y:number; }

export default function Page() {
  const [tab, setTab]         = useState<TabType>("gallery");
  const [enhSubTab, setEnhSub] = useState<SubTabType>("enhance");

  // 갤러리
  const [gallery, setGallery] = useState<GalleryItem[]>(MOCK_GALLERY);
  const [hoverCard, setHover] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");

  // 강화
  const [enhLv, setEnhLv]           = useState(0);
  const [gold, setGold]             = useState(30000);
  const [fragments, setFragments]   = useState<Record<string, number>>({});
  const [protectCount, setProtect]  = useState(2);
  const [useProtect, setUseProtect] = useState(false);
  const [result, setResult]         = useState<ResultType>(null);
  const [sparks, setSparks]         = useState<Spark[]>([]);
  const [showTable, setShowTable]   = useState(false);

  // ref 타입 수정 (빌드 에러 원인)
  const imgRef = useRef<HTMLDivElement | null>(null);

  const CHAR_COLOR = "#A29BFE";

  const LEVEL_IMAGES: (string | null)[] = [
    "/enhance/lv0.png",
    "/enhance/lv1.png",
    "/enhance/lv2.png",
    "/enhance/lv3.png",
    "/enhance/lv4.png",
    "/enhance/lv5.png",
    "/enhance/lv6.png",
    "/enhance/lv7.png",
    "/enhance/lv8.png",
    "/enhance/lv9.png",
    "/enhance/lv10.png",
    "/enhance/lv11.png",
    "/enhance/lv12.png",
    "/enhance/lv13.png",
    "/enhance/lv14.png",
    "/enhance/lv15.png",
    "/enhance/lv16.png",
    "/enhance/lv17.png",
    "/enhance/lv18.png",
    "/enhance/lv19.png",
    "/enhance/lv20.png",
  ];

  const curImage   = LEVEL_IMAGES[enhLv] ?? null;
  const totalFrags = Object.values(fragments).reduce((s, v) => s + v, 0);
  const curRow     = TABLE[enhLv];
  const canEnhance = enhLv < 20 && gold >= curRow.cost && !result;
  const canSell    = enhLv > 0 && !result;
  const ownedFrags = Object.entries(fragments)
    .filter(([, v]) => v > 0)
    .sort((a, b) => +a[0] - +b[0]);

  const handleEnhance = () => {
    if (!canEnhance) return;
    setGold(g => g - curRow.cost);
    setResult(null);

    const ok = Math.random() * 100 < curRow.rate;
    if (ok) {
      setEnhLv(lv => lv + 1);
      if (imgRef.current) {
        const r = imgRef.current.getBoundingClientRect();
        setSparks(prev => [...prev, { id: Date.now(), x: r.left + r.width / 2, y: r.top + r.height / 2 }]);
      }
    } else {
      if (useProtect && protectCount > 0) {
        setProtect(p => p - 1);
        setResult("protected");
      } else {
        const key = String(enhLv);
        setFragments(prev => ({ ...prev, [key]: (prev[key] || 0) + curRow.fragDrop }));
        setEnhLv(0);
        setResult("break");
      }
    }
  };

  const handleSell = () => {
    if (!canSell) return;
    setGold(g => g + TABLE[enhLv].sellPrice);
    setEnhLv(0);
    setResult(null);
  };

  const buyProtect = () => {
    if (gold < PROTECT_COST) return;
    setGold(g => g - PROTECT_COST);
    setProtect(p => p + 1);
  };

  const handleWarp = (item: typeof WARP_ITEMS[number]) => {
    const key = String(item.targetLv);
    if ((fragments[key] || 0) < item.fragCost) return;
    setFragments(prev => ({ ...prev, [key]: prev[key] - item.fragCost }));
    setEnhLv(item.targetLv);
    setResult(null);
    setEnhSub("enhance");
  };

  const handleAddChar = () => {
    if (!newName.trim()) return;
    const emojis = ["🐱","🐰","🐹","🦊","🐸","🐧","🦄","🐝","🌸","🦋"];
    const colors  = ["#FFB8C1","#B8D4FF","#C1FFD7","#FFE8B8","#E8B8FF","#B8FFFD"];
    const i = gallery.length;
    setGallery(prev => [...prev, {
      id: Date.now(), name: newName.trim(),
      emoji: emojis[i % 10], rarity: "common",
      color: colors[i % 6], imageUrl: null,
    }]);
    setNewName("");
    setAddOpen(false);
  };

  const bgParticles = Array.from({ length: 14 }, (_, i) => ({
    width:  `${6 + (i * 3.7) % 10}px`,
    height: `${6 + (i * 3.7) % 10}px`,
    left:   `${(i * 17 + 5) % 100}%`,
    top:    `${(i * 23 + 10) % 100}%`,
    background: ["#FFD6E0","#FFE8CC","#D4F1F4","#E8D5FF","#FFEAA7","#DFE6E9"][i % 6],
    animationDelay:    `${(i * 0.6) % 4}s`,
    animationDuration: `${3 + (i % 3)}s`,
    opacity: 0.4,
  }));

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#FFF0F5 0%,#F0F4FF 50%,#F5FFF0 100%)", fontFamily:"'Nunito','Noto Sans KR',sans-serif", position:"relative", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes float-up{0%,100%{transform:translateY(0);opacity:.4;}50%{transform:translateY(-14px);opacity:.6;}}
        @keyframes wiggle{0%,100%{transform:rotate(-5deg);}50%{transform:rotate(5deg);}}
        @keyframes pop-in{0%{transform:scale(.6) translateY(20px);opacity:0;}70%{transform:scale(1.06) translateY(-3px);opacity:1;}100%{transform:scale(1) translateY(0);opacity:1;}}
        @keyframes slide-up{from{transform:translateY(22px);opacity:0;}to{transform:translateY(0);opacity:1;}}
        @keyframes shimmer{0%{background-position:-300px 0;}100%{background-position:300px 0;}}
        @keyframes burst-out{0%{transform:translate(-50%,-50%) rotate(var(--angle)) translateX(0) scale(1);opacity:1;}100%{transform:translate(-50%,-50%) rotate(var(--angle)) translateX(55px) scale(0);opacity:0;}}
        @keyframes tab-bounce{0%,100%{transform:translateY(0);}40%{transform:translateY(-5px);}}
        @keyframes ring-spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes ring-spin-rev{from{transform:rotate(0deg);}to{transform:rotate(-360deg);}}
        @keyframes rainbow-slide{0%{background-position:0% 0;}100%{background-position:200% 0;}}
        @keyframes glow-pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
        @keyframes break-fall{0%{transform:translateY(0) rotate(0) scale(1);opacity:1;}50%{transform:translateY(20px) rotate(15deg) scale(.7);opacity:.6;}100%{transform:translateY(55px) rotate(40deg) scale(.1);opacity:0;}}
        @keyframes protected-shake{0%,100%{transform:translateX(0);}20%{transform:translateX(-10px);}40%{transform:translateX(10px);}60%{transform:translateX(-6px);}80%{transform:translateX(6px);}}
        @keyframes result-pop{0%{transform:scale(0) rotate(-8deg);opacity:0;}55%{transform:scale(1.1) rotate(2deg);opacity:1;}100%{transform:scale(1) rotate(0);opacity:1;}}
        @keyframes frag-drop{0%{transform:translateY(-20px);opacity:0;}100%{transform:translateY(0);opacity:1;}}
        .char-card{transition:transform .22s cubic-bezier(.34,1.56,.64,1);cursor:pointer;animation:pop-in .4s cubic-bezier(.34,1.56,.64,1) both;}
        .char-card:hover{transform:translateY(-8px) scale(1.04);}
        .tab-btn{transition:all .2s cubic-bezier(.34,1.56,.64,1);border:none;cursor:pointer;}
        .tab-btn:hover{transform:translateY(-3px) scale(1.05);}
        .tab-btn.active{animation:tab-bounce .4s ease;}
        .sub-tab-btn{transition:all .18s ease;border:none;cursor:pointer;}
        .action-btn{transition:all .16s cubic-bezier(.34,1.56,.64,1);border:none;cursor:pointer;position:relative;overflow:hidden;}
        .action-btn:hover:not(:disabled){transform:scale(1.05) translateY(-2px);}
        .action-btn:active:not(:disabled){transform:scale(.95);}
        .action-btn:disabled{opacity:.45;cursor:not-allowed;}
        .modal-overlay{position:fixed;inset:0;background:rgba(40,10,60,.4);backdrop-filter:blur(10px);z-index:200;display:flex;align-items:center;justify-content:center;}
        .modal-box{background:white;border-radius:24px;padding:30px;box-shadow:0 20px 60px rgba(100,0,160,.22);animation:pop-in .3s cubic-bezier(.34,1.56,.64,1);min-width:300px;}
        input:focus{outline:none;}
        .img-break{animation:break-fall .75s ease-in forwards;}
        .img-protected{animation:protected-shake .5s ease;}
      `}</style>

      {bgParticles.map((p, i) => <FloatingParticle key={i} style={p as React.CSSProperties} />)}
      {sparks.map(s => (
        <StarBurst key={s.id} x={s.x} y={s.y} onDone={() => setSparks(p => p.filter(x => x.id !== s.id))} />
      ))}

      {/* HEADER */}
      <div style={{ textAlign:"center", padding:"36px 20px 18px" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:4 }}>
          <span style={{ fontSize:30, display:"inline-block", animation:"wiggle 2s ease-in-out infinite" }}>🎀</span>
          <h1 style={{ fontSize:32, fontWeight:900, background:"linear-gradient(135deg,#FF6B9D,#C44DFF,#4D79FF)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:-1, lineHeight:1 }}>캐릭터 월드</h1>
          <span style={{ fontSize:30, display:"inline-block", animation:"wiggle 2s ease-in-out infinite", animationDelay:".5s" }}>🎀</span>
        </div>
        <p style={{ color:"#C08BAB", fontSize:12, fontWeight:600, letterSpacing:2 }}>CHARACTER WORLD ✦ 나만의 컬렉션</p>
      </div>

      {/* 메인 탭 */}
      <div style={{ display:"flex", justifyContent:"center", gap:10, marginBottom:22 }}>
        {([{ key:"gallery", label:"🖼️ 갤러리" }, { key:"enhance", label:"⚔️ 강화하기" }] as { key:TabType; label:string }[]).map(t => (
          <button key={t.key} className={`tab-btn${tab === t.key ? " active" : ""}`}
            onClick={() => setTab(t.key)}
            style={{
              padding:"10px 26px", borderRadius:50, fontSize:14, fontWeight:800, fontFamily:"inherit",
              background: tab === t.key ? "linear-gradient(135deg,#FF6B9D,#C44DFF)" : "white",
              color: tab === t.key ? "white" : "#B07090",
              boxShadow: tab === t.key ? "0 5px 16px rgba(196,77,255,.35)" : "0 3px 10px rgba(200,120,180,.12)",
              border: tab === t.key ? "none" : "2.5px solid #F0D0E0",
            }}>{t.label}</button>
        ))}
      </div>

      {/* ══ GALLERY ══ */}
      {tab === "gallery" && (
        <div style={{ maxWidth:840, margin:"0 auto", padding:"0 16px 60px", animation:"slide-up .4s ease" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <p style={{ color:"#C08BAB", fontWeight:700, fontSize:13 }}>
              총 <span style={{ color:"#FF6B9D", fontSize:16 }}>{gallery.length}</span>마리
            </p>
            <button onClick={() => setAddOpen(true)}
              style={{ width:40, height:40, borderRadius:"50%", fontSize:18, color:"white", background:"linear-gradient(135deg,#FF6B9D,#C44DFF)", border:"none", cursor:"pointer", boxShadow:"0 4px 14px rgba(196,77,255,.35)", display:"flex", alignItems:"center", justifyContent:"center", transition:"transform .18s cubic-bezier(.34,1.56,.64,1)" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.12) rotate(8deg)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>+</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(136px,1fr))", gap:14 }}>
            {gallery.map((c, i) => {
              const rc = RARITY_COLORS[c.rarity];
              return (
                <div key={c.id} className="char-card"
                  style={{ animationDelay:`${i * 0.07}s`, background:`linear-gradient(145deg,white,${c.color}18)`, border:`2.5px solid ${c.color}66`, borderRadius:22, padding:"18px 12px 14px", textAlign:"center", boxShadow:`0 4px 16px ${c.color}28`, position:"relative", overflow:"hidden" }}
                  onMouseEnter={() => setHover(c.id)} onMouseLeave={() => setHover(null)}>
                  <div style={{ position:"absolute", top:8, right:8, background:rc.bg, border:`1.5px solid ${rc.border}`, color:rc.text, borderRadius:20, fontSize:9, fontWeight:800, padding:"2px 6px" }}>{RARITY_LABEL[c.rarity]}</div>
                  <div style={{ width:70, height:70, borderRadius:"50%", background:c.imageUrl ? `url(${c.imageUrl}) center/cover` : `radial-gradient(circle at 35% 35%,${c.color}44,${c.color}BB)`, margin:"0 auto 10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, boxShadow:`0 4px 12px ${c.color}55`, border:`3px solid ${c.color}66`, transition:"transform .2s", transform:hoverCard === c.id ? "scale(1.1) rotate(7deg)" : "scale(1)" }}>
                    {!c.imageUrl && c.emoji}
                  </div>
                  <div style={{ fontWeight:800, fontSize:13, color:"#3D2D4D" }}>{c.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ ENHANCE ══ */}
      {tab === "enhance" && (
        <div style={{ maxWidth:440, margin:"0 auto", padding:"0 14px 60px", animation:"slide-up .4s ease" }}>

          {/* 서브 탭 */}
          <div style={{ display:"flex", background:"white", borderRadius:16, padding:4, marginBottom:14, boxShadow:"0 2px 10px rgba(200,100,180,.1)", border:"1.5px solid #F0D0E8", gap:4 }}>
            {([{ key:"enhance", label:"⚔️ 강화하기" }, { key:"shop", label:"🏪 상점" }] as { key:SubTabType; label:string }[]).map(t => (
              <button key={t.key} className="sub-tab-btn"
                onClick={() => setEnhSub(t.key)}
                style={{ flex:1, padding:"9px 0", borderRadius:12, fontSize:13, fontWeight:800, fontFamily:"inherit", background:enhSubTab === t.key ? "linear-gradient(135deg,#FF6B9D,#C44DFF)" : "transparent", color:enhSubTab === t.key ? "white" : "#C08BAB", boxShadow:enhSubTab === t.key ? "0 3px 10px rgba(196,77,255,.3)" : "none" }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* 상태 바 */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
            {[
              { icon:"💰", label:"골드",   value:`${gold.toLocaleString()}G`, color:"#E17055" },
              { icon:"🛡️", label:"방지권", value:`${protectCount}개`,          color:"#6C5CE7" },
              { icon:"🔮", label:"파편",   value:`${totalFrags}개`,            color:"#C44DFF" },
            ].map(s => (
              <div key={s.label} style={{ background:"white", borderRadius:13, padding:"8px 10px", textAlign:"center", boxShadow:"0 2px 8px rgba(200,100,180,.09)", border:"1.5px solid #F0D0E8" }}>
                <div style={{ fontSize:15, marginBottom:1 }}>{s.icon}</div>
                <div style={{ fontSize:9, color:"#C0A0B8", fontWeight:700 }}>{s.label}</div>
                <div style={{ fontSize:13, fontWeight:900, color:s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* ── 강화하기 서브탭 ── */}
          {enhSubTab === "enhance" && (
            <>
              <div style={{ background:"white", borderRadius:26, overflow:"hidden", boxShadow:"0 12px 38px rgba(160,70,180,.15)", border:"2.5px solid #F0D0E8", marginBottom:12, position:"relative" }}>
                <div style={{ height:5, background:"linear-gradient(90deg,#FF6B9D,#C44DFF,#74B9FF,#55EFC4,#FDCB6E,#FF6B9D,#C44DFF)", backgroundSize:"200% 100%", animation:"rainbow-slide 3s linear infinite" }} />

                <div style={{ padding:"14px 18px 0", textAlign:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                    <EnhBadge lv={enhLv} size={1.25} />
                    {enhLv < 20 && (
                      <>
                        <span style={{ fontSize:16, color:"#D0A0C0", fontWeight:900 }}>→</span>
                        <EnhBadge lv={enhLv + 1} size={1.25} />
                      </>
                    )}
                    {enhLv === 20 && <span style={{ fontSize:13, fontWeight:800, color:"#FFD700", marginLeft:6 }}>🏆 최대!</span>}
                  </div>
                </div>

                <div style={{ padding:"20px 18px 14px", display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{ position:"relative", marginBottom:14 }}>
                    {enhLv >= 6 && (
                      <div style={{ position:"absolute", inset:-24, borderRadius:"50%", background:`radial-gradient(circle,${ENHANCE_COLOR(enhLv)}44 0%,transparent 68%)`, animation:"glow-pulse 1.4s ease-in-out infinite", pointerEvents:"none" }} />
                    )}
                    {enhLv >= 10 && (
                      <>
                        <div style={{ position:"absolute", inset:-13, borderRadius:"50%", border:`2.5px dashed ${ENHANCE_COLOR(enhLv)}88`, animation:"ring-spin 3s linear infinite", pointerEvents:"none" }} />
                        <div style={{ position:"absolute", inset:-22, borderRadius:"50%", border:`1.5px dashed ${ENHANCE_COLOR(enhLv)}44`, animation:"ring-spin-rev 4.5s linear infinite", pointerEvents:"none" }} />
                      </>
                    )}
                    {enhLv >= 15 && (
                      <div style={{ position:"absolute", inset:-32, borderRadius:"50%", border:`1px dashed ${ENHANCE_COLOR(enhLv)}33`, animation:"ring-spin 6s linear infinite", pointerEvents:"none" }} />
                    )}

                    <div
                      ref={imgRef}
                      className={result === "break" ? "img-break" : result === "protected" ? "img-protected" : ""}
                      style={{
                        width:155, height:155, borderRadius:"50%",
                        background: curImage
                          ? `url(${curImage}) center/cover`
                          : `radial-gradient(circle at 35% 30%,${CHAR_COLOR}55,${CHAR_COLOR}EE)`,
                        backgroundSize:"cover",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        border:`4.5px solid ${ENHANCE_COLOR(enhLv)}`,
                        boxShadow:`0 6px 26px ${ENHANCE_COLOR(enhLv)}55, 0 0 0 3px ${ENHANCE_COLOR(enhLv)}33`,
                        position:"relative", transition:"border-color .4s,box-shadow .4s", overflow:"hidden",
                      }}
                    >
                      {!curImage && <div style={{ fontSize:60, userSelect:"none" }}>✨</div>}
                    </div>

                    <div style={{ position:"absolute", bottom:-9, left:"50%", transform:"translateX(-50%)", background:enhLv === 0 ? "#e8e8e8" : `linear-gradient(135deg,${ENHANCE_COLOR(enhLv)}CC,${ENHANCE_COLOR(enhLv)})`, color:enhLv === 0 ? "#888" : "white", fontSize:14, fontWeight:900, padding:"3px 16px", borderRadius:20, boxShadow:enhLv >= 10 ? `0 0 14px 4px ${ENHANCE_COLOR(enhLv)}88` : `0 2px 8px ${ENHANCE_COLOR(enhLv)}55`, border:"2.5px solid white", whiteSpace:"nowrap" }}>
                      {enhLv === 0 ? "강화 전" : `+${enhLv}강`}
                    </div>
                  </div>

                  {canSell && (
                    <button onClick={handleSell}
                      style={{ marginTop:6, background:"none", border:"1.5px solid #F0D0E0", borderRadius:10, padding:"5px 14px", color:"#C08BAB", fontSize:11, fontWeight:700, fontFamily:"inherit", cursor:"pointer", transition:"all .16s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#FFF0F8"; e.currentTarget.style.borderColor = "#FF6B9D"; e.currentTarget.style.color = "#FF6B9D"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "#F0D0E0"; e.currentTarget.style.color = "#C08BAB"; }}>
                      💸 {TABLE[enhLv].sellPrice.toLocaleString()}G에 팔기
                    </button>
                  )}
                </div>

                {enhLv < 20 && (
                  <div style={{ padding:"0 18px 16px" }}>
                    <div style={{ background:"#F8F0F8", borderRadius:14, padding:"11px 13px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:"#C08BAB" }}>성공 확률</span>
                        <span style={{ fontSize:14, fontWeight:900, color:curRow.rate >= 60 ? "#00B894" : curRow.rate >= 30 ? "#FDCB6E" : "#FF7675" }}>{curRow.rate}%</span>
                      </div>
                      <div style={{ height:9, background:"#EDD8E8", borderRadius:9, overflow:"hidden", marginBottom:6 }}>
                        <div style={{ height:"100%", borderRadius:9, width:`${curRow.rate}%`, transition:"width .5s", background:curRow.rate >= 60 ? "linear-gradient(90deg,#00B894,#55EFC4)" : curRow.rate >= 30 ? "linear-gradient(90deg,#FDCB6E,#E17055)" : "linear-gradient(90deg,#FF7675,#D63031)", position:"relative", overflow:"hidden" }}>
                          <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent)", backgroundSize:"80px 100%", animation:"shimmer 1.3s linear infinite" }} />
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:3, marginBottom:7 }}>
                        {Array.from({ length:10 }, (_, i) => {
                          const f = Math.round(curRow.rate / 10) > i;
                          return <div key={i} style={{ flex:1, height:3, borderRadius:3, transition:"background .4s", background:f ? (curRow.rate >= 60 ? "#55EFC4" : curRow.rate >= 30 ? "#FDCB6E" : "#FF7675") : "#EDD8E8" }} />;
                        })}
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between" }}>
                        <span style={{ fontSize:10, fontWeight:700, color:"#C08BAB" }}>💰 비용: <b style={{ color:gold >= curRow.cost ? "#E17055" : "#FF3B30" }}>{curRow.cost.toLocaleString()}G</b></span>
                        <span style={{ fontSize:10, fontWeight:700, color:"#FF3B30" }}>💥 실패: 파괴 {curRow.fragDrop > 0 ? `(파편 x${curRow.fragDrop})` : ""}</span>
                      </div>
                    </div>

                    {protectCount > 0 && (
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:8, background:"#F0EEFF", borderRadius:12, padding:"9px 12px", border:"1.5px solid #C44DFF33" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                          <span style={{ fontSize:16 }}>🛡️</span>
                          <div>
                            <div style={{ fontSize:11, fontWeight:800, color:"#6C5CE7" }}>방지권 사용</div>
                            <div style={{ fontSize:9, color:"#A090C0" }}>파괴 시 레벨 유지 ({protectCount}개 보유)</div>
                          </div>
                        </div>
                        <div onClick={() => setUseProtect(p => !p)}
                          style={{ width:38, height:21, borderRadius:10, background:useProtect ? "#6C5CE7" : "#DDD", position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0 }}>
                          <div style={{ position:"absolute", top:2.5, left:useProtect ? 19 : 2.5, width:16, height:16, borderRadius:"50%", background:"white", boxShadow:"0 1px 3px rgba(0,0,0,.2)", transition:"left .2s" }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 결과 배너 */}
              {result && (
                <div style={{ marginBottom:12, borderRadius:20, overflow:"hidden", animation:"result-pop .4s cubic-bezier(.34,1.56,.64,1)", boxShadow:result === "break" ? "0 6px 22px rgba(255,50,50,.25)" : "0 6px 22px rgba(108,92,231,.2)" }}>
                  {result === "break" && (
                    <div style={{ background:"linear-gradient(135deg,#FF3B30,#C0392B)", padding:"16px 20px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:curRow.fragDrop > 0 ? 6 : 0 }}>
                        <div style={{ fontSize:40, lineHeight:1 }}>💔</div>
                        <div>
                          <div style={{ fontWeight:900, fontSize:17, color:"white" }}>파괴됐어요!!</div>
                          <div style={{ fontSize:11, color:"rgba(255,255,255,.85)", marginTop:1 }}>0강으로 초기화됐어요 😱</div>
                        </div>
                      </div>
                      {curRow.fragDrop > 0 && (
                        <div style={{ background:"rgba(255,255,255,.15)", borderRadius:10, padding:"8px 12px", display:"flex", alignItems:"center", gap:8, animation:"frag-drop .5s ease-out" }}>
                          <span style={{ fontSize:18 }}>🔮</span>
                          <span style={{ fontSize:12, fontWeight:800, color:"white" }}>파편 x{curRow.fragDrop} 획득!</span>
                          <span style={{ fontSize:10, color:"rgba(255,255,255,.7)" }}>상점에서 워프권 교환 가능</span>
                        </div>
                      )}
                    </div>
                  )}
                  {result === "protected" && (
                    <div style={{ background:"linear-gradient(135deg,#6C5CE7,#A29BFE)", padding:"16px 20px", display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ fontSize:40, lineHeight:1 }}>🛡️</div>
                      <div>
                        <div style={{ fontWeight:900, fontSize:17, color:"white" }}>방지권 발동!</div>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,.85)", marginTop:1 }}>파괴를 막았어요! 레벨 유지</div>
                      </div>
                    </div>
                  )}
                  <button onClick={() => setResult(null)}
                    style={{ width:"100%", padding:"11px", border:"none", background:"rgba(0,0,0,.07)", fontFamily:"inherit", fontWeight:800, fontSize:12, cursor:"pointer", color:result === "break" ? "#FF8080" : "#9B8BFF" }}>
                    확인
                  </button>
                </div>
              )}

              {/* 강화 버튼 */}
              {enhLv < 20 && (
                <button className="action-btn" onClick={handleEnhance} disabled={!canEnhance || !!result}
                  style={{ width:"100%", padding:"17px", borderRadius:18, fontSize:17, fontWeight:900, fontFamily:"inherit", background:(!canEnhance || !!result) ? "#EEE8F4" : "linear-gradient(135deg,#FF6B9D,#C44DFF)", color:(!canEnhance || !!result) ? "#BBA0CC" : "white", boxShadow:(canEnhance && !result) ? "0 9px 24px rgba(196,77,255,.4)" : "none", letterSpacing:1, marginBottom:10 }}>
                  {canEnhance && !result && <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)", backgroundSize:"60% 100%", animation:"shimmer 2s linear infinite", pointerEvents:"none" }} />}
                  {gold < curRow.cost
                    ? "💰 골드 부족"
                    : <span style={{ position:"relative" }}>⚔️ 강화하기 ({curRow.cost.toLocaleString()}G)</span>
                  }
                </button>
              )}

              {enhLv === 20 && (
                <div style={{ textAlign:"center", padding:"15px", background:"linear-gradient(135deg,#FFD700,#FF8C00)", borderRadius:18, color:"white", fontWeight:900, fontSize:15, boxShadow:"0 6px 20px rgba(255,180,0,.4)", marginBottom:10 }}>
                  🏆 최대 강화 달성! 팔거나 자랑해봐요! 🏆
                </div>
              )}

              {ownedFrags.length > 0 && (
                <div style={{ background:"white", borderRadius:16, padding:"12px 14px", border:"2px solid #F0D0E8", marginBottom:10, boxShadow:"0 2px 10px rgba(200,100,180,.07)" }}>
                  <p style={{ fontSize:9, fontWeight:800, color:"#C0A0B8", letterSpacing:2, marginBottom:8 }}>🔮 보유 파편</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {ownedFrags.map(([lv, cnt]) => (
                      <div key={lv} style={{ display:"flex", alignItems:"center", gap:5, background:"#F8F0FF", border:"1.5px solid #C44DFF44", borderRadius:9, padding:"4px 9px" }}>
                        <EnhBadge lv={Number(lv)} size={0.76} />
                        <span style={{ fontSize:11, fontWeight:800, color:"#C44DFF" }}>파편 x{cnt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setShowTable(p => !p)}
                style={{ width:"100%", padding:"9px", borderRadius:12, border:"2px solid #F0D0E0", background:"white", fontFamily:"inherit", fontWeight:700, fontSize:11, cursor:"pointer", color:"#C08BAB", transition:"all .16s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#FFF0F8"; e.currentTarget.style.borderColor = "#FF6B9D"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#F0D0E0"; }}>
                📊 {showTable ? "확률표 닫기 ▲" : "강화 확률표 보기 ▼"}
              </button>

              {showTable && (
                <div style={{ marginTop:8, background:"white", borderRadius:16, border:"2px solid #F0D0E0", overflow:"hidden", animation:"slide-up .2s ease" }}>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11, fontFamily:"inherit" }}>
                      <thead>
                        <tr style={{ background:"linear-gradient(135deg,#FF6B9D14,#C44DFF14)" }}>
                          {["강화","성공률","실패","파편","비용","판매가"].map(h => (
                            <th key={h} style={{ padding:"8px 6px", fontWeight:800, color:"#C08BAB", textAlign:"center", whiteSpace:"nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {TABLE.map((row, i) => {
                          const cur = enhLv === row.lv;
                          return (
                            <tr key={i} style={{ background:cur ? "linear-gradient(135deg,#FF6B9D10,#C44DFF10)" : "", borderTop:"1px solid #F5E8F5" }}>
                              <td style={{ padding:"6px 6px", textAlign:"center" }}>
                                <EnhBadge lv={row.lv} size={0.76} />
                                {cur && <span style={{ fontSize:8, color:"#FF6B9D", fontWeight:800, marginLeft:2 }}>◀</span>}
                              </td>
                              <td style={{ padding:"6px 5px", textAlign:"center", fontWeight:800, color:row.rate >= 60 ? "#00B894" : row.rate >= 30 ? "#E17055" : "#FF3B30" }}>{row.rate}%</td>
                              <td style={{ padding:"6px 5px", textAlign:"center", fontSize:11, color:"#FF3B30" }}>💥</td>
                              <td style={{ padding:"6px 5px", textAlign:"center", fontSize:11, color:"#C44DFF", fontWeight:700 }}>{row.fragDrop > 0 ? `x${row.fragDrop}` : "—"}</td>
                              <td style={{ padding:"6px 5px", textAlign:"center", fontWeight:700, color:"#E17055", whiteSpace:"nowrap" }}>{row.cost > 0 ? `${row.cost.toLocaleString()}G` : "무료"}</td>
                              <td style={{ padding:"6px 5px", textAlign:"center", fontWeight:700, color:"#00B894", whiteSpace:"nowrap" }}>{row.sellPrice.toLocaleString()}G</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── 상점 서브탭 ── */}
          {enhSubTab === "shop" && (
            <div style={{ animation:"slide-up .3s ease" }}>
              <div style={{ background:"white", borderRadius:16, padding:"11px 16px", marginBottom:14, border:"2px solid #F0D0E8", boxShadow:"0 3px 10px rgba(200,100,180,.09)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:22 }}>💰</span>
                  <div>
                    <div style={{ fontSize:9, color:"#C0A0B8", fontWeight:700 }}>보유 골드</div>
                    <div style={{ fontSize:17, fontWeight:900, color:"#E17055" }}>{gold.toLocaleString()}G</div>
                  </div>
                </div>
                <button onClick={() => setGold(g => g + 20000)}
                  style={{ padding:"7px 14px", borderRadius:11, border:"none", background:"linear-gradient(135deg,#FF6B9D,#C44DFF)", color:"white", fontFamily:"inherit", fontWeight:800, fontSize:11, cursor:"pointer", boxShadow:"0 3px 10px rgba(196,77,255,.3)" }}>
                  +충전
                </button>
              </div>

              <div style={{ background:"white", borderRadius:20, padding:"16px", marginBottom:12, border:"2px solid #C44DFF28", boxShadow:"0 4px 16px rgba(108,92,231,.09)" }}>
                <p style={{ fontSize:9, fontWeight:800, color:"#C0A0B8", letterSpacing:2, marginBottom:12 }}>🛡️ 아이템</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                    <div style={{ width:50, height:50, borderRadius:14, background:"linear-gradient(135deg,#6C5CE7,#A29BFE)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, boxShadow:"0 4px 12px rgba(108,92,231,.35)" }}>🛡️</div>
                    <div>
                      <div style={{ fontWeight:900, fontSize:14, color:"#3D2D4D" }}>깨짐 방지권</div>
                      <div style={{ fontSize:10, color:"#A090C0", marginTop:2 }}>파괴 시 레벨 유지 (1회용)</div>
                      <div style={{ fontSize:12, fontWeight:900, color:"#6C5CE7", marginTop:3 }}>{PROTECT_COST.toLocaleString()}G</div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:10, color:"#C0A0B8", marginBottom:4 }}>보유 {protectCount}개</div>
                    <button className="action-btn" onClick={buyProtect} disabled={gold < PROTECT_COST}
                      style={{ padding:"8px 15px", borderRadius:11, border:"none", background:gold >= PROTECT_COST ? "linear-gradient(135deg,#6C5CE7,#A29BFE)" : "#EEE", color:gold >= PROTECT_COST ? "white" : "#AAA", fontFamily:"inherit", fontWeight:800, fontSize:12, cursor:"pointer", boxShadow:gold >= PROTECT_COST ? "0 3px 10px rgba(108,92,231,.3)" : "none" }}>
                      구매
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ background:"white", borderRadius:20, padding:"16px", border:"2px solid #FFD70028", boxShadow:"0 4px 16px rgba(255,180,0,.07)" }}>
                <p style={{ fontSize:9, fontWeight:800, color:"#C0A0B8", letterSpacing:2, marginBottom:4 }}>🌀 워프권</p>
                <p style={{ fontSize:10, color:"#C0A0B8", marginBottom:12 }}>강화 파괴 시 얻는 파편을 모아 특정 레벨로 워프해요!</p>

                {ownedFrags.length > 0 ? (
                  <div style={{ background:"#F8F0FF", borderRadius:11, padding:"8px 11px", marginBottom:12, border:"1.5px solid #C44DFF22" }}>
                    <p style={{ fontSize:8, fontWeight:800, color:"#C44DFF", marginBottom:5, letterSpacing:1 }}>🔮 보유 파편</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {ownedFrags.map(([lv, cnt]) => (
                        <div key={lv} style={{ display:"flex", alignItems:"center", gap:4, background:"white", border:"1.5px solid #C44DFF44", borderRadius:8, padding:"3px 7px" }}>
                          <EnhBadge lv={Number(lv)} size={0.7} />
                          <span style={{ fontSize:10, fontWeight:800, color:"#C44DFF" }}>x{cnt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ background:"#F8F0FF", borderRadius:11, padding:"10px 12px", marginBottom:12, textAlign:"center" }}>
                    <span style={{ fontSize:11, color:"#C0A0C0", fontWeight:600 }}>아직 파편이 없어요. 강화에 도전해봐요! 🔮</span>
                  </div>
                )}

                <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                  {WARP_ITEMS.map(item => {
                    const owned  = fragments[String(item.targetLv)] || 0;
                    const canBuy = owned >= item.fragCost;
                    return (
                      <div key={item.targetLv}
                        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, padding:"11px 13px", borderRadius:14, background:canBuy ? "linear-gradient(135deg,#FFFBE8,#FFF5CC)" : "#F8F8F8", border:`1.5px solid ${canBuy ? "#FFD70055" : "#EEE"}` }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:42, height:42, borderRadius:12, background:canBuy ? "linear-gradient(135deg,#FFD700,#FF8C00)" : "#DDD", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:canBuy ? "0 3px 10px rgba(255,180,0,.38)" : "none" }}>
                            {item.emoji}
                          </div>
                          <div>
                            <div style={{ fontWeight:900, fontSize:13, color:canBuy ? "#3D2D4D" : "#AAA" }}>{item.label}</div>
                            <div style={{ fontSize:10, color:canBuy ? "#C44DFF" : "#BBB", fontWeight:700, marginTop:2 }}>
                              🔮 {item.fragCost}개 필요 <span style={{ color:canBuy ? "#E17055" : "#CCC" }}>({item.targetLv}강 파편)</span>
                            </div>
                            <div style={{ fontSize:9, color:"#C0A0B8", marginTop:1 }}>보유: {owned}개</div>
                          </div>
                        </div>
                        <button className="action-btn" onClick={() => handleWarp(item)} disabled={!canBuy}
                          style={{ padding:"8px 14px", borderRadius:11, border:"none", flexShrink:0, background:canBuy ? "linear-gradient(135deg,#FFD700,#FF8C00)" : "#EEE", color:canBuy ? "white" : "#AAA", fontFamily:"inherit", fontWeight:800, fontSize:12, cursor:"pointer", boxShadow:canBuy ? "0 3px 10px rgba(255,180,0,.35)" : "none" }}>
                          워프!
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 갤러리 추가 모달 */}
      {addOpen && (
        <div className="modal-overlay" onClick={() => setAddOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign:"center", marginBottom:18 }}>
              <div style={{ fontSize:36, marginBottom:5 }}>🌟</div>
              <h2 style={{ fontWeight:900, fontSize:19, color:"#3D2D4D" }}>새 캐릭터 추가</h2>
            </div>
            <input value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddChar()}
              placeholder="캐릭터 이름 🎀"
              style={{ width:"100%", padding:"12px 15px", border:"2.5px solid #F0D0E0", borderRadius:13, fontSize:14, fontFamily:"inherit", fontWeight:700, color:"#3D2D4D", background:"#FFF8FB", marginBottom:13 }} />
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setAddOpen(false)}
                style={{ flex:1, padding:"11px", borderRadius:11, border:"2px solid #F0D0E0", background:"white", fontFamily:"inherit", fontWeight:800, fontSize:12, color:"#C08BAB", cursor:"pointer" }}>
                취소
              </button>
              <button onClick={handleAddChar}
                style={{ flex:2, padding:"11px", borderRadius:11, border:"none", background:"linear-gradient(135deg,#FF6B9D,#C44DFF)", fontFamily:"inherit", fontWeight:900, fontSize:12, color:"white", cursor:"pointer", boxShadow:"0 5px 14px rgba(196,77,255,.3)" }}>
                ✨ 추가하기
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign:"center", paddingBottom:24, color:"#D0A8C0", fontSize:10, fontWeight:600 }}>✦ made with 💕 ✦</div>
    </div>
  );
}