"use client";

import React, { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { FEE_TRACK_ABI } from "@/lib/contractABI";
import { FeeRecord } from "@/lib/types";
import { getCurrencySymbol } from "@/lib/utils";
import { X, Edit3, Loader2, AlertCircle } from "lucide-react";

interface EditFeeModalProps {
  fee: FeeRecord;
  contractAddress: `0x${string}`;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditFeeModal({
  fee,
  contractAddress,
  isOpen,
  onClose,
  onSuccess,
}: EditFeeModalProps) {
  const [description, setDescription] = useState(fee.description);
  const [amount, setAmount] = useState(formatEther(fee.amount));
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date(Number(fee.dueDate) * 1000);
    // Format to yyyy-MM-ddThh:mm for input[type="datetime-local"]
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  });
  const [formError, setFormError] = useState<string | null>(null);

  const {
    data: txHash,
    isPending: isSubmitting,
    error: submitError,
    writeContract,
    reset,
  } = useWriteContract();

  const { isLoading: isMining, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  React.useEffect(() => {
    if (isConfirmed) {
      onSuccess();
      onClose();
      reset();
    }
  }, [isConfirmed, onSuccess, onClose, reset]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!description.trim()) {
      setFormError("Description cannot be empty.");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setFormError("Amount must be greater than zero.");
      return;
    }
    if (!dueDate) {
      setFormError("Due date is required.");
      return;
    }

    const dueTimestamp = Math.floor(new Date(dueDate).getTime() / 1000);
    if (dueTimestamp <= Math.floor(Date.now() / 1000)) {
      setFormError("Payment deadline must be a future date and time.");
      return;
    }

    try {
      const amountWei = parseEther(amount);
      writeContract({
        address: contractAddress,
        abi: FEE_TRACK_ABI,
        functionName: "updateFee",
        args: [fee.feeId, description.trim(), amountWei, BigInt(dueTimestamp)],
      });
    } catch (err: unknown) {
      const e = err as Error;
      setFormError(e.message || "Failed to submit update.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-charcoal-900 border border-charcoal-700 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-purpleAcc-900/40 text-purpleAcc-400">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-charcoal-200">
              Edit Fee Record #{fee.feeId.toString()}
            </h3>
            <p className="text-xs text-charcoal-500">Student: {fee.studentRef}</p>
          </div>
        </div>

        {(formError || submitError) && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{formError || submitError?.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-charcoal-400 font-medium mb-1">
              Fee Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-800 text-charcoal-200 text-sm focus:outline-none focus:border-purpleAcc-500"
              required
            />
          </div>

          <div>
            <label className="block text-charcoal-400 font-medium mb-1">
              Fee Amount ({getCurrencySymbol()})
            </label>
            <input
              type="number"
              step="any"
              min="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-800 text-charcoal-200 font-mono text-sm focus:outline-none focus:border-purpleAcc-500"
              required
            />
          </div>

          <div>
            <label className="block text-charcoal-400 font-medium mb-1">
              New Due Date & Time
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-800 text-charcoal-200 text-sm focus:outline-none focus:border-purpleAcc-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isMining}
              className="px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isMining}
              className="px-5 py-2 rounded-xl bg-purpleAcc-600 hover:bg-purpleAcc-700 text-white font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting || isMining ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isSubmitting ? "Confirming..." : "Updating..."}</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

