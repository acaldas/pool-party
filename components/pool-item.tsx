import { ReactNode } from "react";

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
      className={`bg-blueLight backdrop-blur-[5px] rounded-[11px]
      relative mt-3 text-center pt-5 pb-2 flex items-center justify-center ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 -translate-y-1/2">
        {title}
      </div>
      {children}
    </div>
  );
}

export function PoolItem({ token, prize, total, people }: Pool) {
  return (
    <div
      className="relative border-blue border-[5px] backdrop-blur-[20px]
     bg-blur p-7 rounded-[20px] w-full max-w-[544px] mt-4
     [&:nth-child(2n)]:justify-self-center [&:nth-child(3n)]:justify-self-end"
    >
      <h1
        className="absolute top-0 left-0 right-0
      text-center -translate-y-1/2 text-pink text-xl"
      >{`${token.name}.POOL`}</h1>
      <Panel className="mb-6" title={<h2 className="text-blue">PRIZEPOOL</h2>}>
        <div>{prize.toString()}</div>
      </Panel>
      <div className="grid grid-cols-3 gap-2 mb-8">
        <Panel title={<h2 className="text-blue text-sm">PARTY PEOPLE</h2>}>
          {people.toString()}
        </Panel>
        <Panel title={<h2 className="text-blue text-sm">BIGGEST DIVERS</h2>}>
          <div className="">
            <p>{people.toString()}</p>
            <p className="my-[1px]">{people.toString()}</p>
            <p>{people.toString()}</p>
          </div>
        </Panel>
        <Panel title={<h2 className="text-blue text-sm">TOTAL POOL ENTRY</h2>}>
          {total.toString()}
        </Panel>
      </div>
      <div className="grid grid-cols-2 gap-5 mb-8">
        <Panel
          className="border-pink border-[5px]"
          title={<h2 className="text-lg text-pink">TO WIN</h2>}
        >
          <div>
            <p className="text-xl">66%</p>
          </div>
        </Panel>

        <Panel
          className="border-blue border-[5px]"
          title={<h2 className="text-lg text-blue">BONUSPOOL</h2>}
        >
          66%
        </Panel>
      </div>
      <button className="button w-full">DIVE IN THE PARTY POOL</button>
    </div>
  );
}
