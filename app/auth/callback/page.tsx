'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { LogoSymbol } from '@/components/ui/Logo';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    // supabase-js automatically detects the session from the URL
    // fragment (#access_token=...) via detectSessionInUrl (default: true).
    // We listen for the SIGNED_IN event and then redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Small delay to ensure session is fully persisted in localStorage
          setTimeout(() => {
            router.replace(redirectTo);
          }, 100);
        }
      }
    );

    // Fallback: if session already exists (e.g. user navigates here directly),
    // redirect immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(redirectTo);
      }
    });

    // Safety timeout — if nothing happens in 10s, send to login
    const timeout = setTimeout(() => {
      router.replace('/auth/login');
    }, 10000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router, redirectTo]);

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center gap-6">
      <LogoSymbol size={36} className="opacity-40" />
      <div className="w-6 h-6 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[rgba(245,242,236,0.5)] tracking-[1px]">
        Ověřujeme váš účet...
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-obsidian flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
