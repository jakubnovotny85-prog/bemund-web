'use client';

import { FadeIn } from './FadeIn';

const steps = [
  {
    num: '01',
    title: 'Zaregistruj objekt',
    body: 'Umělec nebo vydavatel zadá dílo do Be Mund. Dostane unikátní QR štítek. 5 minut.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Naskenuj při převzetí',
    body: 'Kupující naskenuje QR kód v Be Mund aplikaci. Vlastnictví se zapíše automaticky. 30 vteřin.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="4" height="4" />
        <line x1="21" y1="14" x2="21" y2="21" />
        <line x1="14" y1="21" x2="21" y2="21" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Vlastni navždy',
    body: 'Certifikát je zapsán navždy. Ověřitelný kýmkoliv, odkudkoliv, bez registrace.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <polyline points="9 12 11.5 14.5 15.5 9.5" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-graphite border-b border-[rgba(201,169,110,0.15)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 lg:py-28">
        <FadeIn>
          <p className="text-xs tracking-[4px] uppercase text-champagne font-medium mb-4">
            Jak to funguje
          </p>
          <h2 className="font-display text-3xl lg:text-4xl font-light tracking-tight mb-14">
            Tři kroky k <em className="italic text-champagne">důvěře.</em>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.15}>
              <div className="bg-obsidian p-8 rounded-sm border border-[rgba(201,169,110,0.12)] relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-[2px] h-full bg-champagne opacity-40" />
                <span className="absolute top-4 right-4 font-display text-5xl font-light text-champagne opacity-[0.08] leading-none select-none pointer-events-none">
                  {step.num}
                </span>
                <div className="relative z-10">
                  <div className="mb-5 opacity-80">{step.icon}</div>
                  <h3 className="font-display text-xl font-light tracking-tight mb-3 text-ivory">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[rgba(245,242,236,0.5)]">
                    {step.body}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
