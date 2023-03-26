import { formatValue } from "../app/utils";
import { IPoolItemProps } from "./pool-item";

export default function PoolItemPlaying({
  pool,
  state,
}: IPoolItemProps<PoolStatePlaying>) {
  return (
    <div className="flex h-full flex-col justify-between text-center">
      <span className="h-[100px]" />
      <div>
        <h1 className="mb-3 text-2xl text-pink">YOU ARE IN THE POOLPARTY</h1>
        <h2 className="mx-auto max-w-[440px] text-lg uppercase">
          Come back when the timer is over to claim your winnings!
        </h2>
      </div>
      <div className="">
        <h3 className="mb-3 text-lg text-blue">YOUR ENTRY</h3>
        <h3 className="text-lg text-pink">
          {formatValue(state.entry, pool.token.decimals)}
          <span className="pl-3">{pool.token.name}</span>
        </h3>
      </div>
      <button className="button w-full justify-self-end !bg-gray" disabled>
        Claim winnings
      </button>
    </div>
  );
}
