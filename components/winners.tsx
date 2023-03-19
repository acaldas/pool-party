import { BigNumberish, utils } from "ethers";
import { formatValue } from "../app/utils";
import BackdropContainer from "./backdrop-container";

interface IProps {
  winners: {
    pool: Pool;
    winners: {
      address: string;
      prize: BigNumberish;
      bonus: BigNumberish;
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
      <div className="grid grid-cols-3 gap-6 text-center">
        {winners.map(({ pool, winners }) => (
          <div key={pool.token.contract}>
            <h1 className="mb-8 text-xl text-pink">{`${pool.token.name}.POOL`}</h1>
            <ul>
              {winners.map((winner) => (
                <li className="mb-3 grid grid-cols-3 text-lg">
                  <p className="text-blue">{`...${winner.address.slice(
                    -4
                  )}`}</p>
                  <p className="overflow-hidden text-ellipsis">
                    {formatValue(winner.prize, pool.token.decimals)}
                  </p>
                  <p className="overflow-hidden text-ellipsis">
                    {
                      formatValue(
                        winner.bonus,
                        pool.token.decimals
                      ) /* TODO bonus decimals */
                    }
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </BackdropContainer>
  );
}
