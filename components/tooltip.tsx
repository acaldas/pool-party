import { useState, ReactElement } from "react";
import { Dialog } from "@headlessui/react";
import { PureJoy } from "../app/font";

export default function tooltip({
  children,
  className,
}: {
  children: (ctx: { onClose: () => void }) => ReactElement;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
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
        style={{ fontFamily: PureJoy.style.fontFamily }}
      >
        <div
          className="fixed inset-0 bg-modal backdrop-blur-sm"
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          {children({ onClose: () => setIsOpen(false) })}
        </div>
      </Dialog>
    </>
  );
}
