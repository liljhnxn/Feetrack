"use client";

import React from "react";
import { useReadContract } from "wagmi";
import { FEE_TRACK_ABI } from "@/lib/contractABI";
import { formatBohrAmount, getCurrencySymbol } from "@/lib/utils";
import { defaultChain } from "@/lib/chains";
import { FileText, CheckCircle2, Clock, Coins, RefreshCw } from "lucide-react";

export function DashboardStats({ contractAddress }: { contractAddress: `0x${string}` }) {
  const { data, isLoading, isRefetching, refetch } = useReadContract({
    address: contractAddress,
    abi: FEE_TRACK_ABI,
    functionName: "getFeeStatistics",
    chainId: defaultChain.id,
  });

  const totalRecords = data ? Number(data[0]) : 0;
  const paidRecords = data ? Number(data[1]) : 0;
  const unpaidRecords = data ? Number(data[2]) : 0;
  const totalAmount = data ? data[3] : BigInt(0);
  const symbol = getCurrencySymbol();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-charcoal-200">On-Chain Overview</h2>
          <p className="text-xs text-charcoal-500">Live statistics recorded on {defaultChain.name}</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-850 border border-charcoal-800 text-xs text-charcoal-400 hover:text-charcoal-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-purpleAcc-400" : ""}`} />
          <span>Sync</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Records */}
        <div className="rounded-2xl p-4 sm:p-5 bg-charcoal-900 border border-charcoal-800/80 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-charcoal-500">Total Records</span>
            <div className="p-2 rounded-xl bg-charcoal-800 text-charcoal-300">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal-200">
            {isLoading ? <span className="text-charcoal-600 animate-pulse">...</span> : totalRecords}
          </div>
          <p className="text-[11px] text-charcoal-500 mt-1">Registered fee entries</p>
        </div>

        {/* Paid Records */}
        <div className="rounded-2xl p-4 sm:p-5 bg-charcoal-900 border border-emeraldAcc-900/40 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emeraldAcc-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emeraldAcc-400">Paid Records</span>
            <div className="p-2 rounded-xl bg-emeraldAcc-900/30 text-emeraldAcc-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emeraldAcc-400">
            {isLoading ? <span className="text-charcoal-600 animate-pulse">...</span> : paidRecords}
          </div>
          <p className="text-[11px] text-charcoal-500 mt-1">Verified on-chain</p>
        </div>

        {/* Unpaid Records */}
        <div className="rounded-2xl p-4 sm:p-5 bg-charcoal-900 border border-purpleAcc-900/40 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purpleAcc-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-purpleAcc-300">Unpaid Records</span>
            <div className="p-2 rounded-xl bg-purpleAcc-900/30 text-purpleAcc-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-purpleAcc-300">
            {isLoading ? <span className="text-charcoal-600 animate-pulse">...</span> : unpaidRecords}
          </div>
          <p className="text-[11px] text-charcoal-500 mt-1">Pending payments</p>
        </div>

        {/* Total Amount */}
        <div className="rounded-2xl p-4 sm:p-5 bg-charcoal-900 border border-charcoal-800/80 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-charcoal-500">Total Recorded</span>
            <div className="p-2 rounded-xl bg-charcoal-800 text-charcoal-300">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-charcoal-200 truncate">
            {isLoading ? (
              <span className="text-charcoal-600 animate-pulse">...</span>
            ) : (
              `${formatBohrAmount(totalAmount)} ${symbol}`
            )}
          </div>
          <p className="text-[11px] text-charcoal-500 mt-1">Aggregated fee volume</p>
        </div>
      </div>
    </div>
  );
}
