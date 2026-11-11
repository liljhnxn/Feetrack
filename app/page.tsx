"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DashboardStats } from "@/components/DashboardStats";
import { RegisterFeeSection } from "@/components/RegisterFeeSection";
import { FeeLookupSection } from "@/components/FeeLookupSection";
import { MyFeesSection } from "@/components/MyFeesSection";
import { DEFAULT_CONTRACT_ADDRESS } from "@/lib/wagmi";
import { ShieldCheck, Sparkles, ExternalLink, Globe, HelpCircle } from "lucide-react";

export default function Home() {
  const [contractAddress] = useState<`0x${string}`>(
    DEFAULT_CONTRACT_ADDRESS
  );

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFeeRegistered = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAddBotchainToMetaMask = async () => {
    if (typeof window !== "undefined" && (window as unknown as { ethereum?: { request: (args: unknown) => Promise<unknown> } }).ethereum) {
      try {
        await (window as unknown as { ethereum: { request: (args: unknown) => Promise<unknown> } }).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x2A5", // 677 in hex
              chainName: "Botchain Mainnet",
              nativeCurrency: {
                name: "Bot",
                symbol: "BOT",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.botchain.ai"],
              blockExplorerUrls: ["https://scan.botchain.ai"],
            },
          ],
        });
      } catch (err) {
        console.error("Failed to add Botchain to wallet:", err);
      }
    } else {
      alert("Please install MetaMask to add the Botchain Mainnet automatically.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-charcoal-950 text-charcoal-200">
      {/* Top Navbar */}
      <Navbar contractAddress={contractAddress} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-charcoal-900 via-charcoal-900 to-charcoal-850 border border-charcoal-800 shadow-2xl overflow-hidden">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-purpleAcc-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-32 -bottom-16 w-56 h-56 bg-emeraldAcc-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal-800/80 border border-charcoal-700 text-xs font-medium text-purpleAcc-300">
              <Sparkles className="w-3.5 h-3.5 text-purpleAcc-400" />
              <span>Decentralized School Fee Registry</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-charcoal-100">
              Fee<span className="text-purpleAcc-400">Track</span> Ledger
            </h1>

            <p className="text-sm sm:text-base text-charcoal-400 leading-relaxed">
              Transparent, tamper-proof school fee payment records on <strong>Botchain Mainnet</strong>. Administrators register and maintain fee statuses with their wallet; parents, students, and sponsors can publicly verify payment statuses using only a Fee ID.
            </p>

            {/* Quick Actions / Network Helper */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <button
                onClick={handleAddBotchainToMetaMask}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 border border-charcoal-700 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-purpleAcc-400" />
                <span>Add Botchain to MetaMask</span>
              </button>

              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 border border-charcoal-700 transition-colors"
              >
                <span>BotchainScan Explorer</span>
                <ExternalLink className="w-3 h-3 text-charcoal-500" />
              </a>

              <span className="text-charcoal-500 font-mono hidden sm:inline">
                Chain ID: 677
              </span>
            </div>
          </div>
        </div>

        {/* 1. Dashboard Overview */}
        <section key={refreshTrigger}>
          <DashboardStats contractAddress={contractAddress} />
        </section>

        {/* 2. Public Fee Lookup Section (No wallet required) */}
        <section>
          <FeeLookupSection contractAddress={contractAddress} />
        </section>

        {/* 3. Register Fee Section (Admin wallet required) */}
        <section>
          <RegisterFeeSection
            contractAddress={contractAddress}
            onSuccessRegistered={handleFeeRegistered}
          />
        </section>

        {/* 4. My Fee Records Section (Connected admin view) */}
        <section>
          <MyFeesSection contractAddress={contractAddress} />
        </section>

        {/* Information & Security Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-charcoal-900/60 border border-charcoal-800 text-xs text-charcoal-500 flex items-start gap-3">
          <HelpCircle className="w-4 h-4 text-purpleAcc-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-charcoal-300 font-medium">Important Security & Architecture Notice</p>
            <p>
              FeeTrack stores proof of payment status and timestamps on-chain. It does not escrow or process financial transactions directly. To safeguard student privacy, only anonymous identifiers should be registered.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-charcoal-800/80 bg-charcoal-950 py-6 px-4 text-xs text-charcoal-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purpleAcc-400" />
            <span className="font-semibold text-charcoal-300">FeeTrack</span>
            <span>— School fee records made simple.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://rpc.botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-charcoal-300 transition-colors"
            >
              RPC
            </a>
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-charcoal-300 transition-colors"
            >
              Explorer
            </a>
            <span>Powered by Botchain Mainnet (677)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

