"use client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BigNumberish } from "ethers";
import { useState } from "react";
import { IPoolItemProps } from "./pool-item";
import TokenAmount from "./token-amount";

export default function PoolItemFinished({
  pool,
  state,
}: IPoolItemProps<PoolStateFinished>) {
  const router = useRouter();

  const [claimStatus, setClaimStatus] = useState<
    "initial" | "loading" | "claimed"
  >("initial");

  async function claimWinnings() {
    setClaimStatus("loading");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setClaimStatus("claimed");
    } catch (error) {
      console.error(error);
      setClaimStatus("initial");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {claimStatus === "claimed" ? (
        <motion.div
          key="claimed"
          className="flex h-full flex-col justify-between text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div>
            <h1 className="pt-6 pb-4 text-2xl text-blue">YOU WON!</h1>
            <p className="text-sm uppercase">
              We’ve automatically put the prices in your wallet!
            </p>
          </div>
          <div className="">
            {state.prize.map(
              (prize: { amount: BigNumberish; token: Token }) => (
                <TokenAmount
                  {...prize}
                  size="2xl"
                  className="my-4"
                  key={prize.token.name}
                />
              )
            )}
          </div>
          <div className={`${!pool.bonus?.amount && "opacity-0"}`}>
            <h3 className="mb-5 text-lg text-blue">YOU WON A BONUS!</h3>
            <TokenAmount
              className="text-pink"
              token={pool.bonus.token}
              amount={state.bonus?.amount ?? "0"}
              size="2xl"
            />
          </div>
          {/* TODO CHECK IF REFRESH WORKS TO GET TO NEXT POOL */}
          <button className="button w-full" onClick={() => router.refresh()}>
            back to the pool!
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="initial"
          className="flex h-full flex-col justify-between text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button className="button pointer-events-none opacity-0" />
          <div>
            <h1 className="mb-3 text-2xl uppercase text-pink">
              claim your winnings!
            </h1>
            <h2 className="mx-auto max-w-[286px] text-lg uppercase">
              they’re waiting for you!
            </h2>
          </div>
          <button
            className={`button w-full ${
              claimStatus === "loading" && "animate-pulse"
            }`}
            disabled={claimStatus !== "initial"}
            onClick={claimWinnings}
          >
            Claim winnings
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
