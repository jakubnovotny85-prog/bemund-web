interface LogoProps {
  size?: number;
  color?: string;
  className?: string;
}

export function LogoSymbol({ size = 52, color = '#C9A96E', className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="19" cy="26" r="15" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="33" cy="26" r="15" stroke={color} strokeWidth="1.5" fill="none" opacity="0.55" />
      <path
        d="M26 13.2 C29.8 16.5 29.8 35.5 26 38.8 C22.2 35.5 22.2 16.5 26 13.2Z"
        fill={color}
        opacity="0.18"
      />
      <circle cx="26" cy="26" r="2" fill={color} />
    </svg>
  );
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <LogoSymbol size={32} />
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-xl tracking-[5px] uppercase font-light text-ivory">
          Be Mund
        </span>
      </div>
    </div>
  );
}

export function LogoWithTagline({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className ?? ''}`}>
      <LogoSymbol size={42} />
      <div className="flex flex-col gap-1">
        <span className="font-display text-2xl tracking-[6px] uppercase font-light text-ivory">
          Be Mund
        </span>
        <span className="text-[7px] tracking-[3px] uppercase text-champagne font-normal">
          A modern trust layer for the physical world
        </span>
      </div>
    </div>
  );
}
