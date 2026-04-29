import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Stats from "@/components/landing/Stats";
import CTA from "@/components/landing/CTA";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <CTA />

      <footer className="bg-dark-800 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Q</span>
                </div>
                <span className="font-bold gradient-text">QuizChain</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                The Web3 quiz platform for communities, DAOs, and crypto education.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="/create" className="hover:text-white transition-colors">Create Quiz</a></li>
                <li><a href="/play" className="hover:text-white transition-colors">Join Quiz</a></li>
                <li><a href="/tournaments" className="hover:text-white transition-colors">Tournaments</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Categories</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>⛓️ Blockchain</li>
                <li>🔗 Rootstock</li>
                <li>₿ Bitcoin</li>
                <li>🎯 Custom Topics</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Web3</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>🔗 Rootstock Network</li>
                <li>💎 NFT Badges</li>
                <li>🏆 POAP Certificates</li>
                <li>⚡ RBTC Rewards</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">© 2025 QuizChain. Built for Web3 communities.</p>
            <div className="flex gap-4 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
