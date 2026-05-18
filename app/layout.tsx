import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "캐릭터 월드 🎀",
  description: "나만의 귀여운 캐릭터 컬렉션",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
