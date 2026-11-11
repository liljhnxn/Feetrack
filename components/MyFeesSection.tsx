"use client";

import React, { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { FEE_TRACK_ABI } from "@/lib/contractABI";
import { FeeRecord, PaymentStatus } from "@/lib/types";
import {
  formatTokenAmount,
  formatDateOnly,
  formatTimestamp,
  isPastDeadline,
  getCurrencySymbol,
} from "@/lib/utils";
import { EditFeeModal } from "./EditFeeModal";
import {
  CheckCircle2,
  Clock,
  Edit,
  Loader2,
  RotateCcw,
  Check,
  AlertCircle,
  FolderOpen,
  Calendar,
  Layers,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export function MyFeesSection({ contractAddress }: { contractAddress: `0x${string}` }) {
  const { address, isConnected } = useAccount();

  // Selected fee for editing modal
  const [editingFee, setEditingFee] = useState<FeeRecord | null>(null);

  // Status mutation write contract
  const {
    data: txHash,
    isPending: isSubmitting,
    error: submitError,
    writeContract,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isMining, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // Read fees registered by connected wallet
  const {
    data: myFeesRaw,
    isLoading,
    isRefetching,
    refetch,
    error: readError,
  } = useReadContract({
    address: contractAddress,
    abi: FEE_TRACK_ABI,
    functionName: "getMyFees",
    account: address,
  });

  // Re-fetch after transactions confirm
  React.useEffect(() => {
    if (isConfirmed) {
      refetch();
      resetWrite();
    }
  }, [isConfirmed, refetch, resetWrite]);

  const handleMarkPaid = (feeId: bigint) => {
    resetWrite();
    writeContract({
      address: contractAddress,
      abi: FEE_TRACK_ABI,
      functionName: "markFeePaid",
      args: [feeId],
    });
  };

  const handleMarkUnpaid = (feeId: bigint) => {
    resetWrite();
    writeContract({
      address: contractAddress,
      abi: FEE_TRACK_ABI,
      functionName: "markFeeUnpaid",
      args: [feeId],
    });
  };

  if (!isConnected) {
    return (
      <div className="rounded-2xl p-6 sm:p-8 bg-charcoal-900 border border-charcoal-800 text-center shadow-xl">
        <div className="inline-flex p-3 rounded-2xl bg-charcoal-850 text-purpleAcc-400 mb-3 border border-charcoal-800">
          <FolderOpen className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-charcoal-200">
          Administrator Records Portal
        </h3>
        <p className="text-xs text-charcoal-500 max-w-md mx-auto mt-1 mb-4">
          Connect your authorized school administrator wallet in the top bar to view, manage, and update the fee records you have registered.
        </p>
      </div>
    );
  }

  // Format records array safely
  const fees: FeeRecord[] = Array.isArray(myFeesRaw)
    ? myFeesRaw.map((item) => ({
        feeId: item.feeId,
        admin: item.admin,
        studentRef: item.studentRef,
        description: item.description,
        amount: item.amount,
        dueDate: item.dueDate,
        status: item.status as PaymentStatus,
        paidTimestamp: item.paidTimestamp,
        createdAt: item.createdAt,
      }))
    : [];

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-charcoal-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purpleAcc-900/40 text-purpleAcc-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-charcoal-200">
              My School Fee Records
            </h2>
            <p className="text-xs text-charcoal-500">
              Records registered by {address?.slice(0, 6)}...{address?.slice(-4)} ({fees.length} total)
            </p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-850 hover:bg-charcoal-800 border border-charcoal-700 text-xs text-charcoal-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-purpleAcc-400" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Action Transaction Alert */}
      {(isSubmitting || isMining) && (
        <div className="p-3 rounded-xl bg-purpleAcc-950/40 border border-purpleAcc-500/30 text-purpleAcc-300 text-xs flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-purpleAcc-400" />
          <span>
            {isSubmitting ? "Please confirm status update in your wallet..." : "Updating record status on BOT Chain Mainnet..."}
          </span>
        </div>
      )}

      {submitError && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{submitError.message}</span>
        </div>
      )}

      {readError && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>Failed to load your records: {readError.message}</span>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-charcoal-500 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-purpleAcc-400" />
          <span>Loading your registered fees from smart contract...</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && fees.length === 0 && (
        <div className="py-12 border border-dashed border-charcoal-800 rounded-xl text-center text-charcoal-500 text-xs space-y-1">
          <p className="text-charcoal-300 font-medium">No fee records found for this wallet address.</p>
          <p>Register your first school fee above to manage it here.</p>
        </div>
      )}

      {/* Records List / Cards */}
      {!isLoading && fees.length > 0 && (
        <div className="grid grid-cols-1 gap-3.5">
          {fees.map((fee) => {
            const isPaid = fee.status === PaymentStatus.Paid;
            const overdue = !isPaid && isPastDeadline(fee.dueDate);

            return (
              <div
                key={fee.feeId.toString()}
                className="rounded-xl p-4 sm:p-5 bg-charcoal-950/80 border border-charcoal-800 hover:border-charcoal-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-charcoal-900 border border-charcoal-700 text-purpleAcc-400 font-semibold">
                      #{fee.feeId.toString()}
                    </span>

                    <span className="text-xs font-semibold text-charcoal-200 font-mono">
                      {fee.studentRef}
                    </span>

                    {/* Status Badge */}
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emeraldAcc-900/40 text-emeraldAcc-400 border border-emeraldAcc-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>PAID</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        <Clock className="w-3 h-3" />
                        <span>UNPAID</span>
                      </span>
                    )}

                    {overdue && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-500/30">
                        OVERDUE
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-charcoal-300 font-medium line-clamp-2">
                    {fee.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-500">
                    <div>
                      <span>Amount: </span>
                      <span className="font-mono font-semibold text-charcoal-200">
                        {formatTokenAmount(fee.amount)} {getCurrencySymbol()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Due: </span>
                      <span className="text-charcoal-300">{formatDateOnly(fee.dueDate)}</span>
                    </div>

                    {isPaid && fee.paidTimestamp > BigInt(0) && (
                      <div className="text-emeraldAcc-400">
                        <span>Paid: </span>
                        <span>{formatTimestamp(fee.paidTimestamp)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center flex-wrap gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-charcoal-850">
                  {/* Mark Paid / Unpaid Button */}
                  {isPaid ? (
                    <button
                      onClick={() => handleMarkUnpaid(fee.feeId)}
                      disabled={isSubmitting || isMining}
                      className="px-3 py-1.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-charcoal-300 hover:text-amber-300 border border-charcoal-700 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Mark Unpaid</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkPaid(fee.feeId)}
                      disabled={isSubmitting || isMining}
                      className="px-3.5 py-1.5 rounded-lg bg-emeraldAcc-600 hover:bg-emeraldAcc-500 text-charcoal-950 font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emeraldAcc-900/20 transition-colors disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark as Paid</span>
                    </button>
                  )}

                  {/* Edit Fee Button */}
                  <button
                    onClick={() => setEditingFee(fee)}
                    disabled={isSubmitting || isMining}
                    className="px-3 py-1.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-charcoal-300 hover:text-purpleAcc-300 border border-charcoal-700 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Fee</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingFee && (
        <EditFeeModal
          fee={editingFee}
          contractAddress={contractAddress}
          isOpen={true}
          onClose={() => setEditingFee(null)}
          onSuccess={() => {
            refetch();
            setEditingFee(null);
          }}
        />
      )}
    </div>
  );
}
