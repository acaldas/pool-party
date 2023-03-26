import { formatValue } from "../app/utils";
import Panel from "./panel";
import PoolInput from "./pool-input";
import { IPoolItemProps } from "./pool-item";
import TokenAmount from "./token-amount";
import TooltipBonus from "./tooltip-bonus";

export default function PoolItemDefault({
  pool,
}: IPoolItemProps<PoolStateDefault>) {
  const { token, prize, total, people, bonus } = pool;
  return (
    <>
      <Panel className="mb-6" title={<h2 className="text-blue">PRIZEPOOL</h2>}>
        <div
          className={`grid grid-cols-${prize.length} w-full justify-items-center py-7 xs:grid-cols-1`}
        >
          {prize.map(({ token, amount }) => (
            <TokenAmount
              key={token.name}
              token={token}
              amount={amount}
              size="xl"
              className="xs:mb-3"
            />
          ))}
        </div>
      </Panel>
      <div className="mb-8 grid grid-cols-3 gap-2 xl:grid-cols-2">
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
        <Panel
          className="xl:col-span-2"
          title={<h2 className="text-sm text-blue">TOTAL POOL ENTRY</h2>}
        >
          {formatValue(total.toString(), token.decimals)}
        </Panel>
      </div>
      <div className="text-center">
        <h1 className="mb-7 text-lg text-pink">DIVE IN THE PARTY WITH</h1>
        <PoolInput pool={pool}>
          <div className="my-8 grid grid-cols-2 gap-3 xl:grid-cols-1">
            <Panel
              className="border-[5px] border-pink"
              title={<h2 className="text-lg text-pink">TO WIN</h2>}
            >
              <div className="inline-flex w-full items-center justify-evenly">
                <p className="mr-2 pr-2 pl-4 text-right text-xl">66%</p>
                <div className="flex flex-col pr-1 text-left">
                  {prize.map(({ token, amount }) => (
                    <TokenAmount
                      key={token.name}
                      token={token}
                      amount={amount}
                      size="xs"
                    />
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
    </>
  );
}
