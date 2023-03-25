import { BigNumber, BigNumberish } from "ethers";
import { ReactNode } from "react";
import { formatValue } from "../app/utils";
import BackdropContainer from "./backdrop-container";
import PoolInput from "./pool-input";
import TokenAmount from "./token-amount";
import TooltipBonus from "./tooltip-bonus";

function Panel({
  title,
  children,
  className,
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative mt-3 flex
      items-center justify-center rounded-[11px] bg-blueLight pt-5 pb-2 text-center backdrop-blur-[5px] ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 -translate-y-1/2">
        {title}
      </div>
      {children}
    </div>
  );
}

export function PoolItem(pool: Pool) {
  const { token, prize, total, people, bonus } = pool;

  return (
    <BackdropContainer
      className="bg-blur relative mt-4 w-full
          max-w-[544px] rounded-[20px] border-[5px] border-blue p-5 pt-[60px]
          [&:nth-child(2n)]:justify-self-center [&:nth-child(3n)]:justify-self-end"
    >
      <h1
        className="absolute top-0 left-0 right-0
      -translate-y-1/2 text-center text-xl text-pink"
      >{`${token.name}.POOL`}</h1>
      <Panel className="mb-6" title={<h2 className="text-blue">PRIZEPOOL</h2>}>
        <div
          className={`grid grid-cols-${prize.length} w-full justify-items-center py-7`}
        >
          {prize.map(({ token, amount }) => (
            <TokenAmount token={token} amount={amount} size="xl" />
          ))}
        </div>
      </Panel>
      <div className="mb-8 grid grid-cols-3 gap-2">
        <Panel title={<h2 className="text-sm text-blue">PARTY PEOPLE</h2>}>
          {people.toString()}
        </Panel>
        <Panel title={<h2 className="text-sm text-blue">BIGGEST DIVERS</h2>}>
          <div className="">
            <p>{people.toString()}</p>
            <p className="my-[1px]">{people.toString()}</p>
            <p>{people.toString()}</p>
          </div>
        </Panel>
        <Panel title={<h2 className="text-sm text-blue">TOTAL POOL ENTRY</h2>}>
          {formatValue(total.toString(), token.decimals)}
        </Panel>
      </div>
      <div className="text-center">
        <h1 className="mb-7 text-lg text-pink">DIVE IN THE PARTY WITH</h1>
        <PoolInput pool={pool}>
          <div className="my-8 grid grid-cols-2 gap-3">
            <Panel
              className="border-[5px] border-pink"
              title={<h2 className="text-lg text-pink">TO WIN</h2>}
            >
              <div className="flex w-full items-center justify-between p-3">
                <p className="mr-2 pl-1 text-xl">66%</p>
                <div className="grid gap-2">
                  {prize.map(({ token, amount }) => (
                    <TokenAmount token={token} amount={amount} size="xs" />
                  ))}
                </div>
              </div>
            </Panel>
            <Panel
              className="border-[5px] border-blue py-2"
              title={
                <div className="mx-auto inline-block items-center whitespace-nowrap">
                  <h2 className="mr-2 inline-block text-[28px] text-blue">
                    BONUSPOOL
                  </h2>
                  <div className="inline-block translate-x-1">
                    <TooltipBonus />
                  </div>
                </div>
              }
            >
              <div>
                <p className="mb-2">
                  {formatValue(bonus.amount, bonus.token.decimals)}{" "}
                  {bonus.token.name}
                </p>
                <p className="text-sm text-pink">AND COUNTING!</p>
              </div>
            </Panel>
          </div>
          <button className="button w-full">DIVE IN THE PARTY POOL</button>
        </PoolInput>
      </div>
    </BackdropContainer>
  );
}
