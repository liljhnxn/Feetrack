"use client";

import React, { useState } from "react";
import { createPublicClient, http } from "viem";
import { defaultChain } from "@/lib/chains";
import { FEE_TRACK_ABI } from "@/lib/contractABI";
import { FeeRecord, PaymentStatus } from "@/lib/types";
import {
  formatAddress,
  formatTokenAmount,
  formatTimestamp,
  formatDateOnly,
  isPastDeadline,
  getCurrencySymbol,
} from "@/lib/utils";
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  DollarSign,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  FileSearch,
} from "lucide-react";

export function FeeLookupSection({ contractAddress }: { contractAddress: `0x${string}` }) {
  const [feeIdInput, setFeeIdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<FeeRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchedId, setSearchedId] = useState<string | null>(null);

  const [copiedAdmin, setCopiedAdmin] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const symbol = getCurrencySymbol();
  const explorerBase = process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL || "https://scan.botchain.ai";

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const idToSearch = feeIdInput.trim();
    if (!idToSearch) {
      setError("Please enter a Fee ID to look up.");
      return;
    }

    if (isNaN(Number(idToSearch)) || Number(idToSearch) <= 0) {
      setError("Please enter a valid numeric Fee ID (e.g. 1, 2, 3).");
      return;
    }

    setLoading(true);
    setError(null);
    setRecord(null);
    setSearchedId(idToSearch);

    try {
      const rpcUrl =
        process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai";
      const publicClient = createPublicClient({
        chain: defaultChain,
        transport: http(rpcUrl),
      });

      const result = await publicClient.readContract({
        address: contractAddress,
        abi: FEE_TRACK_ABI,
        functionName: "getFee",
        args: [BigInt(idToSearch)],
      });

      // result is a tuple of FeeRecord
      const feeData: FeeRecord = {
        feeId: (result as { feeId: bigint }).feeId,
        admin: (result as { admin: `0x${string}` }).admin,
        studentRef: (result as { studentRef: string }).studentRef,
        description: (result as { description: string }).description,
        amount: (result as { amount: bigint }).amount,
        dueDate: (result as { dueDate: bigint }).dueDate,
        status: (result as { status: number }).status as PaymentStatus,
        paidTimestamp: (result as { paidTimestamp: bigint }).paidTimestamp,
        createdAt: (result as { createdAt: bigint }).createdAt,
      };

      setRecord(feeData);
    } catch (err: unknown) {
      const e = err as Error;
      if (e.message?.includes("FeeNotFound") || e.message?.includes("revert")) {
        setError(`No fee record was found for Fee ID #${idToSearch}. Please verify the number.`);
      } else {
        setError("Unable to retrieve record from BOT Chain Mainnet. Please check the network RPC.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: "admin" | "id") => {
    navigator.clipboard.writeText(text);
    if (type === "admin") {
      setCopiedAdmin(true);
      setTimeout(() => setCopiedAdmin(false), 2000);
    } else {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-charcoal-900 border border-charcoal-800 shadow-xl">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-xl bg-purpleAcc-900/40 text-purpleAcc-400">
          <Search className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-charcoal-200">Public Fee Lookup</h2>
          <p className="text-xs text-charcoal-500">
            Check school fee payment status without connecting a wallet
          </p>
        </div>
      </div>

      <form onSubmit={handleLookup} className="mt-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="number"
            min="1"
            placeholder="Enter unique Fee ID (e.g. 1)"
            value={feeIdInput}
            onChange={(e) => setFeeIdInput(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-800 text-charcoal-200 placeholder-charcoal-600 text-sm focus:outline-none focus:border-purpleAcc-500 focus:ring-1 focus:ring-purpleAcc-500 transition-colors font-mono"
          />
          <span className="absolute right-3.5 top-3 text-xs text-charcoal-600 font-mono">
            #ID
          </span>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-purpleAcc-600 hover:bg-purpleAcc-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-purpleAcc-900/30 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Querying Chain...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Lookup Record</span>
            </>
          )}
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 flex items-start gap-2 text-xs">
          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Card */}
      {record && (
        <div className="mt-6 rounded-xl p-5 bg-charcoal-950/90 border border-charcoal-700/80 shadow-2xl relative overflow-hidden">
          {/* Header Row: ID, Reference & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-charcoal-800">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold font-mono text-purpleAcc-300">
                Fee Record #{record.feeId.toString()}
              </span>
              <button
                onClick={() => handleCopy(record.feeId.toString(), "id")}
                className="p-1 text-charcoal-500 hover:text-charcoal-300 transition-colors"
                title="Copy Fee ID"
              >
                {copiedId ? <Check className="w-4 h-4 text-emeraldAcc-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Payment Status Badge */}
            {record.status === PaymentStatus.Paid ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emeraldAcc-900/40 text-emeraldAcc-400 border border-emeraldAcc-500/30 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>PAID</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                <Clock className="w-4 h-4" />
                <span>UNPAID</span>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
            {/* Student Ref */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-charcoal-900 text-charcoal-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-charcoal-500 block">Student Identifier:</span>
                <span className="text-sm font-semibold text-charcoal-200 font-mono">
                  {record.studentRef}
                </span>
              </div>
            </div>

            {/* Fee Amount */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-charcoal-900 text-purpleAcc-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="text-charcoal-500 block">Fee Amount:</span>
                <span className="text-sm font-bold text-charcoal-100 font-mono">
                  {formatTokenAmount(record.amount)} {symbol}
                </span>
              </div>
            </div>

            {/* Fee Description */}
            <div className="col-span-1 md:col-span-2 p-3 rounded-lg bg-charcoal-900/60 border border-charcoal-800">
              <span className="text-charcoal-500 block mb-0.5">Description:</span>
              <p className="text-sm text-charcoal-300 font-medium">
                {record.description}
              </p>
            </div>

            {/* Admin Address */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-charcoal-900 text-charcoal-400">
                <FileSearch className="w-4 h-4" />
              </div>
              <div>
                <span className="text-charcoal-500 block">School Administrator:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-charcoal-300">{formatAddress(record.admin)}</span>
                  <button
                    onClick={() => handleCopy(record.admin, "admin")}
                    className="p-0.5 text-charcoal-500 hover:text-charcoal-300"
                    title="Copy Address"
                  >
                    {copiedAdmin ? <Check className="w-3.5 h-3.5 text-emeraldAcc-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={`${explorerBase}/address/${record.admin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-0.5 text-purpleAcc-400 hover:text-purpleAcc-300"
                    title="Explorer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-charcoal-900 text-charcoal-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-charcoal-500 block">Payment Deadline:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-charcoal-200">
                    {formatDateOnly(record.dueDate)}
                  </span>
                  {record.status === PaymentStatus.Unpaid && isPastDeadline(record.dueDate) && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-500/30">
                      OVERDUE
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-charcoal-500">
              <span>Created On: </span>
              <span className="text-charcoal-300 font-mono">{formatTimestamp(record.createdAt)}</span>
            </div>

            {record.paidTimestamp > BigInt(0) && (
              <div className="text-charcoal-500">
                <span>Paid Timestamp: </span>
                <span className="text-emeraldAcc-400 font-mono">{formatTimestamp(record.paidTimestamp)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Initial state placeholder */}
      {!record && !loading && !error && (
        <div className="mt-6 p-6 rounded-xl border border-dashed border-charcoal-800 text-center text-charcoal-500 text-xs">
          Enter a unique Fee ID above to retrieve real-time on-chain payment status. No wallet required.
        </div>
      )}
    </div>
  );
}
