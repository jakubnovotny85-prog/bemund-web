'use client';

import { FadeIn } from './FadeIn';

const cases = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 3v18" />
      </svg>
    ),
    name: 'Be Mund Art',
    sub: 'Digital authenticity for art',
    desc: 'Artists register their work. Buyers receive a blockchain certificate. Galleries verify provenance with a single scan.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18M3 12h18" />
        <path d="M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
      </svg>
    ),
    name: 'Be Mund Sports',
    sub: 'Collectible editions & memorabilia',
    desc: 'Clubs issue tokenized cards. Fans own verified collectibles with full provenance history and limited edition tracking.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    name: 'Be Mund Luxury',
    sub: 'Premium goods & watches',
    desc: 'Every luxury item gets its unforgeable digital identity. From vintage Rolex to designer pieces — verified ownership on-chain.',
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="border-b border-[rgba(201,169,110,0.15)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 lg:py-28">
        <FadeIn>
          <p className="text-xs tracking-[4px] uppercase text-champagne font-medium mb-4">
            Ecosystem
          </p>
          <h2 className="font-display text-3xl lg:text-4xl font-light tracking-tight mb-14">
            One platform,<br />
            many <em className="italic text-champagne">verticals.</em>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(201,169,110,0.08)]">
          {cases.map((c, i) => (
            <FadeIn key={c.name} delay={i * 0.1}>
              <div className="bg-graphite p-8 lg:p-10 relative overflow-hidden group transition-colors duration-300 hover:bg-slate h-full">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-champagne to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="mb-5 opacity-70">{c.icon}</div>
                <h3 className="font-display text-xl font-light tracking-[2px] text-champagne-light mb-2">
                  {c.name}
                </h3>
                <p className="text-[9px] tracking-[3px] uppercase text-[rgba(245,242,236,0.4)] font-normal mb-4">
                  {c.sub}
                </p>
                <p className="text-sm leading-relaxed text-[rgba(245,242,236,0.5)]">
                  {c.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
