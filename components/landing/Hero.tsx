'use client';

import { Button } from '@/components/ui/Button';
import { LogoSymbol } from '@/components/ui/Logo';
import { FadeIn } from './FadeIn';
import Link from 'next/link';

function MiniPhone() {
  return (
    <div className="relative">
      <div className="w-[200px] h-[380px] bg-[#0D0D0D] rounded-[28px] border border-[#2A2A2A] shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(201,169,110,0.06)] overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70px] h-[18px] bg-[#0D0D0D] rounded-b-[12px] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_35%,rgba(201,169,110,0.1)_0%,transparent_65%)] flex flex-col items-center justify-center px-5 gap-4">
          <LogoSymbol size={40} />
          <span className="font-display text-lg tracking-[4px] uppercase font-light">Be Mund</span>
          <span className="text-[6px] tracking-[2.5px] uppercase text-champagne">Trust Layer</span>
          <div className="w-full mt-4 space-y-2">
            <div className="w-full py-2 bg-champagne text-obsidian text-[7px] tracking-[2px] uppercase font-semibold text-center rounded-sm font-body">
              Get started — free
            </div>
            <div className="w-full py-2 border border-[rgba(201,169,110,0.3)] text-[rgba(245,242,236,0.6)] text-[7px] tracking-[2px] uppercase text-center rounded-sm font-body">
              Sign in
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-3 -right-3 bg-graphite border border-[rgba(201,169,110,0.4)] rounded-sm px-3.5 py-2.5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-success" />
        <div>
          <div className="text-[8px] tracking-[1.5px] text-[rgba(245,242,236,0.6)]">Cardano mainnet</div>
          <div className="text-[7px] tracking-[1px] text-[rgba(245,242,236,0.3)]">Verified on-chain</div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[rgba(201,169,110,0.15)]">
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-32 md:pt-40 pb-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <FadeIn delay={0}>
              <p className="text-xs tracking-[4px] uppercase text-champagne font-medium mb-6">
                A Modern Trust Layer for the Physical World
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="font-display text-5xl lg:text-6xl font-light leading-[1.08] tracking-tight mb-6">
                Ownership<br />
                that cannot<br />
                be <em className="italic text-champagne">forged.</em>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-sm leading-relaxed text-[rgba(245,242,236,0.5)] mb-10 max-w-md">
                Scan the QR code on your artwork, watch, or collectible card.
                Be Mund records your ownership on the blockchain — forever,
                securely, verifiably.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" className="px-7">
                  Get the app
                </Button>
                <Link href="/verify">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Verify an object &rarr;
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3} direction="right" className="hidden lg:flex justify-center">
            <MiniPhone />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
