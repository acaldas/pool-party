"use client";
import { ConnectKitButton } from "connectkit";

export default function ConnectButton() {
  return (
    <ConnectKitButton.Custom>
      {({ show, isConnected, truncatedAddress }) => (
        <button className="button w-[320px]" onClick={show}>
          {isConnected ? truncatedAddress : "CONNECT WALLET"}
        </button>
      )}
    </ConnectKitButton.Custom>
  );
}
