export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface Character {
  id: number | string;
  name: string;
  level: number;
  attack: number;
  emoji: string;
  rarity: Rarity;
  color: string;
  imageUrl?: string | null;
  userId?: string;
  createdAt?: string;
}

export interface EnhanceResult {
  success: boolean;
  character?: Character;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}
