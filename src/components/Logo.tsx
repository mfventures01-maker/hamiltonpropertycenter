import React from "react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex flex-col items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary border border-secondary rounded overflow-hidden shadow-[0_0_10px_rgba(203,163,77,0.2)]">
        <span className="text-secondary font-primary text-lg md:text-xl font-bold leading-none tracking-tighter mix-blend-screen">H</span>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-white font-primary text-xl md:text-2xl tracking-[0.1em] uppercase leading-none">
          Hamilton
        </span>
        <span className="text-secondary font-secondary text-[7px] md:text-[8px] tracking-[0.4em] uppercase font-bold mt-[2px]">
          Property Center
        </span>
      </div>
    </div>
  );
}

// Preserve backwards compatibility during migration
export { Logo };
