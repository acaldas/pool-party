import { motion, useDragControls, useMotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

interface IProps {
  percentage: number;
  onChange: (percentage: number) => void;
}

const SLIDER_WIDTH = 32;

export default function Slider({
  percentage: initialPercentage,
  onChange,
}: IProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const [percentage, setPercentage] = useState(initialPercentage);

  function startDrag(event: React.PointerEvent) {
    dragControls.start(event, { snapToCursor: true });
  }

  useEffect(() => {
    function updateX(value: number) {
      if (!constraintsRef.current) {
        return;
      }

      const maxSlide = constraintsRef.current.clientWidth - SLIDER_WIDTH;
      let newValue = value;
      if (value > maxSlide) {
        newValue = maxSlide;
        x.set(newValue);
      } else if (value < 0) {
        newValue = 0;
        x.set(newValue);
      }
      setPercentage(newValue / maxSlide);
    }
    const unsubscribeX = x.on("change", updateX);

    return () => {
      unsubscribeX();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMemo(() => {
    if (!constraintsRef.current) {
      return;
    }
    const maxSlide = constraintsRef.current.clientWidth - SLIDER_WIDTH;
    x.set(maxSlide * initialPercentage);
  }, [initialPercentage]);

  useEffect(() => {
    onChange(percentage);
  }, [onChange, percentage]);

  return (
    <>
      <motion.div className="relative mr-[62px] ml-[36px]" ref={constraintsRef}>
        <div
          className="absolute top-[10px] left-[-10px] right-0 h-3 cursor-pointer bg-white"
          onPointerDown={startDrag}
          style={{ touchAction: "none" }}
        ></div>
        <p className="absolute left-[-33px] top-1/2 -translate-y-1/2">0%</p>
        <p className="absolute right-[-56px] top-1/2 -translate-y-1/2">100%</p>
        <motion.div
          drag="x"
          style={{ x, height: SLIDER_WIDTH, width: SLIDER_WIDTH }}
          className="relative cursor-pointer rounded-full bg-pink"
          dragConstraints={constraintsRef}
          dragControls={dragControls}
          dragMomentum={false}
          whileDrag={{ scale: 1.2 }}
        />
      </motion.div>
    </>
  );
}
