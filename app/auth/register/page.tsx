'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { AuthCard } from '@/components/auth/AuthCard';
import type { IssuerType } from '@/lib/types';

const issuerTypes: { value: IssuerType; label: string }[] = [
  { value: 'artist', label: 'Umělec / Artist' },
  { value: 'gallery', label: 'Galerie / Gallery' },
  { value: 'club', label: 'Klub / Club' },
  { value: 'brand', label: 'Značka / Brand' },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState<IssuerType>('artist');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        options: { data: { name, type } },
      });

      if (authError) {
        setError(authError.message.includes('already registered') ? 'Tento email je již registrován.' : authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        await supabase.from('issuers').insert({ user_id: authData.user.id, name, email, type, verified: false });
      }

      router.push(redirectTo ?? '/dashboard');
      router.refresh();
    } catch {
      setError('Nastala neočekávaná chyba. Zkuste to znovu.');
    } finally {
      setLoading(false);
    }
  }

  const loginHref = redirectTo ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}` : '/auth/login';

  const inputClass = 'w-full bg-graphite-2 border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-sm font-body font-light text-ivory outline-none transition-colors focus:border-[rgba(201,169,110,0.6)] placeholder:text-[rgba(245,242,236,0.25)]';
  const labelClass = 'text-[8px] tracking-[3px] uppercase text-champagne font-medium mb-1.5 block';

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
