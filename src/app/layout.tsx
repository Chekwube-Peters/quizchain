import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/shared/SessionProvider";

export const metadata: Metadata = {
  title: "QuizChain — Web3 Quiz Platform",
  description:
    "The ultimate community quiz platform. AI-generated questions, live multiplayer, Web3 rewards, NFT badges, and BTC prizes on Rootstock.",
  keywords: ["quiz", "web3", "blockchain", "bitcoin", "rootstock", "multiplayer", "education"],
  openGraph: {
    title: "QuizChain — Web3 Quiz Platform",
    description: "AI-powered quizzes with live multiplayer, NFT badges, and crypto rewards",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-900 text-slate-100 antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
