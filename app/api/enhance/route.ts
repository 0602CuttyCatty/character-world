import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calcSuccessRate } from "@/lib/constants";

// POST /api/enhance — 강화 시도 (확률 계산은 반드시 서버에서!)
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { characterId } = await req.json();
  if (!characterId) return NextResponse.json({ error: "characterId required" }, { status: 400 });

  const character = await prisma.character.findFirst({
    where: { id: characterId, userId: session.user.id },
  });
  if (!character) return NextResponse.json({ error: "Character not found" }, { status: 404 });

  const rate    = calcSuccessRate(character.level);
  const success = Math.random() * 100 < rate;

  if (success) {
    const updated = await prisma.character.update({
      where: { id: character.id },
      data: { level: { increment: 1 }, attack: { increment: 5 } },
    });
    return NextResponse.json({ success: true, character: updated });
  }

  return NextResponse.json({ success: false, character });
}
