"use client";

import { BigNumber, utils } from "ethers";
import { useState } from "react";
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
    pools: [
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
    ],
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
      <div className="grid grid-cols-7 gap-3 text-center">
        {schedules.map(({ day, pools }) => (
          <div
            onClick={() => setSelectedPool({ day, pools })}
            key={dateToDay(day)}
            className="bg-blur-blue bg-blur-pink-hover group relative rounded-[20px]
          border-[5px] border-blue p-8 backdrop-blur-[12.5px] hover:cursor-pointer hover:border-pink"
          >
            <h1 className="absolute top-0 left-0 right-0 mb-8 -translate-y-1/2 text-center text-blue group-hover:text-purple">
              {dateToDay(day)}
            </h1>
            <ul className="group-hover:text-pink">
              {pools.map((pool) => (
                <li className="mb-3 text-right" key={pool.token.contract}>
                  <p className="overflow-hidden text-ellipsis px-1 text-center">
                    {formatValue(pool.prize, pool.token.decimals)}
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
              <div className="absolute right-3 top-0">
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
