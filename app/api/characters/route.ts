import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/characters
export async function GET() {
  try {
    const characters = await prisma.character.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(characters);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch characters" }, { status: 500 });
  }
}

// POST /api/characters
export async function POST(req: Request) {
  try {
    const { name, emoji, color, rarity, userId } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }
    const character = await prisma.character.create({
      data: { name, emoji, color, rarity, userId },
    });
    return NextResponse.json(character, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create character" }, { status: 500 });
  }
}