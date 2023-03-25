import { utils } from "ethers";
import TRUTHImg from "../public/tokens/truth.jpg";
import WBNBImg from "../public/tokens/wbnb.jpg";
import ACCUImg from "../public/tokens/accu.jpg";

export const Tokens = {
  TRUTH: {
    name: "TRUTH",
    icon: TRUTHImg,
    contract: "0xfe64bf14718dfbe64b1ee0c3cc12e76e983487f3",
    decimals: 18,
  },
  WBNB: {
    name: "WBNB",
    icon: WBNBImg,
    contract: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    decimals: 18,
  },
  USDC: {
    name: "USDC",
    icon: ACCUImg,
    contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
  },
} as const;

export function getTokenAmount(amount: string, token: Token) {
  return utils.parseUnits(amount, token.decimals).toString();
}

export const Pools: Pool[] = [
  {
    token: Tokens.TRUTH,
    prize: [
      { token: Tokens.WBNB, amount: getTokenAmount("11133", Tokens.WBNB) },
      { token: Tokens.USDC, amount: getTokenAmount("11133", Tokens.USDC) },
    ],
    bonus: {
      token: Tokens.TRUTH,
      amount: getTokenAmount("11133", Tokens.TRUTH),
    },
    total: getTokenAmount("1499", Tokens.TRUTH),
    people: 1255,
  },
  {
    token: Tokens.WBNB,
    prize: [
      { token: Tokens.TRUTH, amount: getTokenAmount("11133", Tokens.TRUTH) },
      { token: Tokens.USDC, amount: getTokenAmount("11133", Tokens.USDC) },
    ],
    bonus: { token: Tokens.WBNB, amount: getTokenAmount("11133", Tokens.WBNB) },
    total: getTokenAmount("1499", Tokens.WBNB),
    people: 1255,
  },
  {
    token: Tokens.USDC,
    prize: [
      { token: Tokens.TRUTH, amount: getTokenAmount("11133", Tokens.TRUTH) },
      { token: Tokens.WBNB, amount: getTokenAmount("11133", Tokens.WBNB) },
    ],
    bonus: { token: Tokens.USDC, amount: getTokenAmount("11133", Tokens.USDC) },
    total: getTokenAmount("1499", Tokens.USDC),
    people: 1255,
  },
];
