import { ReactNode } from "react";

export default function Panel({
  title,
  children,
  className,
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative mt-3 flex
        items-center justify-center rounded-[11px] bg-blueLight pt-5 pb-2 text-center backdrop-blur-[5px] ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 -translate-y-1/2">
        {title}
      </div>
      {children}
    </div>
  );
}
