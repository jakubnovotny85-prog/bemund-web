import { LogoSymbol } from '@/components/ui/Logo';
import type { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px] bg-graphite border border-[rgba(201,169,110,0.2)] rounded-sm p-12">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <LogoSymbol size={42} className="mb-4" />
          <span className="font-display text-xl tracking-[6px] uppercase font-light text-ivory mb-1.5">
            Be Mund
          </span>
          <span className="text-[8px] tracking-[3px] uppercase text-champagne font-medium">
            Vydavatelský portál
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
