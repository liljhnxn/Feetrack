"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { formatAddress } from "@/lib/utils";
import { botchainMainnet } from "@/lib/chains";
import { ShieldCheck, Wallet, LogOut, Check, Copy, ExternalLink, AlertCircle } from "lucide-react";

export function Navbar({ contractAddress }: { contractAddress: string }) {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);

  const targetChainId = 677;
  const isWrongNetwork = isConnected && chainId !== targetChainId && chainId !== 31337;
  const explorerBase = process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL || "https://scan.botchain.ai";

  const handleCopy = (text: string, type: "user" | "contract") => {
    navigator.clipboard.writeText(text);
    if (type === "user") {
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    } else {
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2000);
    }
  };

  const handleConnect = () => {
    const metaMaskConnector = connectors.find((c) => c.name.toLowerCase().includes("metamask")) || connectors[0];
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-charcoal-950/80 border-b border-charcoal-800/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purpleAcc-600 via-purpleAcc-700 to-charcoal-900 flex items-center justify-center shadow-lg shadow-purpleAcc-900/30 border border-purpleAcc-500/30">
            <ShieldCheck className="w-5 h-5 text-purpleAcc-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-charcoal-200">
                Fee<span className="text-purpleAcc-400">Track</span>
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-charcoal-850 text-purpleAcc-400 border border-charcoal-700">
                Botchain Mainnet (677)
              </span>
            </div>
            <p className="text-xs text-charcoal-500 hidden sm:block">
              School fee records made simple.
            </p>
          </div>
        </div>

        {/* Contract & Wallet Status */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Contract Address Pill */}
          {contractAddress && contractAddress !== "0x0000000000000000000000000000000000000000" && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-900 border border-charcoal-800 text-xs text-charcoal-400">
              <span className="text-charcoal-500">Contract:</span>
              <span className="font-mono">{formatAddress(contractAddress)}</span>
              <button
                onClick={() => handleCopy(contractAddress, "contract")}
                className="hover:text-charcoal-200 transition-colors p-0.5"
                title="Copy Contract Address"
              >
                {copiedContract ? <Check className="w-3.5 h-3.5 text-emeraldAcc-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={`${explorerBase}/address/${contractAddress}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-purpleAcc-400 transition-colors p-0.5"
                title="View on Explorer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Network Switcher Warning */}
          {isWrongNetwork && (
            <button
              onClick={() => switchChain({ chainId: targetChainId })}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Switch to {targetChainId === 677 ? "Botchain Mainnet" : "Botchain"}</span>
            </button>
          )}

          {/* Wallet Connect */}
          {isConnected && address ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-xs">
                <span className="w-2 h-2 rounded-full bg-emeraldAcc-400 animate-pulse" />
                <span className="font-mono text-charcoal-300">{formatAddress(address)}</span>
                <button
                  onClick={() => handleCopy(address, "user")}
                  className="p-1 hover:text-white text-charcoal-400 transition-colors"
                  title="Copy Wallet Address"
                >
                  {copiedAddr ? <Check className="w-3.5 h-3.5 text-emeraldAcc-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button
                onClick={() => disconnect()}
                className="p-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 border border-charcoal-700 text-charcoal-400 hover:text-red-400 transition-all"
                title="Disconnect Wallet"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purpleAcc-600 hover:bg-purpleAcc-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-purpleAcc-900/30 transition-all disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

