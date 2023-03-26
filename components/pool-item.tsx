import BackdropContainer from "./backdrop-container";
import PoolItemDefault from "./pool-item-default";
import PoolItemFinished from "./pool-item-finished";
import PoolItemPlaying from "./pool-item-playing";

export interface IPoolItemProps<T extends PoolState = PoolState> {
  pool: Pool;
  state: T;
}

type PoolItemComponent<T extends PoolState> = (
  props: IPoolItemProps<T>
) => JSX.Element;

function getPoolComponent<T extends PoolState>(state: T): PoolItemComponent<T> {
  switch (state.state) {
    case "Default":
      return PoolItemDefault as PoolItemComponent<T>;
    case "Playing":
      return PoolItemPlaying as PoolItemComponent<T>;
    case "Finished":
      return PoolItemFinished as PoolItemComponent<T>;
  }
}

export function PoolItem<T extends PoolState>({
  pool,
  state,
}: IPoolItemProps<T>) {
  const { token } = pool;
  const PoolComponent = getPoolComponent<T>(state);
  return (
    <BackdropContainer
      className="bg-blur relative my-4 min-h-[610px] w-full max-w-[544px]
          rounded-[20px] border-[5px] border-blue p-5 pt-[60px] md:col-span-2 md:justify-self-center
          [&:nth-child(2n)]:justify-self-center lg:[&:nth-child(2n)]:justify-self-end  md:[&:nth-child(2n)]:justify-self-center
          [&:nth-child(3n)]:justify-self-end lg:[&:nth-child(3n)]:col-span-2 lg:[&:nth-child(3n)]:justify-self-center"
    >
      <h1
        className="absolute top-0 left-0 right-0
      -translate-y-1/2 text-center text-xl text-pink"
      >{`${token.name}.POOL`}</h1>
      <PoolComponent pool={pool} state={state} />
    </BackdropContainer>
  );
}
