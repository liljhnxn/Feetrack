import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchainMainnet, botchainTestnet, hardhatLocal } from "./chains";

export const config = createConfig({
  chains: [botchainMainnet, botchainTestnet, hardhatLocal],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [botchainMainnet.id]: http(process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai"),
    [botchainTestnet.id]: http("https://rpc.bohr.life"),
    [hardhatLocal.id]: http("http://127.0.0.1:8545"),
  },
  ssr: true,
});

export const DEFAULT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_FEETRACK_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;
