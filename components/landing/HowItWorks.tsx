'use client';

import { FadeIn } from './FadeIn';

const steps = [
  {
    num: '01',
    title: 'Artist registers',
    body: 'The artist or gallery registers the piece in Be Mund — title, description, photos. They receive a unique QR label.',
  },
  {
    num: '02',
    title: 'Buyer scans',
    body: 'When receiving the piece, the buyer scans the QR in the Be Mund app. Ownership is written to the Cardano blockchain.',
  },
  {
    num: '03',
    title: 'Verified forever',
    body: 'Anyone can verify the origin and current owner — without registration, from anywhere, forever.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-[rgba(201,169,110,0.15)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 lg:py-28">
        <FadeIn>
          <p className="text-xs tracking-[4px] uppercase text-champagne font-medium mb-12">
            How it works — 3 steps
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(201,169,110,0.08)]">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.1}>
              <div className="bg-graphite p-8 lg:p-10 relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-champagne to-transparent" />
                <span className="absolute top-4 right-4 font-display text-6xl font-light text-champagne opacity-10 leading-none select-none pointer-events-none">
                  {step.num}
                </span>
                <div className="relative z-10">
                  <h3 className="font-display text-[22px] font-light tracking-tight mb-3">
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
