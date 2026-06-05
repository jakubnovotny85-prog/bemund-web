'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LogoSymbol } from '@/components/ui/Logo';
import type { User } from '@supabase/supabase-js';
import type { BeMundObject } from '@/lib/types';

interface OwnedItem {
  id: string;
  owner_name: string;
  owner_email: string;
  created_at: string;
  objects: {
    id: string;
    title: string;
    category: string;
    year: number;
    edition_number: number;
    edition_total: number;
    qr_code: string;
    issuers: { name: string; email: string } | null;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [issuedObjects, setIssuedObjects] = useState<BeMundObject[]>([]);
  const [ownedItems, setOwnedItems] = useState<OwnedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/auth/login');
        return;
      }

      setUser(session.user);
      const userId = session.user.id;

      // 1. Load issued objects (as artist/issuer)
      const { data: issuer } = await supabase
        .from('issuers')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (issuer) {
        const { data: objs } = await supabase
          .from('objects')
          .select('*')
          .eq('issuer_id', issuer.id)
          .order('created_at', { ascending: false });

        if (objs) setIssuedObjects(objs);
      }

      // 2. Load owned objects (as buyer/owner)
      const { data: owned } = await supabase
        .from('ownerships')
        .select('*, objects(*, issuers(name, email))')
        .eq('owner_user_id', userId)
        .eq('is_current', true)
        .order('created_at', { ascending: false });

      if (owned) setOwnedItems(owned as unknown as OwnedItem[]);

      setLoading(false);
    }
    load();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/auth/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasIssued = issuedObjects.length > 0;
  const hasOwned = ownedItems.length > 0;
  const hasNothing = !hasIssued && !hasOwned;

  const dateFormatter = new Intl.DateTimeFormat('cs-CZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Top bar */}
      <div className="border-b border-[rgba(201,169,110,0.15)] bg-[rgba(10,10,10,0.92)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-3.5">
            <LogoSymbol size={24} />
            <span className="font-display text-base tracking-[5px] uppercase font-light text-ivory">
              Be Mund
            </span>
            <span className="text-[8px] tracking-[3px] uppercase text-champagne font-medium ml-2 hidden sm:inline">
              Dashboard
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[rgba(245,242,236,0.4)] hidden sm:inline">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-[9px] tracking-[2px] uppercase text-[rgba(245,242,236,0.4)] hover:text-champagne transition-colors font-body cursor-pointer bg-transparent border border-[rgba(201,169,110,0.2)] px-4 py-2 rounded-sm hover:border-[rgba(201,169,110,0.4)]"
            >
              Odhlásit se
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">

        {/* ═══ EMPTY STATE ═══ */}
        {hasNothing && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <LogoSymbol size={56} className="opacity-20 mb-8" />
            <h1 className="font-display text-3xl font-light tracking-tight mb-3">
              Vítejte v Be Mund
            </h1>
            <p className="text-sm text-[rgba(245,242,236,0.4)] mb-8 max-w-sm">
              Zaregistrujte své první dílo nebo naskenujte QR kód pro převzetí vlastnictví.
            </p>
            <Link
              href="/dashboard/objects/new"
              className="flex items-center gap-2 px-6 py-3 bg-champagne text-obsidian font-semibold text-[9px] tracking-[2px] uppercase rounded-sm transition-colors hover:bg-champagne-light font-body"
            >
              + Přidat první dílo
            </Link>
          </div>
        )}

        {/* ═══ SEKCE 1 — Moje sbírka (vlastněná díla) ═══ */}
        {hasOwned && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-2xl font-light tracking-tight mb-1">
                  Moje sbírka
                </h2>
                <p className="text-[11px] text-[rgba(245,242,236,0.4)]">
                  {ownedItems.length} {ownedItems.length === 1 ? 'dílo' : ownedItems.length < 5 ? 'díla' : 'děl'} ve vlastnictví
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownedItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/dashboard/collection/${item.objects.qr_code}`}
                  className="group bg-graphite border border-[rgba(201,169,110,0.12)] rounded-sm p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.4)]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[8px] tracking-[2px] uppercase text-champagne font-medium">
                      {item.objects.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[rgba(122,184,154,0.1)] rounded-sm">
                      <span className="w-1 h-1 rounded-full bg-success" />
                      <span className="text-[7px] tracking-[1.5px] uppercase text-success font-medium">
                        Vlastním
                      </span>
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-light tracking-tight text-ivory mb-1 group-hover:text-champagne-light transition-colors">
                    {item.objects.title}
                  </h3>

                  <p className="text-[11px] text-champagne italic mb-2 font-display">
                    {item.objects.issuers?.name && item.objects.issuers.name !== item.objects.issuers.email
                      ? item.objects.issuers.name
                      : item.objects.issuers?.email ?? 'Neznámý autor'}
                  </p>

                  <p className="text-[11px] text-[rgba(245,242,236,0.35)] mb-1">
                    Kus č. {item.objects.edition_number} z {item.objects.edition_total} &middot; {item.objects.year}
                  </p>

                  <p className="text-[9px] text-[rgba(245,242,236,0.25)] mb-3">
                    Pořízeno: {dateFormatter.format(new Date(item.created_at))}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-mono text-[rgba(245,242,236,0.2)] tracking-wider">
                      {item.objects.qr_code}
                    </p>
                    <span className="text-[8px] tracking-[2px] uppercase text-champagne opacity-0 group-hover:opacity-100 transition-opacity">
                      Zobrazit certifikát &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ SEKCE 2 — Moje díla (jako vydavatel) ═══ */}
        {hasIssued && (
          <section>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl font-light tracking-tight mb-1">
                  Moje díla
                </h2>
                <p className="text-[11px] text-[rgba(245,242,236,0.4)]">
                  {issuedObjects.length} {issuedObjects.length === 1 ? 'dílo' : issuedObjects.length < 5 ? 'díla' : 'děl'} zaregistrováno
                </p>
              </div>

              <Link
                href="/dashboard/objects/new"
                className="flex items-center gap-2 px-5 py-3 bg-champagne text-obsidian font-semibold text-[9px] tracking-[2px] uppercase rounded-sm transition-colors hover:bg-champagne-light font-body"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Přidat nové dílo
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {issuedObjects.map((obj) => (
                <Link
                  key={obj.id}
                  href={`/dashboard/objects/${obj.id}`}
                  className="group bg-graphite border border-[rgba(201,169,110,0.12)] rounded-sm p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.4)]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[8px] tracking-[2px] uppercase text-champagne font-medium">
                      {obj.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[rgba(201,169,110,0.08)] rounded-sm">
                      <span className="text-[7px] tracking-[1.5px] uppercase text-champagne font-medium">
                        Vydáno
                      </span>
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-light tracking-tight text-ivory mb-1 group-hover:text-champagne-light transition-colors">
                    {obj.title}
                  </h3>

                  <p className="text-[11px] text-[rgba(245,242,236,0.35)] mb-3">
                    Kus č. {obj.edition_number} z {obj.edition_total} &middot; {obj.year}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-mono text-[rgba(245,242,236,0.2)] tracking-wider">
                      {obj.qr_code}
                    </p>
                    <span className="text-[8px] tracking-[2px] uppercase text-champagne opacity-0 group-hover:opacity-100 transition-opacity">
                      Zobrazit QR &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Add button for users who only have owned items */}
        {hasOwned && !hasIssued && (
          <section className="mt-12 pt-8 border-t border-[rgba(201,169,110,0.1)]">
            <div className="text-center">
              <p className="text-[11px] text-[rgba(245,242,236,0.3)] mb-4">
                Jste také umělec nebo vydavatel?
              </p>
              <Link
                href="/dashboard/objects/new"
                className="inline-flex items-center gap-2 px-5 py-3 bg-transparent border border-[rgba(201,169,110,0.25)] text-[rgba(245,242,236,0.5)] font-medium text-[9px] tracking-[2px] uppercase rounded-sm transition-colors hover:border-champagne hover:text-champagne font-body"
              >
                + Zaregistrovat vlastní dílo
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
