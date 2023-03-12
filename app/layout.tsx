import "./globals.css";
import Image from "next/image";
import BackgroundImg from "@public/background.jpg";
import { App } from "@components/app";
import Header from "@components/header";
import { PureJoy } from "./font";

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
        <div className={`h-full relative ${PureJoy.className} overflow-hidden`}>
          <div className="blur-[3px] absolute inset-[-1%]">
            <Image src={BackgroundImg} alt="" fill className="object-cover" />
          </div>
          <div className="relative h-full overflow-auto" id="pool-party">
            <App>
              <Header />
              {children}
            </App>
          </div>
        </div>
      </body>
    </html>
  );
}
