import { PoolItem } from "@components/pool-item";
import Schedule from "@components/schedule";
import Winners from "@components/winners";
import { utils } from "ethers";

const pools: Pool[] = [
  {
    token: {
      name: "TRUTH",
      icon: "https://assets.coingecko.com/nft_contracts/images/2291/large/truth-nft.jpg?1671083970",
      contract: "0xfe64bf14718dfbe64b1ee0c3cc12e76e983487f3",
      decimals: 18,
    },
    prize: utils.parseEther("11133").toString(),
    total: utils.parseEther("1499").toString(),
    people: 1255,
  },
  {
    token: {
      name: "WSNB",
      icon: "https://assets.coingecko.com/coins/images/12591/large/binance-coin-logo.png?1600947313",
      contract: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      decimals: 18,
    },
    prize: utils.parseEther("11133").toString(),
    total: utils.parseEther("1499").toString(),
    people: 1255,
  },
  {
    token: {
      name: "USDC",
      icon: "https://pbs.twimg.com/profile_images/1622863202206752769/REgUZuxg_400x400.jpg",
      contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
    },
    prize: utils.parseUnits("11133", 6).toString(),
    total: utils.parseUnits("1499", 6).toString(),
    people: 1255,
  },
];

export default function Home() {
  return (
    <main className="px-[5.1vw] py-[4.3vh]">
      <div className="mx-auto max-w-[1920px]">
        <div className="mb-[4.3vh] grid grid-cols-3 justify-center">
          {pools.map((pool) => (
            <PoolItem key={pool.token.name} {...pool} />
          ))}
        </div>
        <div className="mb-[4.3vh]">
          <Winners
            winners={pools.map((pool) => ({
              pool,
              winners: [
                {
                  address: "asdasd1JHG",
                  prize: utils.parseUnits("4234", pool.token.decimals),
                  bonus: utils.parseUnits("1233", pool.token.decimals),
                },
                {
                  address: "asdasd1JHG",
                  prize: utils.parseUnits("4234", pool.token.decimals),
                  bonus: utils.parseUnits("1233", pool.token.decimals),
                },
                {
                  address: "asdasd1JHG",
                  prize: utils.parseUnits("4234", pool.token.decimals),
                  bonus: utils.parseUnits("1233", pool.token.decimals),
                },
              ],
            }))}
          />
        </div>
        <Schedule />
      </div>
    </main>
  );
}
