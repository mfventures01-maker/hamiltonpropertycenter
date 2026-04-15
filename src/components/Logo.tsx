import React from "react";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex flex-col items-start ${className}`}>
      <span className="text-white font-primary text-2xl tracking-[0.1em] uppercase leading-none">
        Hamilton
      </span>
      <span className="text-secondary font-secondary text-[8px] tracking-[0.4em] uppercase font-bold mt-1">
        Property Center
      </span>
    </div>
  );
};
