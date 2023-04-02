"use client";
import { PoolItem } from "@components/pool-item";
import Timer from "@components/timer";
import { ReactNode } from "react";
import { useAccount } from "wagmi";

const date = new Date();
date.setHours(0, 0, 0, 0);
date.setDate(date.getDate() + 1);

export default function Home({
  pools,
  children,
}: {
  pools: Pool[];
  children: ReactNode;
}) {
  const account = useAccount();
  return (
    <main className="px-[5.1vw] py-[4.3vh] xl:px-[4vw]">
      <div className="mx-auto max-w-[1920px]">
        <h1 className="mb-9 hidden text-center text-xl text-pink md:block">
          PARTYTIMER:{" "}
          <Timer className="pl-1" timeRemaining={date.toUTCString()} />
        </h1>
        <div className="mb-[4.3vh] grid grid-cols-3 justify-center gap-[2vw] lg:grid-cols-2">
          {pools.map((pool, index) => (
            <PoolItem
              key={pool.token.name}
              pool={pool}
              state={{ state: "Default" }}
            />
          ))}
        </div>
        {children}
      </div>
    </main>
  );
}
