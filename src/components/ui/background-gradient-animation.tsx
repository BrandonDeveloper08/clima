import React from "react";

type BackgroundGradientAnimationProps = {
  children?: React.ReactNode;
  className?: string;
};

export function BackgroundGradientAnimation({ children, className }: BackgroundGradientAnimationProps) {
  return (
    <div className={"relative min-h-screen w-full overflow-hidden " + (className ?? "")}>        
      <div className="absolute inset-0 bg-sky-animated pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}


