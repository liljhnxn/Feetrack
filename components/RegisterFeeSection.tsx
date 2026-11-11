"use client";

import React, { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, decodeEventLog } from "viem";
import { FEE_TRACK_ABI } from "@/lib/contractABI";
import { getCurrencySymbol } from "@/lib/utils";
import { PlusCircle, Check, Copy, ExternalLink, Loader2, Info, AlertTriangle } from "lucide-react";

export function RegisterFeeSection({
  contractAddress,
  onSuccessRegistered,
}: {
  contractAddress: `0x${string}`;
  onSuccessRegistered?: () => void;
}) {
  const { isConnected } = useAccount();
  const [studentRef, setStudentRef] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Success state after registration
  const [registeredFeeId, setRegisteredFeeId] = useState<string | null>(null);
  const [copiedFeeId, setCopiedFeeId] = useState(false);

  const {
    data: txHash,
    isPending: isSubmitting,
    error: submitError,
    writeContract,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Extract Fee ID from event logs if available
  React.useEffect(() => {
    if (isConfirmed && receipt) {
      let extractedId: string | null = null;
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: FEE_TRACK_ABI,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "FeeRegistered" && decoded.args) {
            extractedId = (decoded.args as { feeId: bigint }).feeId.toString();
            break;
          }
        } catch {
          // not this event
        }
      }

      if (extractedId) {
        setRegisteredFeeId(extractedId);
      } else {
        setRegisteredFeeId("Confirmed");
      }

      if (onSuccessRegistered) {
        onSuccessRegistered();
      }
    }
  }, [isConfirmed, receipt, onSuccessRegistered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setRegisteredFeeId(null);

    if (!isConnected) {
      setFormError("Please connect your school administrator wallet first.");
      return;
    }

    if (!studentRef.trim()) {
      setFormError("Student reference identifier is required.");
      return;
    }

    if (!description.trim()) {
      setFormError("Fee description is required.");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setFormError("Fee amount must be greater than zero.");
      return;
    }

    if (!dueDate) {
      setFormError("Payment due date is required.");
      return;
    }

    const dueTimestamp = Math.floor(new Date(dueDate).getTime() / 1000);
    const nowTimestamp = Math.floor(Date.now() / 1000);

    if (dueTimestamp <= nowTimestamp) {
      setFormError("Payment deadline must be a future date and time.");
      return;
    }

    try {
      const amountWei = parseEther(amount);
      writeContract({
        address: contractAddress,
        abi: FEE_TRACK_ABI,
        functionName: "registerFee",
        args: [studentRef.trim(), description.trim(), amountWei, BigInt(dueTimestamp)],
      });
    } catch (err: unknown) {
      const e = err as Error;
      setFormError(e.message || "Failed to submit fee registration.");
    }
  };

  const handleCopyId = () => {
    if (registeredFeeId) {
      navigator.clipboard.writeText(registeredFeeId);
      setCopiedFeeId(true);
      setTimeout(() => setCopiedFeeId(false), 2000);
    }
  };

  const handleResetForm = () => {
    setStudentRef("");
    setDescription("");
    setAmount("");
    setDueDate("");
    setFormError(null);
    setRegisteredFeeId(null);
    resetWrite();
  };

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-charcoal-900 border border-charcoal-800 shadow-xl">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-xl bg-purpleAcc-900/40 text-purpleAcc-400">
          <PlusCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-charcoal-200">Register New Fee</h2>
          <p className="text-xs text-charcoal-500">
            Create an on-chain school fee payment obligation
          </p>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="my-4 p-3 rounded-xl bg-charcoal-850/80 border border-charcoal-800 flex items-start gap-2.5 text-xs text-charcoal-400">
        <Info className="w-4 h-4 text-purpleAcc-400 mt-0.5 shrink-0" />
        <span>
          <strong className="text-charcoal-300">Privacy Notice:</strong> Blockchain records are public. Use anonymous identifiers (e.g., <code className="text-purpleAcc-300">STU-2026-9041</code>). Never store student names, phone numbers, or sensitive personal data.
        </span>
      </div>

      {/* Success Banner */}
      {isConfirmed && registeredFeeId && (
        <div className="mb-5 p-4 rounded-xl bg-emeraldAcc-900/20 border border-emeraldAcc-500/30 text-emeraldAcc-300 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <Check className="w-5 h-5 text-emeraldAcc-400" />
              <span>Fee Record Successfully Registered!</span>
            </div>
            <button
              onClick={handleResetForm}
              className="text-xs underline text-emeraldAcc-400 hover:text-emeraldAcc-300"
            >
              Register Another
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-charcoal-950/70 border border-emeraldAcc-500/20">
            <div>
              <span className="text-xs text-charcoal-500 block">Unique Fee ID:</span>
              <span className="text-xl font-bold font-mono text-emeraldAcc-400">
                #{registeredFeeId}
              </span>
            </div>
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emeraldAcc-600 hover:bg-emeraldAcc-500 text-charcoal-950 font-semibold text-xs transition-colors"
            >
              {copiedFeeId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedFeeId ? "Copied ID!" : "Copy Fee ID"}</span>
            </button>
          </div>

          {txHash && (
            <div className="text-xs text-charcoal-400 flex items-center justify-between">
              <span>Tx: {txHash.slice(0, 14)}...{txHash.slice(-8)}</span>
              <a
                href={`${process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL || "https://scan.botchain.ai"}/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-emeraldAcc-400 hover:underline"
              >
                <span>View on Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Form Error or Revert Error */}
      {(formError || submitError) && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 flex items-start gap-2 text-xs">
          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <span>{formError || submitError?.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Student Reference */}
          <div>
            <label className="block text-xs font-medium text-charcoal-400 mb-1.5">
              Student Reference <span className="text-purpleAcc-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. STU-2026-9041"
              value={studentRef}
              onChange={(e) => setStudentRef(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-800 text-charcoal-200 placeholder-charcoal-600 text-sm focus:outline-none focus:border-purpleAcc-500 focus:ring-1 focus:ring-purpleAcc-500 transition-colors"
              required
            />
          </div>

          {/* Fee Amount */}
          <div>
            <label className="block text-xs font-medium text-charcoal-400 mb-1.5">
              Fee Amount ({getCurrencySymbol()}) <span className="text-purpleAcc-400">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0.000001"
              placeholder="0.5"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-800 text-charcoal-200 placeholder-charcoal-600 text-sm focus:outline-none focus:border-purpleAcc-500 focus:ring-1 focus:ring-purpleAcc-500 transition-colors font-mono"
              required
            />
          </div>
        </div>

        {/* Fee Description */}
        <div>
          <label className="block text-xs font-medium text-charcoal-400 mb-1.5">
            Fee Description <span className="text-purpleAcc-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Term 1 Tuition & Computer Science Lab Fee 2026"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-800 text-charcoal-200 placeholder-charcoal-600 text-sm focus:outline-none focus:border-purpleAcc-500 focus:ring-1 focus:ring-purpleAcc-500 transition-colors"
            required
          />
        </div>

        {/* Payment Due Date */}
        <div>
          <label className="block text-xs font-medium text-charcoal-400 mb-1.5">
            Payment Due Date <span className="text-purpleAcc-400">*</span>
          </label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-800 text-charcoal-200 placeholder-charcoal-600 text-sm focus:outline-none focus:border-purpleAcc-500 focus:ring-1 focus:ring-purpleAcc-500 transition-colors"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isConfirming}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purpleAcc-600 hover:bg-purpleAcc-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-purpleAcc-900/30 transition-all disabled:opacity-50"
        >
          {isSubmitting || isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isSubmitting ? "Confirming in Wallet..." : "Mining Transaction..."}</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Register Fee Record</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

