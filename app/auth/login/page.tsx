'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { AuthCard } from '@/components/auth/AuthCard';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('Nesprávný email nebo heslo.');
        setLoading(false);
        return;
      }

      router.push(redirectTo ?? '/dashboard');
      router.refresh();
    } catch {
      setError('Nastala neočekávaná chyba. Zkuste to znovu.');
    } finally {
      setLoading(false);
    }
  }

  const registerHref = redirectTo
    ? `/auth/register?redirect=${encodeURIComponent(redirectTo)}`
    : '/auth/register';

  const inputClass =
    'w-full bg-graphite-2 border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-sm font-body font-light text-ivory outline-none transition-colors focus:border-[rgba(201,169,110,0.6)] placeholder:text-[rgba(245,242,236,0.25)]';

  const labelClass =
    'text-[8px] tracking-[3px] uppercase text-champagne font-medium mb-1.5 block';

  return (
    <AuthCard>
      {redirectTo && (
        <p className="text-center text-[11px] text-champagne mb-6 p-3 bg-[rgba(201,169,110,0.08)] rounded-sm border border-[rgba(201,169,110,0.15)]">
          Pro převzetí vlastnictví se přihlaste.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jan@email.cz" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Heslo</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={inputClass} />
        </div>
        {error && <p className="text-[#E07070] text-xs text-center">{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-3.5 bg-champagne text-obsidian font-semibold text-[10px] tracking-[3px] uppercase rounded-sm cursor-pointer transition-colors hover:bg-champagne-light disabled:opacity-50 disabled:cursor-not-allowed font-body">
          {loading ? 'Přihlašuji...' : 'Přihlásit se'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-[rgba(201,169,110,0.15)]" />
        <span className="text-[9px] tracking-[2px] uppercase text-[rgba(245,242,236,0.25)] font-body">nebo</span>
        <div className="flex-1 h-px bg-[rgba(201,169,110,0.15)]" />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={() => {
          const callbackUrl = redirectTo
            ? `/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
            : '/auth/callback';
          supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}${callbackUrl}` },
          });
        }}
        className="w-full flex items-center justify-center gap-3 bg-graphite border border-[rgba(201,169,110,0.3)] rounded-sm px-4 py-3.5 text-[13px] tracking-[1px] uppercase text-ivory font-body cursor-pointer transition-colors hover:border-[rgba(201,169,110,0.6)]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Přihlásit přes Google
      </button>

      <p className="text-center mt-6 text-[11px] text-[rgba(245,242,236,0.4)]">
        Nemáte účet?{' '}
        <Link href={registerHref} className="text-champagne hover:text-champagne-light transition-colors">Registrovat se &rarr;</Link>
      </p>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-obsidian flex items-center justify-center"><div className="w-6 h-6 border-2 border-champagne border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
