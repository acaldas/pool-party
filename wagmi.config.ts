import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { erc20ABI } from "wagmi";
import PoolManager from "./contracts/artifacts/PoolManager.sol/PoolManager.json";
import DailyPool from "./contracts/artifacts/DailyPool.sol/DailyPool.json";
import BonusDistributor from "./contracts/artifacts/BonusDistributor.sol/BonusDistributor.json";

export default defineConfig({
  out: "app/generated.ts",
  contracts: [
    {
      name: "erc20",
      abi: erc20ABI,
    },
    {
      name: "PoolManager",
      abi: PoolManager.abi as any,
    },
    {
      name: "DailyPool",
      abi: DailyPool.abi as any,
    },
    {
      name: "BonusDistributor",
      abi: BonusDistributor.abi as any,
    },
  ],
  plugins: [react()],
});
