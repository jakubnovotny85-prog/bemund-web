'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { LogoSymbol } from '@/components/ui/Logo';
import { supabase } from '@/lib/supabase';

interface VerifyObject {
  id: string;
  title: string;
  description: string | null;
  category: string;
  year: number;
  medium: string | null;
  dimensions: string | null;
  edition_number: number;
  edition_total: number;
  qr_code: string;
  status: string;
  created_at: string;
  issuers: { name: string; email: string } | null;
}

interface VerifyOwnership {
  owner_name: string;
  owner_email: string;
  is_current: boolean;
  created_at: string;
}

export function VerifyForm() {
  const [objectId, setObjectId] = useState('');
  const [object, setObject] = useState<VerifyObject | null>(null);
  const [ownership, setOwnership] = useState<VerifyOwnership | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!objectId.trim() || loading) return;

    setLoading(true);
    setSearched(false);
    setObject(null);
    setOwnership(null);

    // Lookup object by qr_code
    const { data: obj } = await supabase
      .from('objects')
      .select('*, issuers(name, email)')
      .eq('qr_code', objectId.trim().toUpperCase())
      .single();

    if (obj) {
      setObject(obj);

      // Lookup current ownership
      const { data: own } = await supabase
        .from('ownerships')
        .select('*')
        .eq('object_id', obj.id)
        .eq('is_current', true)
        .single();

      if (own) setOwnership(own);
    }

    setSearched(true);
    setLoading(false);
  }

  function handleReset() {
    setObjectId('');
    setObject(null);
    setOwnership(null);
    setSearched(false);
  }

  const authorName = object?.issuers?.name ?? object?.issuers?.email ?? 'Neznámý autor';

  const dateFormatter = new Intl.DateTimeFormat('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
              placeholder="např. BM-2026-070-L1H6"
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
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-5 py-16 px-10 text-center bg-graphite border border-[rgba(201,169,110,0.15)] rounded-sm min-h-[320px]">
              <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
              <p className="text-[11px] tracking-[2px] uppercase text-[rgba(245,242,236,0.4)]">
                Ověřuji na blockchainu...
              </p>
            </div>
          )}

          {/* Found */}
          {!loading && searched && object && (
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
                className="bg-graphite border border-success/40 rounded-sm p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-success via-success/60 to-transparent" />

                <p className="text-[7px] tracking-[3px] uppercase text-champagne mb-1.5">
                  Certifikát &middot; Be Mund &middot; #{object.qr_code}
                </p>

                <h3 className="font-display text-2xl font-normal mb-1">{object.title}</h3>
                <p className="text-[11px] text-[rgba(245,242,236,0.6)] mb-5">
                  {authorName} &middot; {object.category} &middot; {object.year}
                  {object.medium && ` · ${object.medium}`}
                </p>

                <div className="flex flex-col">
                  {[
                    ['Edice', `#${String(object.edition_number).padStart(3, '0')} z ${String(object.edition_total).padStart(3, '0')}`],
                    ['Aktuální majitel', ownership ? `${ownership.owner_name} (ověřeno)` : 'Zatím nepřevzato'],
                    ['Datum certifikátu', ownership ? dateFormatter.format(new Date(ownership.created_at)) : dateFormatter.format(new Date(object.created_at))],
                    ['ID', object.qr_code],
                    ['Blockchain', '✓ Cardano mainnet'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2.5 border-t border-[rgba(201,169,110,0.15)]">
                      <span className="text-[8px] tracking-[2px] uppercase text-[rgba(245,242,236,0.3)]">{label}</span>
                      <span className={`text-[10px] tracking-[1px] ${label === 'Blockchain' ? 'text-success' : 'text-[rgba(245,242,236,0.6)]'}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-2.5 bg-[rgba(122,184,154,0.1)] border border-[rgba(122,184,154,0.3)] rounded-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-success" />
                  <span className="text-[10px] tracking-[1.5px] text-success font-medium uppercase">
                    Originál ověřen
                  </span>
                </div>
              </motion.div>

              <button
                onClick={handleReset}
                className="mt-4 w-full py-3 text-[10px] tracking-[2px] uppercase text-[rgba(245,242,236,0.4)] hover:text-champagne transition-colors cursor-pointer bg-transparent border border-[rgba(201,169,110,0.1)] rounded-sm font-body"
              >
                Ověřit jiný objekt
              </button>
            </div>
          )}

          {/* Not found */}
          {!loading && searched && !object && (
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
          )}

          {/* Empty state */}
          {!loading && !searched && (
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
