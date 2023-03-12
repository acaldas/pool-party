import { PoolItem } from "@components/pool-item";
import { BigNumber } from "ethers";

const pools: Pool[] = [
  {
    token: {
      name: "TRUTH",
      icon: "https://assets.coingecko.com/nft_contracts/images/2291/large/truth-nft.jpg?1671083970",
      contract: "0xfe64bf14718dfbe64b1ee0c3cc12e76e983487f3",
    },
    prize: BigNumber.from("11133").toString(),
    total: BigNumber.from(1499).toString(),
    people: 1255,
  },
  {
    token: {
      name: "WSNB",
      icon: "https://assets.coingecko.com/coins/images/12591/large/binance-coin-logo.png?1600947313",
      contract: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    },
    prize: BigNumber.from(11133).toString(),
    total: BigNumber.from(1499).toString(),
    people: 1255,
  },
  {
    token: {
      name: "ACCU",
      icon: "https://pbs.twimg.com/profile_images/1622863202206752769/REgUZuxg_400x400.jpg",
      contract: "0x9cb949e8c256C3EA5395bbe883E6Ee6a20Db6045",
    },
    prize: BigNumber.from(11133).toString(),
    total: BigNumber.from(1499).toString(),
    people: 1255,
  },
];

export default function Home() {
  return (
    <main className="px-[5.1vw] py-[4.3vh]">
      <div className="max-w-[1920px] mx-auto ">
        <div className="grid grid-cols-3 justify-center">
          {pools.map((pool) => (
            <PoolItem key={pool.token.name} {...pool} />
          ))}
        </div>
      </div>
    </main>
  );
}
