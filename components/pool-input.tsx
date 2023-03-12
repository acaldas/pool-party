"use client";

import { BigNumber, BigNumberish } from "ethers";
import { useCallback, useMemo, useState } from "react";
import Slider from "./slider";

function Input({
  value,
  onChange,
}: {
  value: BigNumberish;
  onChange: (value: BigNumberish) => void;
}) {
  return (
    <div className="relative h-[50px] rounded-lg border-2 border-blue bg-white">
      <h2 className="absolute left-3 -top-2 text-sm text-blue">
        YOU WILL JOIN WITH
      </h2>
      <input
        className="h-full w-full rounded-lg px-3 text-right text-lg text-pink outline-none"
        value={value.toString()}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function PoolInput() {
  const maxValue = BigNumber.from("20000");
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
        <Input value={value} onChange={handleValue} />
      </div>
    </div>
  );
}
