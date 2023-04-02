import BackdropContainer from "./backdrop-container";
import Reveal from "./reveal";
import TokenAmount from "./token-amount";

interface IProps {
  pools: Pool[];
}
export default async function Winners({ pools }: IProps) {
  const winnerComponents = pools.map((pool) => (
    <div key={pool.token.contract} className="sm:mb-9">
      <h1 className="mb-8 text-xl text-pink sm:mb-2">{`${pool.token.name}.POOL`}</h1>
      <ul>
        {pool.winners.map((winner, index) => (
          <li
            key={index}
            className={`mb-3 grid grid-cols-[auto_auto_auto_auto] gap-5 text-lg xl:gap-3 sm:grid-cols-2 xs:block`}
          >
            <p className="pt-1 text-right text-blue xl:col-span-4 xl:text-left xs:text-center">{`...${winner.address.slice(
              -4
            )}`}</p>
            {winner.prize.map((prize) => (
              <p
                key={prize.token.name}
                className="overflow-hidden text-ellipsis lg:col-span-4 lg:justify-self-start sm:col-span-1"
              >
                <TokenAmount {...prize} size="lg" />
              </p>
            ))}
            {winner.bonus && (
              <p className="overflow-hidden text-ellipsis lg:col-span-4 lg:justify-self-start">
                <TokenAmount {...winner.bonus} size="lg" />
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  ));
  return (
    <BackdropContainer
      className="bg-blur relative mt-4
    rounded-[20px] border-[5px] border-blue p-7 pt-[60px]"
    >
      <h1
        className="absolute top-0 left-0 right-0
    -translate-y-1/2 text-center text-xl text-blue"
      >
        YESTERDAY'S WINNERS
      </h1>
      <div className="flex items-start justify-between text-center sm:hidden">
        {winnerComponents}
      </div>
      <Reveal
        breakpoint="sm"
        className="hidden sm:block"
        header={winnerComponents[0]}
      >
        {winnerComponents.slice(1)}
      </Reveal>
    </BackdropContainer>
  );
}
