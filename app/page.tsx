import { PoolItem } from "@components/pool-item";
import Schedule from "@components/schedule";
import Winners from "@components/winners";
import { getTokenAmount, Pools } from "./config";

const states = [
  () => ({
    state: "Default",
  }),
  (pool: Pool) => ({
    state: "Playing",
    entry: getTokenAmount("1000", pool.token),
  }),
  (pool: Pool) => ({
    state: "Finished",
    prize: pool.prize,
    bonus: pool.bonus,
  }),
];

export default function Home() {
  return (
    <main className="px-[5.1vw] py-[4.3vh] xl:px-[4vw]">
      <div className="mx-auto max-w-[1920px]">
        <div className="mb-[4.3vh] grid grid-cols-3 justify-center gap-[2vw] lg:grid-cols-2">
          {Pools.map((pool, index) => (
            <PoolItem
              key={pool.token.name}
              pool={pool}
              state={states[index](pool) as PoolState}
            />
          ))}
        </div>
        <div className="mb-[4.3vh] xs:mb-10">
          <Winners
            winners={Pools.map((pool) => ({
              pool,
              winners: [
                {
                  prize: pool.prize,
                  bonus: pool.token.name === "WBNB" ? pool.bonus : undefined,
                  address: "0x1JHG11",
                },
                {
                  prize: pool.prize,
                  bonus: pool.token.name === "WBNB" ? pool.bonus : undefined,
                  address: "0x1JHG12",
                },
                {
                  prize: pool.prize,
                  bonus: pool.token.name === "WBNB" ? pool.bonus : undefined,
                  address: "0x1JHG13",
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
