import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// 강화 테이블 (서버에서 직접 정의 — 클라이언트 조작 방지)
const TABLE = [
  { lv:0,  rate:100, fragDrop:0  },
  { lv:1,  rate:90,  fragDrop:1  },
  { lv:2,  rate:85,  fragDrop:1  },
  { lv:3,  rate:80,  fragDrop:2  },
  { lv:4,  rate:74,  fragDrop:2  },
  { lv:5,  rate:68,  fragDrop:3  },
  { lv:6,  rate:60,  fragDrop:3  },
  { lv:7,  rate:52,  fragDrop:4  },
  { lv:8,  rate:44,  fragDrop:4  },
  { lv:9,  rate:37,  fragDrop:5  },
  { lv:10, rate:30,  fragDrop:6  },
  { lv:11, rate:24,  fragDrop:7  },
  { lv:12, rate:19,  fragDrop:8  },
  { lv:13, rate:15,  fragDrop:10 },
  { lv:14, rate:11,  fragDrop:12 },
  { lv:15, rate:8,   fragDrop:14 },
  { lv:16, rate:6,   fragDrop:16 },
  { lv:17, rate:4,   fragDrop:18 },
  { lv:18, rate:3,   fragDrop:20 },
  { lv:19, rate:2,   fragDrop:25 },
];

// POST /api/enhance — 강화 시도 (확률 계산은 반드시 서버에서!)
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { characterId, useProtect } = await req.json();
  if (!characterId) return NextResponse.json({ error: "characterId required" }, { status: 400 });

  const character = await prisma.character.findFirst({
    where: { id: characterId, userId: session.user.id },
  });
  if (!character) return NextResponse.json({ error: "Character not found" }, { status: 404 });
  if (character.enhLv >= 20) return NextResponse.json({ error: "Already max level" }, { status: 400 });

  const row     = TABLE[character.enhLv];
  const success = Math.random() * 100 < row.rate;

  if (success) {
    const updated = await prisma.character.update({
      where: { id: character.id },
      data: { enhLv: { increment: 1 }, attack: { increment: 5 } },
    });
    return NextResponse.json({ success: true, character: updated });
  }

  // 실패: 방지권 사용 여부 확인
  if (useProtect) {
    // 레벨 유지 (방지권 소모는 클라이언트 상태로 관리)
    return NextResponse.json({ success: false, result: "protected", character });
  }

  // 파괴: 0강으로 리셋
  const updated = await prisma.character.update({
    where: { id: character.id },
    data: { enhLv: 0, attack: 10 },
  });
  return NextResponse.json({ success: false, result: "break", fragDrop: row.fragDrop, character: updated });
}