import "./globals.css";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import BackgroundImg from "@public/background.jpg";
import { App } from "@components/app";
import Header from "@components/header";
import { PureJoy } from "./font";
import Container from "@components/container";

export const metadata = {
  title: "Pool Party",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={`relative h-full overflow-hidden`}>
          <div className="absolute inset-[-1%]">
            <Image
              src={BackgroundImg}
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
          <Container>{children}</Container>
        </div>
      </body>
    </html>
  );
}
