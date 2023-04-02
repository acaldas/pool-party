"use client";

import { BigNumber, BigNumberish, utils } from "ethers";
import { ReactNode, useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { useErc20BalanceOf } from "../app/generated";
import { formatValue } from "../app/utils";
import PoolBoost from "./actions/pool-boost";
import PoolDive from "./actions/pool-dive";
import Slider from "./slider";

function Input({
  value,
  onChange,
  decimals,
}: {
  value: BigNumberish;
  onChange: (value: BigNumberish) => void;
  decimals: number;
}) {
  return (
    <div className="relative h-[50px] rounded-lg border-2 border-blue bg-white">
      <h2 className="absolute left-3 -top-2 text-sm text-blue">
        YOU WILL JOIN WITH
      </h2>
      <input
        className="h-full w-full rounded-lg px-3 text-right text-lg text-pink outline-none"
        value={formatValue(value, decimals)}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function PoolInput({
  pool,
  children,
  action,
}: {
  pool: Pool;
  children?: ReactNode;
  action: "dive" | { action: "boost"; day: BigNumberish };
}) {
  const { token } = pool;
  const { address } = useAccount();

  const { data: balance } = useErc20BalanceOf({
    address: token.contract,
    args: [address || "0x00"],
    enabled: false,
  });

  let maxValue = BigNumber.from("0");

  if (balance && !balance.eq(maxValue)) {
    maxValue = balance;
  }

  const [value, setValue] = useState(BigNumber.from("0"));
  const [percentage, setPercentage] = useState(0);

  const handlePercentage = useCallback((newPercentage: number) => {
    const newValue = maxValue
      .mul(100)
      .mul(Math.round(newPercentage * 100))
      .div(10000);
    setValue((value) => {
      return newValue.eq(value) ? value : newValue;
    });
    setPercentage(newPercentage);
  }, []);

  const handleValue = useCallback((newValueStr: BigNumberish) => {
    const newValue = BigNumber.from(
      utils.parseUnits(newValueStr.toString(), token.decimals)
    );
    setValue(newValue);

    let newPercentage =
      newValue.mul(100).div(maxValue).mul(100).toNumber() / 10000;
    newPercentage = Math.max(0, newPercentage);
    newPercentage = Math.min(1, newPercentage);
    setPercentage(newPercentage);
  }, []);

  return (
    <div>
      <Slider percentage={percentage} onChange={handlePercentage} />
      <div className="pt-7">
        <Input value={value} onChange={handleValue} decimals={token.decimals} />
      </div>
      {children}
      {action === "dive" ? (
        <PoolDive pool={pool} amount={value} />
      ) : (
        <PoolBoost pool={pool} amount={value} day={action.day} />
      )}
    </div>
  );
}
