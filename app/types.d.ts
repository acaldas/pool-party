import type { BigNumberish } from "ethers";

declare global {
  type Token = {
    name: string;
    icon: string | StaticImport;
    contract: `0x${string}`;
    decimals: number;
  };

  type Pool = {
    address: `0x${string}`;
    token: Token;
    prize: [
      { token: Token; amount: BigNumberish },
      { token: Token; amount: BigNumberish }
    ];
    bonus: { token: Token; amount: BigNumberish };
    total: BigNumberish;
    people: number;
    largestPurchases: { amount: BigNumberish; user: `0x${string}` }[];
    winners: PoolWinner[];
  };

  type PoolStateDefault = { state: "Default" };
  type PoolStatePlaying = { state: "Playing"; entry: BigNumberish };
  type PoolStateFinished = {
    state: "Finished";
    prize: Poll["prize"];
    bonus?: Pool["bonus"];
  };
  type PoolState = PoolStateDefault | PoolStatePlaying | PoolStateFinished;

  type PoolWinner = {
    address: string;
    prize: [
      { token: Token; amount: BigNumberish },
      { token: Token; amount: BigNumberish },
      { token: Token; amount: BigNumberish }
    ];
    bonus?: Pool["bonus"];
  };

  type ScheduledPools = {
    day: string;
    currentDay: BigNumberish;
    pools: { token: Token; amount: BigNumberish }[];
  };
}
