'use client';

import { Button } from '@/components/ui/Button';
import { LogoSymbol } from '@/components/ui/Logo';
import { FadeIn } from './FadeIn';
import Link from 'next/link';

function CertificateCard() {
  return (
    <div className="animate-float">
      <div className="w-[300px] bg-graphite rounded-sm border border-[rgba(201,169,110,0.25)] shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(201,169,110,0.08)] relative overflow-hidden">
        {/* Gold top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-champagne via-champagne-light to-transparent" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-6">
            <LogoSymbol size={18} />
            <span className="text-[7px] tracking-[3px] uppercase text-champagne font-medium">
              Certificate of Ownership
            </span>
          </div>

          {/* Object info */}
          <h3 className="font-display text-2xl font-normal text-ivory mb-1">
            Praha v desti
          </h3>
          <p className="text-[11px] text-[rgba(245,242,236,0.5)] mb-1">
            Jan Novak &middot; 2025
          </p>
          <p className="text-[10px] text-[rgba(245,242,236,0.35)] mb-5">
            Edice #007 / 050
          </p>

          {/* QR + verified */}
          <div className="flex items-end justify-between">
            {/* Mini QR pattern */}
            <div className="w-14 h-14 bg-[rgba(245,242,236,0.06)] rounded-sm p-1.5 grid grid-cols-5 gap-0.5">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-[1px] ${
                    [0,1,2,4,5,6,10,11,12,14,18,20,21,22,24].includes(i)
                      ? 'bg-champagne opacity-40'
                      : 'bg-transparent'
                  }`}
                />
              ))}
            </div>

            {/* Verified badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[rgba(122,184,154,0.1)] border border-[rgba(122,184,154,0.25)] rounded-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <span className="text-[8px] tracking-[1.5px] uppercase text-success font-medium">
                Ověřeno &middot; Cardano
              </span>
            </div>
          </div>
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
                Digitální identita pro fyzické objekty
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="font-display text-5xl lg:text-6xl font-light leading-[1.08] tracking-tight mb-6">
                Tvé dílo.<br />
                Tvoje identita.<br />
                <em className="italic text-champagne">Navždy.</em>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-sm leading-relaxed text-[rgba(245,242,236,0.5)] mb-10 max-w-md">
                Be Mund dává každému fyzickému objektu — obrazu, sběratelské
                kartičce nebo luxusnímu předmětu — ověřitelnou digitální
                identitu. Naskenuj. Vlastni. Dokaž.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="#waitlist">
                  <Button variant="primary" className="w-full sm:w-auto px-7">
                    Získat přístup zdarma
                  </Button>
                </Link>
                <Link href="/verify">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Ověřit objekt &rarr;
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3} direction="right" className="hidden lg:flex justify-center">
            <CertificateCard />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
