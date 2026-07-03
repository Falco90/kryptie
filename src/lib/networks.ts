export const NETWORKS = [
  {
    id: "solana",
    name: "Solana",
    assets: ["USDC", "USDT", "SOL"],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    assets: ["USDC", "USDT", "ETH"],
  },
  {
    id: "base",
    name: "Base",
    assets: ["USDC", "ETH"],
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    assets: ["USDC", "USDT", "ETH"],
  },
  {
    id: "bnb",
    name: "BNB Chain",
    assets: ["USDC", "USDT", "ETH", "BNB"],
  },
] as const;

export type Network = (typeof NETWORKS)[number];
