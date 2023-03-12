"use client";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { PureJoy } from "../app/font";

export default function tooltip({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`h-7 w-7 cursor-pointer overflow-hidden rounded-full
      border-2 border-white bg-pink hover:bg-pinkDark
      ${className}`}
      >
        <span className="text-[14px] text-white" style={{ textShadow: "none" }}>
          i
        </span>
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="modal relative z-50"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div
          className="fixed inset-0 bg-modal backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Dialog.Panel
            className="relative mx-auto w-full max-w-[608px]
            rounded-[20px] border-[5px] border-blue px-7 pt-[6.6vh] pb-[3.5vh]
            text-center backdrop-blur-[12.5px]"
            style={{
              fontFamily: PureJoy.style.fontFamily,
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
                if your pool wins, You get a percentage of the total bonus and
                the top 3 biggest diver get an additional amount!
              </p>
            </div>
            <button
              className="button h-[50px] w-full rounded-md bg-blue text-white outline-none hover:bg-blueDark"
              style={{ textShadow: "none" }}
              onClick={() => setIsOpen(false)}
            >
              OK, GOT IT!
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
