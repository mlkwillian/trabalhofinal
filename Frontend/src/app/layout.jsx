import { Syne, DM_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
});

export const metadata = {
  title: "ThermoGuard",
  description: "Controle de Temperatura",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${syne.variable} ${dmMono.variable} antialiased`}>
        <Sidebar/>
        {children}
      </body>
    </html>
  );
}
