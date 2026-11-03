import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchainTestnet, hardhatLocal } from "./chains";

export const config = createConfig({
  chains: [botchainTestnet, hardhatLocal],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [botchainTestnet.id]: http(process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.bohr.life"),
    [hardhatLocal.id]: http("http://127.0.0.1:8545"),
  },
  ssr: true,
});

export const DEFAULT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_FEETRACK_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

