"use client";
import { useState, useEffect } from "react";
import { Character } from "@/types";
import { MOCK_CHARACTERS } from "@/lib/constants";

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>(MOCK_CHARACTERS);
  const [loading, setLoading]       = useState(false);

  // DB 연동 후엔 아래 fetch 로직으로 교체하세요
  // useEffect(() => {
  //   setLoading(true);
  //   fetch("/api/characters")
  //     .then(r => r.json())
  //     .then(data => setCharacters(data))
  //     .finally(() => setLoading(false));
  // }, []);

  const addCharacter = (char: Character) =>
    setCharacters(prev => [...prev, char]);

  const updateCharacter = (updated: Character) =>
    setCharacters(prev => prev.map(c => c.id === updated.id ? updated : c));

  return { characters, loading, addCharacter, updateCharacter };
}
