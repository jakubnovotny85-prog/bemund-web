'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { LogoSymbol } from '@/components/ui/Logo';
import { FadeIn } from './FadeIn';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="border-b border-[rgba(201,169,110,0.15)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,169,110,0.05)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 lg:py-28 relative">
        <div className="max-w-lg mx-auto text-center">
          <FadeIn>
            <LogoSymbol size={48} className="mx-auto mb-8 opacity-40" />
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl lg:text-4xl font-light tracking-tight mb-4">
              Be among the <em className="italic text-champagne">first.</em>
            </h2>
            <p className="text-sm leading-relaxed text-[rgba(245,242,236,0.5)] mb-10">
              Join the waitlist and get early access to the Be Mund platform.
              We&apos;ll notify you when we launch.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-graphite border border-[rgba(201,169,110,0.15)] rounded-sm px-4 py-3.5 text-sm font-body font-light text-ivory outline-none focus:border-[rgba(201,169,110,0.4)] transition-colors placeholder:text-[rgba(245,242,236,0.25)]"
                />
                <Button type="submit" variant="primary" className="whitespace-nowrap">
                  Join waitlist
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-3 py-4">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-sm text-success tracking-[1px]">
                  You&apos;re on the list. We&apos;ll be in touch.
                </span>
              </div>
            )}
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="mt-6 text-[9px] tracking-[2px] uppercase text-[rgba(245,242,236,0.2)]">
              No spam. Unsubscribe anytime.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
