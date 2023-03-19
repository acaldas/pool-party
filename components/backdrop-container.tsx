"use client";
import { motion, MotionProps } from "framer-motion";

export default function BackdropContainer(
  props: MotionProps & { className: string; blur?: number }
) {
  return (
    <motion.div
      {...props}
      animate={{
        backdropFilter: ["blur(1px)", `blur(${props.blur ?? 20}px)`],
      }}
      transition={{ duration: 1, delay: 1.5 }}
    />
  );
}
