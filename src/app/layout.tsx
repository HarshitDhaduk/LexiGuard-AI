import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LexiGuard AI — Legal Document Navigation & Negotiation Copilot",
  description:
    "Deconstruct legalese, audit predatory clauses, compare redline agreements, and generate market-standard counter-clauses with Google Gemini 2.5 Flash.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0b0f19] text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
