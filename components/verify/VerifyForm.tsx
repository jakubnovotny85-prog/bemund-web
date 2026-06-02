'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { LogoSymbol } from '@/components/ui/Logo';
import { lookupVerify } from '@/lib/mock-data';
import { VerifyResult } from './VerifyResult';
import type { VerifyResult as VerifyResultType } from '@/lib/types';

export function VerifyForm() {
  const [objectId, setObjectId] = useState('');
  const [result, setResult] = useState<VerifyResultType | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!objectId.trim() || loading) return;

    setLoading(true);
    setSearched(false);

    await new Promise((r) => setTimeout(r, 1200));

    const data = lookupVerify(objectId.trim());
    setResult(data);
    setSearched(true);
    setLoading(false);
  }

  function handleReset() {
    setObjectId('');
    setResult(null);
    setSearched(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-32 pb-16 lg:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-xs tracking-[4px] uppercase text-champagne font-medium mb-3">
            Veřejné ověření autenticity
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-light tracking-tight mb-5">
            Ověřit<br />originál
          </h1>
          <p className="text-sm leading-relaxed text-[rgba(245,242,236,0.5)] mb-8 max-w-md">
            Zadej ID objektu nebo naskenuj QR kód — okamžitě zjistíš
            zda je předmět originál a kdo je jeho majitelem.
          </p>

          <form onSubmit={handleVerify} className="flex gap-2 mb-3">
            <input
              type="text"
              value={objectId}
              onChange={(e) => setObjectId(e.target.value)}
              placeholder="např. BM-2025-007-A4K9"
              className="flex-1 bg-graphite border border-[rgba(201,169,110,0.15)] rounded-sm px-4 py-3 text-sm font-body font-light text-ivory outline-none focus:border-[rgba(201,169,110,0.4)] transition-colors placeholder:text-[rgba(245,242,236,0.25)] tracking-wider"
            />
            <Button type="submit" variant="primary" className="whitespace-nowrap px-5" disabled={loading}>
              {loading ? 'Ověřuji...' : 'Ověřit →'}
            </Button>
          </form>

          <p className="text-[9px] tracking-[1px] text-[rgba(245,242,236,0.3)] mb-8">
            Nebo naskenuj QR kód kamerou telefonu
          </p>

          <div className="p-5 bg-graphite border border-[rgba(201,169,110,0.15)] rounded-sm">
            <p className="text-[8px] tracking-[3px] uppercase text-champagne font-medium mb-2">
              Bez registrace
            </p>
            <p className="text-[11px] leading-[1.8] text-[rgba(245,242,236,0.5)]">
              Ověřování je veřejné a zdarma. Nepotřebuješ účet ani
              aplikaci — stačí ID nebo QR kód objektu.
            </p>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-5 py-16 px-10 text-center bg-graphite border border-[rgba(201,169,110,0.15)] rounded-sm min-h-[320px]">
              <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
              <p className="text-[11px] tracking-[2px] uppercase text-[rgba(245,242,236,0.4)]">
                Ověřuji na blockchainu...
              </p>
            </div>
          ) : searched && result ? (
            <div>
              <VerifyResult data={result} />
              <button
                onClick={handleReset}
                className="mt-4 w-full py-3 text-[10px] tracking-[2px] uppercase text-[rgba(245,242,236,0.4)] hover:text-champagne transition-colors cursor-pointer bg-transparent border border-[rgba(201,169,110,0.1)] rounded-sm font-body"
              >
                Ověřit jiný objekt
              </button>
            </div>
          ) : searched && !result ? (
            <div>
              <div className="bg-graphite border border-red-900/40 rounded-sm p-10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-red-500/60 flex items-center justify-center">
                  <span className="text-red-400 text-xl font-light">&times;</span>
                </div>
                <h3 className="font-display text-2xl font-light mb-2 text-red-400">
                  Objekt nenalezen
                </h3>
                <p className="text-sm text-[rgba(245,242,236,0.4)]">
                  Žádný objekt neodpovídá ID &ldquo;{objectId}&rdquo;.
                  Zkontroluj ID a zkus znovu.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="mt-4 w-full py-3 text-[10px] tracking-[2px] uppercase text-[rgba(245,242,236,0.4)] hover:text-champagne transition-colors cursor-pointer bg-transparent border border-[rgba(201,169,110,0.1)] rounded-sm font-body"
              >
                Ověřit jiný objekt
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-16 px-10 text-center bg-graphite border border-[rgba(201,169,110,0.15)] rounded-sm min-h-[320px]">
              <LogoSymbol size={48} className="opacity-30" />
              <p className="text-[10px] tracking-[2px] uppercase text-[rgba(245,242,236,0.3)]">
                Zadej ID nebo naskenuj QR pro ověření
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
