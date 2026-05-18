import { Rarity } from "@/types";

export const RARITY_LABEL: Record<Rarity, string> = {
  common:    "일반",
  rare:      "희귀",
  epic:      "영웅",
  legendary: "전설",
};

export const RARITY_COLORS: Record<Rarity, { bg: string; border: string; text: string }> = {
  common:    { bg: "#f0f0f0", border: "#ccc",    text: "#666"    },
  rare:      { bg: "#e8f4fd", border: "#74B9FF", text: "#0984e3" },
  epic:      { bg: "#f0eeff", border: "#A29BFE", text: "#6c5ce7" },
  legendary: { bg: "#fffbe8", border: "#FFD700", text: "#e17055" },
};

export const CHAR_EMOJIS = ["🐱","🐰","🐹","🦊","🐸","🐧","🦄","🐝","🌸","🦋"];
export const CHAR_COLORS = ["#FFB8C1","#B8D4FF","#C1FFD7","#FFE8B8","#E8B8FF","#B8FFFD"];

export const MOCK_CHARACTERS = [
  { id: 1, name: "별이",   level: 7, attack: 45, emoji: "🌟", rarity: "legendary" as Rarity, color: "#FFD700" },
  { id: 2, name: "뭉이",   level: 3, attack: 20, emoji: "🐻", rarity: "rare"      as Rarity, color: "#74B9FF" },
  { id: 3, name: "초코",   level: 5, attack: 33, emoji: "🍫", rarity: "epic"      as Rarity, color: "#A29BFE" },
  { id: 4, name: "솜사탕", level: 2, attack: 15, emoji: "🍬", rarity: "common"    as Rarity, color: "#FD79A8" },
  { id: 5, name: "구름이", level: 9, attack: 60, emoji: "☁️", rarity: "legendary" as Rarity, color: "#00CEC9" },
  { id: 6, name: "복숭아", level: 4, attack: 27, emoji: "🍑", rarity: "rare"      as Rarity, color: "#FDCB6E" },
];

/** 레벨별 강화 성공 확률 계산 */
export function calcSuccessRate(level: number): number {
  return Math.max(10, 90 - level * 8);
}
