'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { LogoSymbol } from '@/components/ui/Logo';
import { lookupVerify } from '@/lib/mock-data';
import { VerifyResult } from './VerifyResult';
import type { VerifyResult as VerifyResultType } from '@/lib/types';

export function VerifyForm() {
  const [objectId, setObjectId] = useState('BM-2024-007-A4K9');
  const [result, setResult] = useState<VerifyResultType | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!objectId.trim()) return;

    setLoading(true);
    setSearched(false);

    await new Promise((r) => setTimeout(r, 800));

    const data = lookupVerify(objectId.trim());
    setResult(data);
    setSearched(true);
    setLoading(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-32 pb-16 lg:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-[8px] tracking-[4px] uppercase text-champagne font-medium mb-3">
            Public authenticity verification
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-light tracking-[1px] mb-5">
            Verify<br />an original
          </h1>
          <p className="text-sm leading-[1.9] text-[rgba(245,242,236,0.5)] mb-8 max-w-md">
            Enter the object ID or scan its QR code — instantly find out whether
            the item is an original and who currently owns it.
          </p>

          <form onSubmit={handleVerify} className="flex gap-2 mb-4">
            <input
              type="text"
              value={objectId}
              onChange={(e) => setObjectId(e.target.value)}
              placeholder="BM-YYYY-NNN-XXXX"
              className="flex-1 bg-graphite border border-[rgba(201,169,110,0.15)] rounded-sm px-4 py-3 text-sm font-body font-light text-ivory outline-none focus:border-[rgba(201,169,110,0.4)] transition-colors placeholder:text-[rgba(245,242,236,0.25)] tracking-wider"
            />
            <Button type="submit" variant="primary" className="whitespace-nowrap px-5">
              {loading ? 'Verifying...' : 'Verify →'}
            </Button>
          </form>

          <p className="text-[9px] tracking-[1px] text-[rgba(245,242,236,0.3)] mb-8">
            Or scan the QR code with your phone camera
          </p>

          <div className="p-5 bg-graphite border border-[rgba(201,169,110,0.15)] rounded-sm">
            <p className="text-[8px] tracking-[3px] uppercase text-champagne font-medium mb-2">
              No registration required
            </p>
            <p className="text-[11px] leading-[1.8] text-[rgba(245,242,236,0.5)]">
              Verification is public and free. You don&apos;t need an account or
              the app — just the object&apos;s ID or QR code.
            </p>
          </div>
        </div>

        <div>
          {searched && result ? (
            <VerifyResult data={result} />
          ) : searched && !result ? (
            <div className="bg-graphite border border-red-900/40 rounded-sm p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-red-500/60 flex items-center justify-center">
                <span className="text-red-400 text-xl font-light">&times;</span>
              </div>
              <h3 className="font-display text-2xl font-light mb-2 text-red-400">
                Not found
              </h3>
              <p className="text-sm text-[rgba(245,242,236,0.4)]">
                No object matches the ID &ldquo;{objectId}&rdquo;.
                Please check and try again.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-16 px-10 text-center bg-graphite border border-[rgba(201,169,110,0.15)] rounded-sm min-h-[320px]">
              <LogoSymbol size={48} className="opacity-30" />
              <p className="text-[10px] tracking-[2px] uppercase text-[rgba(245,242,236,0.3)]">
                Enter an ID or scan QR to verify
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
