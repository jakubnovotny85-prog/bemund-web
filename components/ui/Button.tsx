import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'outline' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-champagne text-obsidian font-semibold hover:bg-champagne-light active:scale-[0.98]',
  outline:
    'bg-transparent border border-[rgba(201,169,110,0.4)] text-[rgba(245,242,236,0.6)] hover:border-champagne hover:text-champagne',
  ghost:
    'bg-transparent text-[rgba(245,242,236,0.5)] hover:text-champagne',
};

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={`
        px-6 py-3.5
        text-[10px] tracking-[3px] uppercase
        font-body font-medium
        rounded-sm cursor-pointer
        transition-all duration-200
        ${variants[variant]}
        ${className ?? ''}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
