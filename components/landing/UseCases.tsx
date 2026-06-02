'use client';

import { FadeIn } from './FadeIn';

const cases = [
  {
    emoji: '🎨',
    name: 'Be Mund Art',
    sub: 'Umění & Galerie',
    desc: 'Každý obraz dostane digitální certifikát. Umělec získává royalty z každého přeprodeje automaticky.',
  },
  {
    emoji: '⚽',
    name: 'Be Mund Sports',
    sub: 'Sportovní sběratelství',
    desc: 'Tokenizované kartičky hráčů a memorabilia s ověřeným původem a historií vlastnictví.',
  },
  {
    emoji: '💎',
    name: 'Be Mund Luxury',
    sub: 'Luxusní předměty',
    desc: 'Hodinky, kabelky, vintage — každý luxusní předmět s nezfalšovatelnou digitální identitou.',
  },
  {
    emoji: '🏆',
    name: 'Be Mund Collectibles',
    sub: 'Sběratelské předměty',
    desc: 'Limitované edice, memorabilia a unikáty s kompletní historií od vzniku po současnost.',
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="border-b border-[rgba(201,169,110,0.15)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 lg:py-28">
        <FadeIn>
          <p className="text-xs tracking-[4px] uppercase text-champagne font-medium mb-4">
            Ekosystém
          </p>
          <h2 className="font-display text-3xl lg:text-4xl font-light tracking-tight mb-4">
            Pro co Be Mund <em className="italic text-champagne">slouží.</em>
          </h2>
          <p className="text-sm text-[rgba(245,242,236,0.45)] mb-14 max-w-md">
            Jeden standard pro všechny hodnotné objekty.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[rgba(201,169,110,0.06)]">
          {cases.map((c, i) => (
            <FadeIn key={c.name} delay={i * 0.1}>
              <div className="bg-graphite-2 p-8 lg:p-10 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.45)] border border-transparent h-full cursor-default">
                <div className="absolute top-0 left-0 w-[2px] h-full bg-champagne" />
                <div className="text-2xl mb-5">{c.emoji}</div>
                <h3 className="font-display text-xl font-light tracking-[1px] text-champagne-light mb-1.5">
                  {c.name}
                </h3>
                <p className="text-[9px] tracking-[3px] uppercase text-[rgba(245,242,236,0.35)] font-normal mb-4">
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
