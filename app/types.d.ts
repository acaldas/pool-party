import type { BigNumberish } from "ethers";

declare global {
  type PoolToken = {
    name: string;
    icon: string;
    contract: `0x${string}`;
    decimals: number;
  };

  type Pool = {
    token: PoolToken;
    prize: BigNumberish;
    total: BigNumberish;
    people: number;
  };
}
