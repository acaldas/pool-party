"use client";

import { BigNumber, BigNumberish } from "ethers";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { useErc20BalanceOf } from "../app/generated";
import { formatValue } from "../app/utils";
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
}: {
  pool: Pool;
  children?: ReactNode;
}) {
  const { token } = pool;
  const { address } = useAccount();

  const contract = useErc20BalanceOf({
    address: token.contract,
    args: [address || "0x00"],
    enabled: !!address,
  });

  const maxValue = useMemo(() => {
    return contract.data ?? BigNumber.from("0");
  }, [contract]);
  const [value, setValue] = useState(BigNumber.from("0"));
  const [initialPercentage, setPercentage] = useState(0);

  const handlePercentage = useCallback((newPercentage: number) => {
    const newValue = maxValue
      .mul(100)
      .mul(Math.round(newPercentage * 100))
      .div(10000);
    setValue((value) => (newValue.eq(value) ? value : newValue));
    // setPercentage(newPercentage);
  }, []);

  const handleValue = useCallback((newValue: BigNumberish) => {
    let newPercentage =
      BigNumber.from(newValue).mul(100).div(maxValue).mul(100).toNumber() /
      10000;
    newPercentage = Math.max(0, newPercentage);
    newPercentage = Math.min(1, newPercentage);
    setPercentage(newPercentage);
    setValue(BigNumber.from(newValue));
  }, []);

  return (
    <div>
      <Slider percentage={initialPercentage} onChange={handlePercentage} />
      <div className="pt-7">
        <Input value={value} onChange={handleValue} decimals={token.decimals} />
      </div>
      {children}
    </div>
  );
}
