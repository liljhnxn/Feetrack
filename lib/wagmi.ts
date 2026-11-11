import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchainMainnet, hardhatLocal } from "./chains";

export const config = createConfig({
  chains: [botchainMainnet, hardhatLocal],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [botchainMainnet.id]: http(process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai"),
    [hardhatLocal.id]: http("http://127.0.0.1:8545"),
  },
  ssr: true,
});

export const DEFAULT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_FEETRACK_ADDRESS ||
  "0x734Ff1ff575f3229A896761694B235Ea53B780A3") as `0x${string}`;
