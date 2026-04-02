import { Syne, DM_Mono } from "next/font/google";
import "./globals.css";
import LayoutClient from "@/components/LayoutClient";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${syne.variable} ${dmMono.variable}`}>
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}