import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PrimeReactProvider } from 'primereact/api';
import HeaderApp from "@/components/layout/headerApp";
import FooterApp from "@/components/layout/footerApp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MoradIA",
  description: "MoradIA é um planejador financeiro de mudança que usa IA para estimar o custo total de compra ou aluguel de imóveis, adicionando o orçamento de mobília e definindo metas de economia mensais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <PrimeReactProvider>
          <HeaderApp />
          <main className="max-w-4xl mx-auto p-5 text-center space-y-24 w-full grow">
            {children}
          </main>
          <FooterApp />
        </PrimeReactProvider>
      </body>
    </html>
  );
}
