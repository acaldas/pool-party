"use client";
import { Dialog } from "@headlessui/react";
import Tooltip from "./tooltip";

export default function TooltipBonus() {
  return (
    <Tooltip>
      {({ onClose }) => (
        <Dialog.Panel
          className="relative mx-auto w-full max-w-[608px]
    rounded-[20px] border-[5px] border-blue px-7 pt-[6.6vh] pb-[3.5vh]
    text-center backdrop-blur-[12.5px]"
          style={{
            background:
              "linear-gradient(0deg, rgba(83, 214, 255, 0.05), rgba(83, 214, 255, 0.05)), rgba(255, 255, 255, 0.5)",
          }}
        >
          <Dialog.Title className="absolute top-0 left-0 right-0 -translate-y-1/2 text-xl">
            THE BONUSPOOL
          </Dialog.Title>
          <div className="mx-auto mb-[50px] max-w-[450px]">
            <p className="mb-6 uppercase">
              The Bonus Pool is won by the Pool which has deposited the most
              value in usdc when the Party starts and the time is up!
            </p>
            <p className="uppercase text-pink">
              if your pool wins, You get a percentage of the total bonus and the
              top 3 biggest diver get an additional amount!
            </p>
          </div>
          <button
            className="button h-[50px] w-full rounded-md bg-blue text-white outline-none hover:bg-blueDark"
            style={{ textShadow: "none" }}
            onClick={onClose}
          >
            OK, GOT IT!
          </button>
        </Dialog.Panel>
      )}
    </Tooltip>
  );
}
