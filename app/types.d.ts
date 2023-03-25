import type { BigNumberish } from "ethers";

declare global {
  type Token = {
    name: string;
    icon: string | StaticImport;
    contract: `0x${string}`;
    decimals: number;
  };

  type Pool = {
    token: Token;
    prize: [
      { token: Token; amount: BigNumberish },
      { token: Token; amount: BigNumberish }
    ];
    bonus: { token: Token; amount: BigNumberish };
    total: BigNumberish;
    people: number;
  };
}

type PoolState =
  | {
      state: "None";
    }
  | {
      state: "Playing";
      entry: BigNumberish;
    }
  | {
      state: "Finished";
      prize: {
        token;
        BigNumberish;
      }[];
    };
