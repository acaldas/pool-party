"use client";
import { ConnectKitButton } from "connectkit";

export default function ConnectButton() {
  return (
    <ConnectKitButton.Custom>
      {({ show, isConnected, truncatedAddress }) => {
        return (
          <button className="button w-[320px] xs:w-auto xs:px-4" onClick={show}>
            {isConnected ? truncatedAddress : "CONNECT WALLET"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
