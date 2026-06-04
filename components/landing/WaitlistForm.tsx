'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FadeIn } from './FadeIn';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || submitting) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('Waitlist error:', data.error);
      }
    } catch (err) {
      console.error('Waitlist fetch error:', err);
    }

    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <section id="waitlist" className="border-b border-[rgba(201,169,110,0.15)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,169,110,0.05)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 lg:py-28 relative">
        <div className="max-w-xl mx-auto text-center">
          <FadeIn>
            <h2 className="font-display text-4xl lg:text-5xl font-light tracking-tight mb-4">
              Buď <em className="italic text-champagne">první.</em>
            </h2>
            <p className="text-sm leading-relaxed text-[rgba(245,242,236,0.5)] mb-10">
              Beta program je otevřený pro umělce, galerie a sběratele.
              Registrace zdarma.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            {!submitted ? (
              <div>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vas@email.cz"
                    required
                    className="flex-1 bg-graphite border border-[rgba(201,169,110,0.15)] rounded-sm px-4 py-3.5 text-sm font-body font-light text-ivory outline-none focus:border-[rgba(201,169,110,0.4)] transition-colors placeholder:text-[rgba(245,242,236,0.25)]"
                  />
                  <Button type="submit" variant="primary" className="whitespace-nowrap" disabled={submitting}>
                    {submitting ? 'Odesílám...' : 'Získat přístup'}
                  </Button>
                </form>
                <p className="text-[9px] tracking-[2px] uppercase text-[rgba(245,242,236,0.2)] mb-8">
                  Žádný spam. Pouze oznámení o spuštění.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 py-4 mb-8">
                <div className="w-2.5 h-2.5 rounded-full bg-success" />
                <span className="text-sm text-success tracking-[1px]">
                  Přidáno! Ozveme se ti brzy.
                </span>
              </div>
            )}
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[rgba(245,242,236,0.35)]">
              <span className="flex items-center gap-1.5">
                <span className="text-success">✓</span> Registrace zdarma
              </span>
              <span className="text-[rgba(201,169,110,0.2)]">&middot;</span>
              <span className="flex items-center gap-1.5">
                <span className="text-success">✓</span> Osobní onboarding
              </span>
              <span className="text-[rgba(201,169,110,0.2)]">&middot;</span>
              <span className="flex items-center gap-1.5">
                <span className="text-success">✓</span> Doživotní zvýhodněný tarif
              </span>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
