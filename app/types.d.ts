import type { BigNumber } from "ethers";

declare global {
  type PoolToken = {
    name: string;
    icon: string;
    contract: string;
  };

  type Pool = {
    token: PoolToken;
    prize: BigNumber;
    total: BigNumber;
    people: number;
  };
}
