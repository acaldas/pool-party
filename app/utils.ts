import { BigNumberish, BigNumber, utils } from "ethers";

export function formatValue(value: BigNumberish, decimals: number) {
  const balance = BigNumber.from(value);
  const remainder = balance.mod(1 ** decimals); // TODO test decimals instead of 14 USDC=6
  return utils.commify(utils.formatUnits(balance.sub(remainder), decimals));
}
