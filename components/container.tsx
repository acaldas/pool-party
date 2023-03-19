"use client";

import { App } from "@components/app";
import Header from "@components/header";
import { Transition } from "@headlessui/react";
import BackgroundImg from "@public/background.jpg";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { PureJoy } from "../app/font";

export default function Container({ children }: { children: ReactNode }) {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    setIsShowing(true);
  }, []);

  return (
    <div className={`relative h-full ${PureJoy.className} overflow-hidden`}>
      <Transition show={isShowing} className="h-full">
        <Transition.Child
          enter="transition-opacity duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-[-1%] blur-[3px]">
            <Image
              src={BackgroundImg}
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
        </Transition.Child>
        <Transition.Child
          enter="transition-opacity duration-1000"
          enterFrom="opacity-0 h-full"
          enterTo="opacity-100 h-full"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="relative h-full overflow-auto" id="pool-party">
            <App>
              <Header />
              {children}
            </App>
          </div>
        </Transition.Child>
      </Transition>
    </div>
  );
}
