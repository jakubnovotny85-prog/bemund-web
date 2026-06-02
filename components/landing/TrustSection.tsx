'use client';

import { FadeIn } from './FadeIn';

const features = [
  {
    icon: '🔐',
    title: 'Nezfalšovatelné',
    desc: 'Záznam na Cardano blockchainu nelze změnit ani smazat.',
  },
  {
    icon: '♾️',
    title: 'Navždy',
    desc: 'Certifikát existuje permanentně. Bez předplatného, bez vypršení.',
  },
  {
    icon: '✓',
    title: 'Ověřitelné kýmkoliv',
    desc: 'Kdokoli naskenuje QR a okamžitě vidí historii objektu — bez registrace.',
  },
];

export function TrustSection() {
  return (
    <section className="bg-graphite border-b border-[rgba(201,169,110,0.15)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,169,110,0.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 lg:py-28 relative">
        <FadeIn>
          <p className="text-xs tracking-[4px] uppercase text-champagne font-medium mb-14">
            Proč Be Mund?
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <FadeIn delay={0.1}>
            <div>
              <blockquote className="font-display text-3xl lg:text-[32px] font-light leading-[1.3] tracking-tight mb-6 text-ivory">
                &ldquo;Fyzický svět si zaslouží<br />
                digitální <em className="italic text-champagne">důvěru.</em>&rdquo;
              </blockquote>
              <p className="text-sm leading-relaxed text-[rgba(245,242,236,0.45)] max-w-sm">
                Blockchain technologie běží v pozadí — neviditelně, bezpečně,
                automaticky. Uživatel vidí pouze výsledek: certifikát vlastnictví.
              </p>
            </div>
          </FadeIn>

          <div className="flex flex-col gap-4">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={0.15 + i * 0.1}>
                <div className="flex gap-5 p-5 bg-obsidian rounded-sm border border-[rgba(201,169,110,0.1)]">
                  <span className="text-xl mt-0.5 flex-shrink-0">{f.icon}</span>
                  <div>
                    <h4 className="text-sm font-medium tracking-[1px] text-ivory mb-1.5">
                      {f.title}
                    </h4>
                    <p className="text-[13px] leading-relaxed text-[rgba(245,242,236,0.45)]">
                      {f.desc}
                    </p>
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
