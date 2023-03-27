"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import useMediaQuery from "../hooks/use-media-query";
import resolveConfig from "tailwindcss/resolveConfig";
import TailwindConfig from "../tailwind.config";

type Breakpoint = "xl" | "lg" | "md" | "sm" | "xs";

const Breakpoints = resolveConfig(TailwindConfig).theme!.screens! as Record<
  Breakpoint,
  { max: string }
>;

export default function Reveal({
  children,
  header,
  className,
  buttonClassName,
  breakpoint = "md",
}: {
  children: ReactNode | ReactNode[];
  header: ReactNode | ReactNode[];
  breakpoint?: Breakpoint;
  className?: string;
  buttonClassName?: string;
}) {
  const query = Breakpoints[breakpoint].max;
  if (!query) {
    throw new Error(`Breakpoont ${breakpoint} not found!`);
  }

  const isSmall = useMediaQuery(`(max-width: ${query})`);
  const [revealed, setRevealed] = useState(!isSmall);

  useEffect(() => {
    if (isSmall) {
      setRevealed(false);
    }
  }, [isSmall]);

  return (
    <div className={className}>
      {header}
      {revealed ? (
        <AnimatePresence>
          <motion.div
            className="contents"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                opacity: {
                  duration: 0.4,
                },
              },
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      ) : (
        <button
          className={`button w-full ${buttonClassName}`}
          onClick={() => setRevealed(true)}
        >
          SHOW ME MORE INFO
        </button>
      )}
    </div>
  );
}
