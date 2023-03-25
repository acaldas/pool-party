import { Dialog } from "@headlessui/react";
import { PureJoy } from "../app/font";
import PoolInput from "./pool-input";
import { dateToDay, ScheduledPools } from "./schedule";
import { formatValue } from "../app/utils";
import TokenAmount from "./token-amount";

export default function DialogBoost({
  scheduledPool,
  onClose,
}: {
  scheduledPool?: ScheduledPools;
  onClose: () => void;
}) {
  const day = dateToDay(scheduledPool?.day || new Date());
  return (
    <Dialog
      open={!!scheduledPool}
      onClose={onClose}
      className="modal relative z-50"
      style={{ fontFamily: PureJoy.style.fontFamily }}
    >
      <div
        className="fixed inset-0 bg-modal backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="relative mx-auto w-[90%] max-w-[1200px]
            rounded-[20px] border-[5px] border-pinkDark px-7 pt-[6.6vh] pb-[3.5vh]
            text-center backdrop-blur-[12.5px]"
          style={{
            background:
              "linear-gradient(0deg, rgba(83, 214, 255, 0.05), rgba(83, 214, 255, 0.05)), rgba(255, 255, 255, 0.5)",
          }}
        >
          <Dialog.Title className="absolute top-0 left-0 right-0 -translate-y-1/2 text-xl">
            {`BOOST ${day}'S POOL`}
          </Dialog.Title>
          <p className="mx-auto mb-[50px] max-w-[744px]">
            Poolboosters are amongst to most kind of people at the pool, as by
            boosting a pool, you make a gift to the community!
          </p>
          <div className="grid grid-cols-3 gap-6">
            {scheduledPool?.pools.map((pool) => (
              <div
                className="relative rounded-[20px] border-[5px] border-pinkDark p-6
                    text-center text-purple backdrop-blur-[12.5px]"
              >
                <h2 className="absolute top-0 left-0 right-0 -translate-y-1/2 text-xl text-pinkDark">{`${pool.token.name}.POOL`}</h2>
                <div className="mb-8 mt-6">
                  <p className="mb-4 text-blue">CURRENT VALUE</p>
                  <div className="inline-flex">
                    <TokenAmount
                      className="overflow-hidden text-ellipsis"
                      size="xl"
                      {...pool.bonus}
                    />
                  </div>
                </div>
                <PoolInput pool={pool}>
                  <div className="mt-8">
                    <button className="button w-full">{`BOOST ${pool.token.name}.POOL`}</button>
                  </div>
                </PoolInput>
              </div>
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
