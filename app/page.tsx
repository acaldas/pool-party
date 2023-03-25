import { PoolItem } from "@components/pool-item";
import Schedule from "@components/schedule";
import Winners from "@components/winners";
import { utils } from "ethers";
import { Pools } from "./config";

export default function Home() {
  return (
    <main className="px-[5.1vw] py-[4.3vh]">
      <div className="mx-auto max-w-[1920px]">
        <div className="mb-[4.3vh] grid justify-center gap-[1vw] xl:grid-cols-3">
          {Pools.map((pool) => (
            <PoolItem key={pool.token.name} {...pool} />
          ))}
        </div>
        <div className="mb-[4.3vh]">
          <Winners
            winners={Pools.map((pool) => ({
              pool,
              winners: [
                {
                  prize: pool.prize,
                  bonus: pool.token.name === "WBNB" ? pool.bonus : undefined,
                  address: "0x1JHG",
                },
                {
                  prize: pool.prize,
                  bonus: pool.token.name === "WBNB" ? pool.bonus : undefined,
                  address: "0x1JHG",
                },
                {
                  prize: pool.prize,
                  bonus: pool.token.name === "WBNB" ? pool.bonus : undefined,
                  address: "0x1JHG",
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
