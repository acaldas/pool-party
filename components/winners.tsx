import { BigNumberish, utils } from "ethers";
import { formatValue } from "../app/utils";
import BackdropContainer from "./backdrop-container";
import TokenAmount from "./token-amount";

interface IProps {
  winners: {
    pool: Pool;
    winners: {
      address: string;
      prize: Pool["prize"];
      bonus?: Pool["bonus"];
    }[];
  }[];
}

export default function Winners({ winners }: IProps) {
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
      <div className="flex items-start justify-between text-center">
        {winners.map(({ pool, winners }) => (
          <div key={pool.token.contract}>
            <h1 className="mb-8 text-xl text-pink">{`${pool.token.name}.POOL`}</h1>
            <ul>
              {winners.map((winner) => (
                <li
                  className={`mb-3 grid gap-7 text-lg ${
                    !winner.bonus ? "grid-cols-3" : "grid-cols-4 "
                  }`}
                >
                  <p className="text-right text-blue">{`...${winner.address.slice(
                    -4
                  )}`}</p>
                  {winner.prize.map((prize) => (
                    <p className="overflow-hidden text-ellipsis">
                      <TokenAmount {...prize} size="lg" />
                    </p>
                  ))}
                  {winner.bonus && (
                    <p className="overflow-hidden text-ellipsis">
                      <TokenAmount {...winner.bonus} size="lg" />
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </BackdropContainer>
  );
}
