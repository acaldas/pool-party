import { PoolItem } from "@components/pool-item";
import Schedule from "@components/schedule";
import Timer from "@components/timer";
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

const date = new Date();
date.setHours(0, 0, 0, 0);
date.setDate(date.getDate() + 1);

export default function Home() {
  return (
    <main className="px-[5.1vw] py-[4.3vh] xl:px-[4vw]">
      <div className="mx-auto max-w-[1920px]">
        <h1 className="mb-9 hidden text-center text-xl text-pink md:block">
          PARTYTIMER:{" "}
          <Timer className="pl-1" timeRemaining={date.toUTCString()} />
        </h1>
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
