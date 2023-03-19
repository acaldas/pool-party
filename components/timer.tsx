"use client";

import { useEffect, useState } from "react";

function getTimestring(timeRemaining: string) {
  let seconds = Math.floor(
    (new Date(timeRemaining).valueOf() - new Date().valueOf()) / 1000
  );
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  minutes = minutes - hours * 60;
  seconds = seconds - hours * 60 * 60 - minutes * 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export default function Timer({
  timeRemaining,
  className,
}: {
  timeRemaining: string;
  className?: string;
}) {
  const [countdown, setCountdown] = useState(getTimestring(timeRemaining));
  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(getTimestring(timeRemaining));
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [timeRemaining]);
  return (
    <span
      className={`inline-block min-w-[94px] ${className}`}
      suppressHydrationWarning
    >
      {countdown}
    </span>
  );
}
