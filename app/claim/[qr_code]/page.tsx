'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LogoSymbol } from '@/components/ui/Logo';
import type { Session } from '@supabase/supabase-js';

interface ClaimObject {
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
  image_url: string | null;
  issuers: { name: string; email: string } | null;
}

type PageState = 'loading' | 'not_found' | 'needs_auth' | 'claim_form' | 'submitting' | 'success' | 'already_claimed';

export default function ClaimPage() {
  const params = useParams();
  const qrCode = params.qr_code as string;

  const [state, setState] = useState<PageState>('loading');
  const [object, setObject] = useState<ClaimObject | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Form
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [claimedName, setClaimedName] = useState('');

  const loadObject = useCallback(async () => {
    // Load object
    const { data, error: fetchError } = await supabase
      .from('objects')
      .select('*, issuers(name, email)')
      .eq('qr_code', qrCode)
      .single();

    if (fetchError || !data) {
      setState('not_found');
      return;
    }

    setObject(data);

    if (data.status !== 'active') {
      setState('already_claimed');
      return;
    }

    // Check auth
    const { data: { session: sess } } = await supabase.auth.getSession();
    setSession(sess);

    if (!sess) {
      setState('needs_auth');
    } else {
      setState('claim_form');
    }
  }, [qrCode]);

  useEffect(() => {
    loadObject();
  }, [loadObject]);

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!session?.access_token) {
      setState('needs_auth');
      return;
    }

    setState('submitting');

    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          qr_code: qrCode,
          transfer_price: price ? Number(price) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'already_claimed') {
          setState('already_claimed');
        } else if (data.error === 'unauthorized') {
          setState('needs_auth');
        } else {
          setError(data.error ?? 'Nastala chyba.');
          setState('claim_form');
        }
        return;
      }

      setClaimedName(data.owner_name ?? session.user.email ?? '');
      setState('success');
    } catch (err) {
      console.error('Claim error:', err);
      setError(err instanceof Error ? err.message : 'Chyba připojení.');
      setState('claim_form');
    }
  }

  const inputClass =
    'w-full bg-graphite-2 border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-sm font-body font-light text-ivory outline-none transition-colors focus:border-[rgba(201,169,110,0.6)] placeholder:text-[rgba(245,242,236,0.25)]';

  const authorName = object?.issuers?.name && object.issuers.name !== object.issuers.email
    ? object.issuers.name
    : 'Neznámý autor';
  const today = new Date().toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const claimRedirect = `/claim/${qrCode}`;

  // ─── LOADING ───
  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─── NOT FOUND ───
  if (state === 'not_found') {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
        <div className="max-w-[420px] w-full text-center">
          <LogoSymbol size={42} className="mx-auto mb-6 opacity-30" />
          <h1 className="font-display text-3xl font-light tracking-tight mb-3">
            QR kód nenalezen
          </h1>
          <p className="text-sm text-[rgba(245,242,236,0.45)] mb-8">
            Tento certifikát nebyl nalezen. Ujistěte se že jste naskenovali správný kód.
          </p>
          <Link href="/" className="text-[10px] tracking-[2px] uppercase text-champagne hover:text-champagne-light transition-colors font-body">
            &larr; Zpět na bemund.cz
          </Link>
        </div>
      </div>
    );
  }

  // ─── SUBMITTING ───
  if (state === 'submitting') {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-champagne border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-sm text-[rgba(245,242,236,0.5)] tracking-[1px]">
            Zapisujeme vaše vlastnictví...
          </p>
        </div>
      </div>
    );
  }

  // ─── SUCCESS ───
  if (state === 'success' && object) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 py-16">
        <div className="max-w-[480px] w-full text-center">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full border-2 border-success bg-[rgba(122,184,154,0.1)] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7AB89A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 12 10 16 18 8" />
            </svg>
          </div>

          <h1 className="font-display text-3xl font-light tracking-tight mb-2">
            Gratulujeme!
          </h1>
          <p className="text-sm text-[rgba(245,242,236,0.5)] mb-10">
            Jste ověřený majitel díla.
          </p>

          <div className="bg-graphite border border-[rgba(201,169,110,0.4)] rounded-sm p-6 text-left relative overflow-hidden mb-8">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-champagne" />
            <div className="flex items-center gap-2 mb-5">
              <LogoSymbol size={16} />
              <span className="text-[7px] tracking-[3px] uppercase text-champagne font-medium">
                Certificate of Ownership
              </span>
            </div>
            <div className="w-full h-px bg-[rgba(201,169,110,0.15)] mb-4" />
            {[
              ['Dílo', object.title],
              ['Autor', authorName],
              ['Edice', `Kus č. ${object.edition_number} z ${object.edition_total}`],
              ['Majitel', claimedName],
              ['Datum', today],
              ['ID', object.qr_code],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-[rgba(201,169,110,0.08)]">
                <span className="text-[9px] tracking-[2px] uppercase text-[rgba(245,242,236,0.35)]">{label}</span>
                <span className="text-[11px] text-ivory">{value}</span>
              </div>
            ))}
            <div className="flex justify-between py-1.5">
              <span className="text-[9px] tracking-[2px] uppercase text-[rgba(245,242,236,0.35)]">Status</span>
              <span className="text-[11px] text-success">✓ Ověřeno</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/verify" className="w-full py-3.5 bg-champagne text-obsidian font-semibold text-[10px] tracking-[3px] uppercase rounded-sm text-center transition-colors hover:bg-champagne-light font-body block">
              Ověřit certifikát &rarr;
            </Link>
            <Link href="/dashboard" className="w-full py-3 bg-transparent border border-[rgba(201,169,110,0.2)] text-[rgba(245,242,236,0.5)] text-[10px] tracking-[2px] uppercase rounded-sm text-center transition-colors hover:border-champagne hover:text-champagne font-body block">
              Přejít do Vaultu &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── ALREADY CLAIMED ───
  if (state === 'already_claimed' && object) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 py-16">
        <div className="max-w-[480px] w-full text-center">
          <LogoSymbol size={42} className="mx-auto mb-6 opacity-50" />
          <h1 className="font-display text-3xl font-light tracking-tight mb-3">
            Tento objekt již má majitele
          </h1>
          <div className="bg-graphite border border-[rgba(201,169,110,0.15)] rounded-sm p-5 text-left my-8">
            <p className="font-display text-xl font-light text-ivory mb-1">{object.title}</p>
            <p className="text-[11px] text-[rgba(245,242,236,0.45)]">
              {authorName} &middot; {object.year} &middot; Kus č. {object.edition_number} z {object.edition_total}
            </p>
          </div>
          <p className="text-sm text-[rgba(245,242,236,0.4)] mb-6">
            Chcete ověřit autenticitu tohoto díla?
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/verify" className="w-full py-3.5 bg-champagne text-obsidian font-semibold text-[10px] tracking-[3px] uppercase rounded-sm text-center transition-colors hover:bg-champagne-light font-body block">
              Ověřit objekt
            </Link>
            <Link href="/" className="text-[10px] tracking-[2px] uppercase text-[rgba(245,242,236,0.4)] hover:text-champagne transition-colors font-body">
              &larr; Zpět na bemund.cz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!object) return null;

  // ─── Object info (shared between needs_auth and claim_form) ───
  const objectCard = (
    <div className="bg-graphite border border-[rgba(201,169,110,0.2)] rounded-sm mb-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-champagne via-champagne-light to-transparent" />
      {object.image_url && (
        <img src={object.image_url} alt={object.title} className="w-full max-h-[200px] object-cover" />
      )}
      <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <LogoSymbol size={18} />
        <span className="text-[7px] tracking-[3px] uppercase text-champagne font-medium">
          Certificate of Ownership
        </span>
      </div>
      <h2 className="font-display text-[28px] font-light tracking-tight text-ivory mb-1">
        {object.title}
      </h2>
      <p className="text-sm text-champagne italic mb-4 font-display">{authorName}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[rgba(245,242,236,0.4)] mb-3">
        <span>{object.category}</span>
        <span>&middot;</span>
        <span>{object.year}</span>
        {object.medium && <><span>&middot;</span><span>{object.medium}</span></>}
        {object.dimensions && <><span>&middot;</span><span>{object.dimensions}</span></>}
      </div>
      <p className="text-[11px] text-[rgba(245,242,236,0.35)]">
        Kus č. {object.edition_number} z {object.edition_total}
      </p>
      </div>
    </div>
  );

  // ─── NEEDS AUTH ───
  if (state === 'needs_auth') {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 py-16">
        <div className="max-w-[480px] w-full">
          {objectCard}

          <div className="bg-graphite border border-[rgba(201,169,110,0.2)] rounded-sm p-8 text-center">
            <h3 className="font-display text-xl font-light tracking-tight text-ivory mb-2">
              Pro převzetí vlastnictví se musíte přihlásit
            </h3>
            <p className="text-[11px] text-[rgba(245,242,236,0.4)] mb-8">
              Účet chrání váš certifikát. Bez účtu nemůžete prokázat vlastnictví při přeprodeji.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href={`/auth/login?redirect=${encodeURIComponent(claimRedirect)}`}
                className="w-full py-3.5 bg-champagne text-obsidian font-semibold text-[10px] tracking-[3px] uppercase rounded-sm text-center transition-colors hover:bg-champagne-light font-body block"
              >
                Přihlásit se
              </Link>
              <Link
                href={`/auth/register?redirect=${encodeURIComponent(claimRedirect)}`}
                className="w-full py-3 bg-transparent border border-[rgba(201,169,110,0.3)] text-[rgba(245,242,236,0.6)] text-[10px] tracking-[2px] uppercase rounded-sm text-center transition-colors hover:border-champagne hover:text-champagne font-body block"
              >
                Vytvořit účet
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── CLAIM FORM (authenticated) ───
  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4 py-16">
      <div className="max-w-[480px] w-full">
        {objectCard}

        <div className="bg-graphite border border-[rgba(201,169,110,0.2)] rounded-sm p-8">
          <div className="text-center mb-6">
            <p className="text-lg mb-1">🎉</p>
            <h3 className="font-display text-xl font-light tracking-tight text-ivory mb-1">
              Gratulujeme k nákupu!
            </h3>
            <p className="text-[11px] text-[rgba(245,242,236,0.45)]">
              Potvrďte převzetí digitálního certifikátu vlastnictví.
            </p>
          </div>

          {/* Logged in user info */}
          <div className="flex items-center gap-2 p-3 mb-5 bg-[rgba(201,169,110,0.06)] border border-[rgba(201,169,110,0.12)] rounded-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-[11px] text-[rgba(245,242,236,0.5)]">
              Přihlášen jako: <span className="text-ivory">{session?.user.email}</span>
            </span>
          </div>

          <form onSubmit={handleClaim} className="flex flex-col gap-5">
            <div>
              <label className="text-[8px] tracking-[3px] uppercase text-champagne font-medium mb-1.5 block">
                Cena pořízení
                <span className="ml-2 text-[rgba(245,242,236,0.3)] normal-case tracking-normal font-light">
                  — nepovinné, v Kč
                </span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                min={0}
                className={inputClass}
              />
            </div>

            {error && (
              <p className="text-[#E07070] text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-champagne text-obsidian font-semibold text-[10px] tracking-[3px] uppercase rounded-sm cursor-pointer transition-colors hover:bg-champagne-light font-body"
            >
              Převzít vlastnictví
            </button>
          </form>

          <p className="text-center mt-4 text-[10px] text-[rgba(245,242,236,0.3)]">
            🔒 Vaše data jsou zabezpečena. Certifikát obdržíte emailem.
          </p>
        </div>
      </div>
    </div>
  );
}
