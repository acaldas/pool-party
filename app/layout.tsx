import "./globals.css";
import Image from "next/image";
import localFont from "next/font/local";
import BackgroundImg from "@public/background.jpg";
import Header from "@components/header";

const PureJoy = localFont({ src: "../public/fonts/Pure Joy.ttf" });

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
          <div className="relative h-full overflow-auto">
            <Header />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
