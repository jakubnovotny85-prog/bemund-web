'use client';

import { FadeIn } from './FadeIn';

const stats = [
  { value: 'Cardano', label: 'Blockchain network', sub: 'Proof-of-stake, low fees' },
  { value: 'IPFS', label: 'Metadata storage', sub: 'Permanent, decentralized' },
  { value: '100%', label: 'On-chain verified', sub: 'Every certificate on mainnet' },
];

export function TrustSection() {
  return (
    <section className="border-b border-[rgba(201,169,110,0.15)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,169,110,0.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 lg:py-28 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <FadeIn>
              <p className="text-xs tracking-[4px] uppercase text-champagne font-medium mb-4">
                Built on trust
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-light tracking-tight mb-6">
                Transparent.<br />
                Immutable.<br />
                <em className="italic text-champagne">Yours.</em>
              </h2>
              <p className="text-sm leading-relaxed text-[rgba(245,242,236,0.5)] max-w-md">
                Every Be Mund certificate is recorded on the Cardano blockchain.
                No single entity can alter, delete, or forge your ownership record.
                Public verification requires no account — just the object&apos;s QR code.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[rgba(201,169,110,0.08)]">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1}>
                <div className="bg-graphite p-7 text-center">
                  <div className="font-display text-2xl font-light text-champagne mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[10px] tracking-[1px] text-ivory mb-1">
                    {stat.label}
                  </div>
                  <div className="text-[9px] tracking-[1px] text-[rgba(245,242,236,0.3)]">
                    {stat.sub}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
