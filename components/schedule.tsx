"use client";

import { BigNumber, utils } from "ethers";
import { useState } from "react";
import { Pools } from "../app/config";
import { formatValue } from "../app/utils";
import BackdropContainer from "./backdrop-container";
import DialogBoost from "./dialog-boost";
import TooltipBonus from "./tooltip-bonus";

export type ScheduledPools = {
  day: Date;
  pools: Pool[];
};

const Weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function dateDiffInDays(a: Date, b: Date) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

const today = new Date();

export function dateToDay(date: Date) {
  const diff = dateDiffInDays(today, date);
  if (diff === 1) {
    return "TOMORROW";
  } else {
    return Weekday[date.getDay()].toUpperCase();
  }
}

const schedules: ScheduledPools[] = new Array(7).fill("").map((_, index) => {
  const day = new Date(today);
  day.setDate(today.getDate() + index + 1);
  return {
    day,
    pools: Pools,
  };
});

export default function Schedule() {
  const [selectedPool, setSelectedPool] = useState<ScheduledPools | undefined>(
    undefined
  );

  return (
    <BackdropContainer
      className="bg-blur relative mt-4
    rounded-[20px] border-[5px] border-purple p-7 px-[50px] pt-[60px]"
    >
      <h1
        className="absolute top-0 left-0 right-0
    -translate-y-1/2 text-center text-xl text-purple"
      >
        PRICE POOL SCHEDULE
      </h1>
      <div className="grid grid-cols-7 gap-3 text-center lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1">
        {schedules.map(({ day, pools }) => (
          <div
            onClick={() => setSelectedPool({ day, pools })}
            key={dateToDay(day)}
            className="bg-blur-blue bg-blur-pink-hover group relative rounded-[20px] border-[5px]
          border-blue p-1 py-8 backdrop-blur-[12.5px] hover:cursor-pointer hover:border-pink lg:mb-7"
          >
            <h1 className="absolute top-0 left-0 right-0 mb-8 -translate-y-1/2 text-center text-blue group-hover:text-purple">
              {dateToDay(day)}
            </h1>
            <ul className="group-hover:text-pink">
              {pools.map((pool) => (
                <li className="mb-3 text-right" key={pool.token.name}>
                  <p className="overflow-hidden text-ellipsis px-1 text-center">
                    {formatValue(pool.bonus.amount, pool.bonus.token.decimals)}{" "}
                    {pool.bonus.token.name}
                  </p>
                </li>
              ))}
              <li>
                <p className="text-sm text-pink group-hover:text-purple">
                  AND COUNTING!
                </p>
              </li>
            </ul>
            <div className="absolute top-full left-0 right-0 mb-8 -translate-y-1/2">
              <button className="button px-2 text-sm" style={{ height: 28 }}>
                BOOST POOL
              </button>
              <div className="absolute right-3 top-0 xl:right-0 lg:right-3">
                <TooltipBonus />
              </div>
            </div>
          </div>
        ))}
      </div>
      <DialogBoost
        scheduledPool={selectedPool}
        onClose={() => setSelectedPool(undefined)}
      />
    </BackdropContainer>
  );
}
