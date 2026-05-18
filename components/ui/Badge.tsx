import { Rarity } from "@/types";
import { RARITY_COLORS, RARITY_LABEL } from "@/lib/constants";

interface Props {
  rarity: Rarity;
  size?: "sm" | "md";
}

export default function Badge({ rarity, size = "sm" }: Props) {
  const rc = RARITY_COLORS[rarity];
  return (
    <span style={{
      background: rc.bg, border: `1.5px solid ${rc.border}`, color: rc.text,
      borderRadius: 20, fontWeight: 800,
      fontSize:  size === "sm" ? 10 : 12,
      padding:   size === "sm" ? "2px 7px" : "4px 12px",
    }}>
      {RARITY_LABEL[rarity]}
    </span>
  );
}
