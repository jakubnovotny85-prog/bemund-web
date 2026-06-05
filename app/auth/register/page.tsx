'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { AuthCard } from '@/components/auth/AuthCard';
import { LogoSymbol } from '@/components/ui/Logo';
import type { IssuerType } from '@/lib/types';

const issuerTypes: { value: IssuerType; label: string }[] = [
  { value: 'artist', label: 'Umělec / Artist' },
  { value: 'gallery', label: 'Galerie / Gallery' },
  { value: 'club', label: 'Klub / Club' },
  { value: 'brand', label: 'Značka / Brand' },
];

function RegisterForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState<IssuerType>('artist');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Heslo musí mít alespoň 8 znaků.');
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, type },
          emailRedirectTo: redirectTo
            ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
            : `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message.includes('already registered') ? 'Tento email je již registrován.' : authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        await supabase.from('issuers').insert({ user_id: authData.user.id, name, email, type, verified: false });
      }

      setRegistered(true);
    } catch {
      setError('Nastala neočekávaná chyba. Zkuste to znovu.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setResent(false);

    await supabase.auth.resend({
      type: 'signup',
      email,
    });

    setResent(true);
    setResending(false);
  }

  const loginHref = redirectTo ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}` : '/auth/login';

  const inputClass = 'w-full bg-graphite-2 border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-sm font-body font-light text-ivory outline-none transition-colors focus:border-[rgba(201,169,110,0.6)] placeholder:text-[rgba(245,242,236,0.25)]';
  const labelClass = 'text-[8px] tracking-[3px] uppercase text-champagne font-medium mb-1.5 block';

  // ─── SUCCESS: Email confirmation screen ───
  if (registered) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
        <div className="w-full max-w-[420px] bg-graphite border border-[rgba(201,169,110,0.2)] rounded-sm p-12">
          <div className="flex flex-col items-center text-center">
            <LogoSymbol size={36} className="mb-6 opacity-50" />

            {/* Email icon */}
            <div className="w-16 h-16 mb-6 rounded-full border border-[rgba(201,169,110,0.3)] bg-[rgba(201,169,110,0.06)] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4L12 13L2 4" />
              </svg>
            </div>

            <h2 className="font-display text-[28px] font-light tracking-tight mb-3">
              Zkontrolujte svůj email
            </h2>

            <p className="text-sm text-[rgba(245,242,236,0.5)] mb-2">
              Poslali jsme potvrzovací email na adresu:
            </p>

            <p className="text-sm text-champagne font-semibold mb-6">
              {email}
            </p>

            <p className="text-[11px] text-[rgba(245,242,236,0.4)] leading-relaxed mb-8">
              Klikněte na odkaz v emailu pro dokončení registrace.
            </p>

            <div className="w-full h-px bg-[rgba(201,169,110,0.15)] mb-8" />

            <p className="text-[11px] text-[rgba(245,242,236,0.4)] mb-4">
              Poté se přihlaste zde:
            </p>

            <Link
              href={loginHref}
              className="w-full py-3.5 bg-champagne text-obsidian font-semibold text-[10px] tracking-[3px] uppercase rounded-sm text-center transition-colors hover:bg-champagne-light font-body block mb-8"
            >
              Přejít na přihlášení
            </Link>

            <div className="text-center">
              <p className="text-[10px] text-[rgba(245,242,236,0.3)] mb-2">
                Email nepřišel? Zkontrolujte složku Spam.
              </p>

              {resent ? (
                <p className="text-[10px] text-success">
                  Email byl znovu odeslán ✓
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-[10px] text-champagne hover:text-champagne-light transition-colors cursor-pointer bg-transparent border-none font-body disabled:opacity-50"
                >
                  {resending ? 'Odesílám...' : 'Odeslat znovu'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── FORM ───
  return (
    <AuthCard>
      {redirectTo && (
        <p className="text-center text-[11px] text-champagne mb-6 p-3 bg-[rgba(201,169,110,0.08)] rounded-sm border border-[rgba(201,169,110,0.15)]">
          Vytvořte si účet pro převzetí vlastnictví.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className={labelClass}>Jméno a příjmení</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jan Novák" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jan@email.cz" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Heslo</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Typ účtu</label>
          <select value={type} onChange={(e) => setType(e.target.value as IssuerType)} className={`${inputClass} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C9A96E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_16px_center]`}>
            {issuerTypes.map((t) => (
              <option key={t.value} value={t.value} className="bg-graphite-2 text-ivory">{t.label}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-[#E07070] text-xs text-center">{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-3.5 bg-champagne text-obsidian font-semibold text-[10px] tracking-[3px] uppercase rounded-sm cursor-pointer transition-colors hover:bg-champagne-light disabled:opacity-50 disabled:cursor-not-allowed font-body">
          {loading ? 'Registruji...' : 'Vytvořit účet'}
        </button>
      </form>

      <p className="text-center mt-6 text-[11px] text-[rgba(245,242,236,0.4)]">
        Již máte účet?{' '}
        <Link href={loginHref} className="text-champagne hover:text-champagne-light transition-colors">Přihlásit se &rarr;</Link>
      </p>
    </AuthCard>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-obsidian flex items-center justify-center"><div className="w-6 h-6 border-2 border-champagne border-t-transparent rounded-full animate-spin" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
