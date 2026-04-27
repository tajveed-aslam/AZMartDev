import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { TopBar } from "@/components/layout/TopBar";
import { PageTransition } from "@/components/layout/PageTransition";
import { RouteProgress } from "@/components/layout/RouteProgress";
import { ChatBot } from "@/components/chat/ChatBot";

export const metadata: Metadata = {
  title: "A&Z Mart — Imported Goods Store",
  description: "Shop premium imported perfumes, shoes, electronics, jewellery, and toys.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <RouteProgress />
          <TopBar />
          <Header />
          <MobileNav />
          <main className="min-h-screen">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <ChatBot />
        </Providers>
      </body>
    </html>
  );
}
