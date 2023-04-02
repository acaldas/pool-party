import { BigNumber } from "ethers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import {
  useDailyPoolBuyTickets,
  useErc20Allowance,
  useErc20Approve,
  usePrepareDailyPoolBuyTickets,
  usePrepareErc20Approve,
} from "../../app/generated";
import useDebounce from "../../hooks/use-debounce";

export default function PoolDive({
  amount,
  pool,
}: {
  amount: BigNumber;
  pool: Pool;
}) {
  const router = useRouter();
  const account = useAccount();
  const debouncedAmount = useDebounce(amount, 500);

  const allowance = useErc20Allowance({
    address: pool.token.contract,
    args: [account.address!, pool.address],
    enabled: !!account.address && !amount.isZero(),
  });

  const hasAllowance = allowance.data?.gte(debouncedAmount);

  const { config: approveConfig } = usePrepareErc20Approve({
    address: pool.token.contract,
    args: [pool.address, amount],
    enabled: !!account.address && !hasAllowance,
  });
  const {
    writeAsync: approve,
    isSuccess: approveSuccess,
    isLoading: approveLoading,
    reset: approveReset,
    data: approveTx,
  } = useErc20Approve(approveConfig);

  const { config } = usePrepareDailyPoolBuyTickets({
    address: pool.address,
    args: [debouncedAmount],
    enabled: !debouncedAmount.isZero() && hasAllowance,
  });
  const {
    writeAsync: buy,
    isLoading: buyLoading,
    isSuccess: buySuccess,
  } = useDailyPoolBuyTickets(config);

  const handleClick = async () => {
    if (!hasAllowance) {
      approve!();
    } else {
      buy!();
    }
  };

  async function buyTickets() {
    const result = await buy!();
    await result.wait();
    router.replace("");
  }

  useEffect(() => {
    // if approve was just run then refetches allowance
    if (approveSuccess && !buy) {
      console.log("WAIT FOR APPROVE");
      approveTx?.wait().then(() => {
        allowance.refetch();
      });
    }

    if (approveSuccess && !buyLoading && buy) {
      console.log("TRIGGER buy", buyLoading);
      approveReset();
      buyTickets();
    }
  }, [approveSuccess, buyLoading, buy]);

  const loading = approveLoading || buyLoading;

  return (
    <button
      className={`button w-full ${loading && "animate-pulse"}`}
      disabled={!(hasAllowance ? buy : approve)}
      onClick={handleClick}
    >
      DIVE IN THE PARTY POOL
    </button>
  );
}
