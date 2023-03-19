"use client";
import { WagmiConfig, createClient } from "wagmi";
import { mainnet, bsc, bscTestnet, localhost } from "wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { ReactNode } from "react";
import { PureJoy } from "../app/font";

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

const CHAINS = [mainnet, bsc, bscTestnet, localhost];

const client = createClient(
  getDefaultClient({
    appName: "Pool Party",
    alchemyId,
    chains: CHAINS,
  })
);

const customTheme = {
  "--ck-body-background": "rgba(18, 175, 224, 0.75)",
  "--ck-font-family": PureJoy.style.fontFamily,
  "--ck-body-color": "#DD008B",
  "--ck-primary-button-background": "rgba(157, 208, 222, 0.75)",
  "--ck-primary-button-hover-background": "rgba(157, 208, 222, 1)",
  "--ck-primary-button-color": "#6C02EA",
  "--ck-secondary-button-background": "rgba(157, 208, 222, 0.75)",
  "--ck-secondary-button-hover-background": "rgba(157, 208, 222, 1)",
  "--ck-secondary-button-color": "#6C02EA",
  "--ck-body-color-muted": "#3082FF",
  "--ck-body-color-muted-hover": "#0088CC",
  "--ck-body-action-color": "#3082FF",
  "--ck-body-background-secondary": "rgb(48, 135, 166)",
};

export function App({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider
        customTheme={customTheme}
        options={{ hideQuestionMarkCTA: true }}
      >
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
