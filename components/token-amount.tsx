import { BigNumberish } from "ethers";
import Image from "next/image";
import { formatValue } from "../app/utils";

const IconSizes = {
  xs: 25,
  lg: 32,
  xl: 40,
  "2xl": 74,
} as const;

const Margins = {
  xs: 4,
  lg: 12,
  xl: 16,
  "2xl": 36,
} as const;

export default function TokenAmount({
  amount,
  token,
  size = "xs",
  className,
}: {
  amount: BigNumberish;
  token: Token;
  size?: keyof typeof IconSizes;
  className?: string;
}) {
  const iconSize = IconSizes[size];
  return (
    <span className={`inline-flex items-center justify-between ${className}`}>
      <Image
        className="overflow-hidden rounded-md"
        src={token.icon}
        alt={token.name}
        width={iconSize}
        height={iconSize}
        style={{
          marginRight: Margins[size],
        }}
      />
      <span className={`px-1 pt-1 text-${size}`}>
        {formatValue(amount, token.decimals)}
      </span>
    </span>
  );
}
