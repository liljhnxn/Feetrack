import { formatEther } from "viem";

export function formatAddress(address?: string): string {
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getCurrencySymbol(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_CURRENCY_SYMBOL) {
    return process.env.NEXT_PUBLIC_CURRENCY_SYMBOL;
  }
  return "BOT";
}

export function formatTokenAmount(amountWei?: bigint): string {
  if (amountWei === undefined || amountWei === null) return "0";
  try {
    const formatted = formatEther(amountWei);
    // remove trailing zero decimals if any, or keep up to 4 decimals
    const parts = formatted.split(".");
    if (parts.length === 1) return parts[0];
    const decimals = parts[1].slice(0, 4).replace(/0+$/, "");
    return decimals ? `${parts[0]}.${decimals}` : parts[0];
  } catch {
    return "0";
  }
}

export function formatTimestamp(timestampSec?: bigint | number): string {
  if (!timestampSec || Number(timestampSec) === 0) return "N/A";
  const date = new Date(Number(timestampSec) * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateOnly(timestampSec?: bigint | number): string {
  if (!timestampSec || Number(timestampSec) === 0) return "N/A";
  const date = new Date(Number(timestampSec) * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function isPastDeadline(timestampSec?: bigint | number): boolean {
  if (!timestampSec) return false;
  return Number(timestampSec) * 1000 < Date.now();
}

