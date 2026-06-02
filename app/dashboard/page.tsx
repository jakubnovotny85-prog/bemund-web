'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LogoSymbol } from '@/components/ui/Logo';
import type { User } from '@supabase/supabase-js';
import type { BeMundObject } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [objects, setObjects] = useState<BeMundObject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push('/auth/login');
        return;
      }
      setUser(userData.user);

      // Get issuer for this user
      const { data: issuer } = await supabase
        .from('issuers')
        .select('id')
        .eq('user_id', userData.user.id)
        .single();

      if (issuer) {
        // Load objects for this issuer
        const { data: objs } = await supabase
          .from('objects')
          .select('*')
          .eq('issuer_id', issuer.id)
          .order('created_at', { ascending: false });

        if (objs) setObjects(objs);
      }

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

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Top bar */}
      <div className="border-b border-[rgba(201,169,110,0.15)] bg-[rgba(10,10,10,0.92)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between h-[72px]">
          <div className="flex items-center gap-3.5">
            <LogoSymbol size={24} />
            <span className="font-display text-base tracking-[5px] uppercase font-light text-ivory">
              Be Mund
            </span>
            <span className="text-[8px] tracking-[3px] uppercase text-champagne font-medium ml-2 hidden sm:inline">
              Dashboard
            </span>
          </div>
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-3xl font-light tracking-tight mb-1">
              Moje díla
            </h1>
            <p className="text-sm text-[rgba(245,242,236,0.4)]">
              {objects.length === 0
                ? 'Zatím nemáte žádná zaregistrovaná díla.'
                : `${objects.length} ${objects.length === 1 ? 'dílo' : objects.length < 5 ? 'díla' : 'děl'} zaregistrováno`}
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

        {/* Objects list */}
        {objects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <LogoSymbol size={48} className="opacity-20 mb-6" />
            <p className="text-sm text-[rgba(245,242,236,0.3)] mb-6">
              Začněte registrací prvního díla.
            </p>
            <Link
              href="/dashboard/objects/new"
              className="text-[10px] tracking-[2px] uppercase text-champagne hover:text-champagne-light transition-colors font-body"
            >
              + Přidat dílo &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {objects.map((obj) => (
              <Link
                key={obj.id}
                href={`/dashboard/objects/${obj.id}`}
                className="group bg-graphite border border-[rgba(201,169,110,0.12)] rounded-sm p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.4)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[8px] tracking-[2px] uppercase text-champagne font-medium">
                    {obj.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[8px] tracking-[1px] uppercase text-success">
                    <span className="w-1 h-1 rounded-full bg-success" />
                    {obj.status}
                  </span>
                </div>

                <h3 className="font-display text-lg font-light tracking-tight text-ivory mb-1 group-hover:text-champagne-light transition-colors">
                  {obj.title}
                </h3>

                <p className="text-[11px] text-[rgba(245,242,236,0.35)] mb-3">
                  Edice #{String(obj.edition_number).padStart(3, '0')} / {String(obj.edition_total).padStart(3, '0')}
                </p>

                <p className="text-[9px] font-mono text-[rgba(245,242,236,0.25)] tracking-wider">
                  {obj.qr_code}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
