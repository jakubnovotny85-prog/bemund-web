'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogoSymbol } from '@/components/ui/Logo';
import type { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push('/auth/login');
        return;
      }
      setUser(data.user);
      setLoading(false);
    }
    getUser();
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
      <main className="flex-1 flex items-center justify-center py-32">
        <div className="text-center max-w-md px-6">
          <LogoSymbol size={56} className="mx-auto mb-8 opacity-30" />
          <h1 className="font-display text-3xl font-light tracking-tight mb-4">
            Vítejte v Be Mund Dashboard
          </h1>
          <p className="text-sm leading-relaxed text-[rgba(245,242,236,0.4)] mb-2">
            Brzy zde budete spravovat svá díla, edice a certifikáty vlastnictví.
          </p>
          <p className="text-[9px] tracking-[3px] uppercase text-champagne font-medium mt-6">
            Připravujeme pro vás
          </p>
        </div>
      </main>
    </div>
  );
}
