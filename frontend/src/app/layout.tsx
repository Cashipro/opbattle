import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpBattle",
  description: "Professional PUBG Tournament Platform",
  keywords: [
    "PUBG",
    "Tournament",
    "Esports",
    "Gaming",
    "OpBattle"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>

        {children}

      </body>
    </html>
  );
}
