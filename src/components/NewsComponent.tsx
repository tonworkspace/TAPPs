import React from 'react';

const NewsComponent: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-start gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200">
              <span className="text-xs font-semibold text-blue-700">TAPPs Token</span>
              <span className="text-[10px] text-blue-600">New Meme Era</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">🐸 TAPPs Token — The New Meme Era Begins!</h1>
            <p className="text-slate-700 text-sm md:text-base max-w-2xl">
              Introducing $TAPPs — the community-powered, multi-chain meme coin. We start on TON and expand to SUI, BSC, SOL, and ETH.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-w-[180px]">
            <a href="https://t.me/TAPPs_Chat" target="_blank" rel="noopener noreferrer" className="w-full text-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold">Join Telegram</a>
            <a href="https://x.com/TAPP_Whale" target="_blank" rel="noopener noreferrer" className="w-full text-center px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold border border-slate-200">Follow on X</a>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Multi‑Chain</div>
            <div className="text-sm font-semibold text-slate-900">TON → SUI • BSC • SOL • ETH</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Community‑Powered</div>
            <div className="text-sm font-semibold text-slate-900">Meme-first culture • Whale circle</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Early Access</div>
            <div className="text-sm font-semibold text-slate-900">Buy & Sell Program before listing</div>
          </div>
        </div>
      </div>

      {/* Early Program */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-start gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">💎🔥 Early Buy & Sell Program</h2>
            <p className="text-sm text-slate-700 mt-1 max-w-3xl">
              Buy $TAPPs before it’s listed, hold strong to unlock early community benefits, and sell later once live on major DEXs. The earlier you buy, the bigger your upside at launch.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-700 list-disc pl-5">
              <li>Buy before listing</li>
              <li>Hold for early perks</li>
              <li>Sell post‑launch on DEXs</li>
            </ul>
          </div>
          <div className="min-w-[180px]">
            <a href="https://t.me/TAPPs_Chat" target="_blank" rel="noopener noreferrer" className="w-full inline-block text-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold">Get Early Access</a>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">🧭 TAPPs Roadmap</h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            <div className="text-sm font-semibold text-slate-900">📍 Phase 1 — TON Launch (Now Live!)</div>
            <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
              <li>TAPPs Mining Goes Live</li>
              <li>Buy & Sell Program Starts</li>
              <li>Community Growth and Airdrop Events</li>
              <li>TAPPs Whale Community Activation</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            <div className="text-sm font-semibold text-slate-900">📍 Phase 2 — Multi‑Chain Expansion</div>
            <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
              <li>Bridge to SUI, BSC, SOL, and ETH</li>
              <li>Meme Marketing Campaign</li>
              <li>Partnerships with TON Projects</li>
              <li>Listings on Community DEXs</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            <div className="text-sm font-semibold text-slate-900">📍 Phase 3 — Ecosystem Utility</div>
            <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
              <li>TAPPs NFT Series Launch</li>
              <li>Meme‑to‑Earn Platform</li>
              <li>Staking & Rewards Integration</li>
              <li>Cross‑chain Mining Expansion</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            <div className="text-sm font-semibold text-slate-900">📍 Phase 4 — Global Recognition</div>
            <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
              <li>CEX Listings</li>
              <li>Worldwide Marketing Push</li>
              <li>Community Governance</li>
              <li>Meme Festival & TAPPs Merch</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Community & Hashtags */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">🌊 Be Early. Be a Whale. Be TAPP’d In.</h3>
            <p className="text-sm text-slate-700 mt-1">Enter before market listing — don’t wait for the hype, create it.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href="https://t.me/TAPPs_Chat" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">Join Community</a>
            <a href="https://x.com/TAPP_Whale" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200">Follow on X</a>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-600">
          <span className="font-semibold">Hashtags:</span> #TAPPsToken #TON #MemeCoin #CryptoLaunch #Web3 #TAPPsWhale
        </div>
      </div>
    </div>
  );
};

export default NewsComponent;