import { formatEther, parseEther } from "viem";

export const getAbr = (n: number): string | undefined => {
    if (n < 1) return n.toFixed(2).toString();
    if (n < 1e3) return parseFloat(n.toFixed(2)).toString();
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
}

export const getNumber = (n: bigint, f: number = 2): number => {
  return parseFloat(Number(formatEther(n)).toFixed(f))
}
