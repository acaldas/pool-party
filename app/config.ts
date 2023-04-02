import { BigNumber, BigNumberish, ethers, utils } from "ethers";
import TRUTHImg from "../public/tokens/truth.jpg";
import WBNBImg from "../public/tokens/wbnb.jpg";
import ACCUImg from "../public/tokens/accu.jpg";
import { dailyPoolABI, poolManagerABI } from "./abi";
import { createPublicClient, http } from "viem";
import { localhost } from "viem/chains";

const POOL_MANAGER_ADDRESS = "0xC3E4971039Cf96f5c5C77554618254185df51BA1";

export const Tokens = {
  TRUTH: {
    name: "TRUTH",
    icon: TRUTHImg,
    contract: "0x55a633B3FCe52144222e468a326105Aa617CC1cc",
    decimals: 18,
  },
  BUSD: {
    name: "BUSD",
    icon: WBNBImg,
    contract: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    decimals: 18,
  },
  ACCU: {
    name: "ACCU",
    icon: ACCUImg,
    contract: "0x9cb949e8c256C3EA5395bbe883E6Ee6a20Db6045",
    decimals: 18,
  },
} as const;

export function getTokenAmount(amount: string, token: Token) {
  return utils.parseUnits(amount, token.decimals).toString();
}

export function getToken(address: string) {
  const token = Object.values(Tokens).find((t) => t.contract === address);
  if (!token) {
    throw new Error(`Token ${address} not configured`);
  }
  return token;
}

const client = createPublicClient({
  chain: localhost,
  transport: http(),
});

export const loadPools = async (
  managerAddress: `0x${string}` = POOL_MANAGER_ADDRESS,
  multicallAddress: `0x${string}` = "0xcA11bde05977b3631167028862bE2a173976CA11"
): Promise<{ pools: Pool[]; currentDay: BigNumberish }> => {
  const managerContract = {
    address: managerAddress,
    abi: poolManagerABI,
  } as const;

  const results = await client.multicall({
    allowFailure: false,
    multicallAddress,
    contracts: [
      {
        ...managerContract,
        functionName: "pools",
        args: [BigInt(0)],
      },
      {
        ...managerContract,
        functionName: "pools",
        args: [BigInt(1)],
      },
      {
        ...managerContract,
        functionName: "pools",
        args: [BigInt(2)],
      },
      {
        ...managerContract,
        functionName: "currentDay",
      },
    ],
  });

  const currentDay = results[3];

  const poolsContracts = results.slice(0, -1).map(
    (result) =>
      ({
        address: result as `0x${string}`,
        abi: dailyPoolABI,
      } as const)
  );

  const pools: Pool[] = await Promise.all(
    poolsContracts.map(async (poolContract) => {
      const [tokenAddress, pool, rewardToken0, rewardToken1] =
        await client.multicall({
          allowFailure: false,
          multicallAddress,
          contracts: [
            { ...poolContract, functionName: "token" },
            { ...poolContract, functionName: "dayInfo", args: [currentDay] },
            { ...poolContract, functionName: "rewardToken0" },
            { ...poolContract, functionName: "rewardToken1" },
          ],
        });

      const token = getToken(tokenAddress);

      const yesterdayInfo =
        currentDay > BigInt(0)
          ? await client.readContract({
              ...poolContract,
              functionName: "dayInfo",
              args: [currentDay - BigInt(1)],
            })
          : undefined;
      const defaultWinner: PoolWinner = {
        address: "0x0000000000000000000000000000000000000000",
        prize: [
          { token, amount: "0" },
          { token: getToken(rewardToken0), amount: "0" },
          { token: getToken(rewardToken1), amount: "0" },
        ],
      };

      const winners: PoolWinner[] = await Promise.all(
        yesterdayInfo
          ? [yesterdayInfo[8], yesterdayInfo[9], yesterdayInfo[9]].map(
              async (winner) => {
                const rewards =
                  winner.user !== defaultWinner.address
                    ? await client.readContract({
                        ...poolContract,
                        functionName: "pendingRewards",
                        args: [winner.user, currentDay - BigInt(1)],
                      })
                    : [BigInt(0), BigInt(0), BigInt(0)];
                return {
                  address: winner.user,
                  prize: [
                    { token, amount: rewards[2] },
                    { token: getToken(rewardToken0), amount: rewards[0] },
                    { token: getToken(rewardToken1), amount: rewards[1] },
                  ],
                };
              }
            )
          : [defaultWinner, defaultWinner, defaultWinner]
      );

      return {
        address: poolContract.address,
        token,
        prize: [
          {
            token: getToken(rewardToken0),
            amount: pool[1].toString(),
          },
          {
            token: getToken(rewardToken1),
            amount: pool[2].toString(),
          },
        ],
        total: pool[7].toString(),
        people: 0,
        bonus: {
          token,
          amount: pool[5].toString(),
        },
        largestPurchases: [
          { ...pool[8], amount: pool[8].amount.toString() },
          { ...pool[9], amount: pool[9].amount.toString() },
          { ...pool[10], amount: pool[10].amount.toString() },
        ],
        winners,
      };
    })
  );

  return { pools, currentDay: currentDay.toString() };
};

export const loadSchedule = async (
  pools: Pool[],
  currentDay: BigNumberish,
  multicallAddress: `0x${string}` = "0xcA11bde05977b3631167028862bE2a173976CA11"
) => {
  const today = new Date();

  const allPools: {
    address: `0x${string}`;
    day: BigNumberish;
    token: Token;
    index: number;
  }[] = new Array(7).fill("").reduce((acc, curr, index) => {
    return [
      ...acc,
      ...pools.map((pool) => ({
        address: pool.address,
        day: BigNumber.from(currentDay)
          .add(BigNumber.from(index + 1))
          .toString(),
        token: pool.token,
        index,
      })),
    ];
  }, []);

  const allTickets: any = await client.multicall({
    multicallAddress,
    allowFailure: false,
    contracts: allPools.map((pool) => ({
      address: pool.address,
      abi: dailyPoolABI,
      functionName: "dayInfo",
      args: [pool.day],
    })),
  });

  return allPools.reduce((acc, curr, index) => {
    const day = acc[curr.index];
    const date = new Date(today);
    date.setDate(today.getDate() + curr.index + 1);

    acc[curr.index] = {
      day: date.toISOString(),
      currentDay: curr.day,
      pools: [
        ...day.pools,
        { token: curr.token, amount: allTickets[index][11].toString() },
      ],
    };
    return acc;
  }, new Array(7).fill({ pools: [], day: new Date() }) as ScheduledPools[]);
};
