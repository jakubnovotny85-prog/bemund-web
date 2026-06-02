'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function RegisterPage() {
  const router = useRouter();
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
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, type },
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Tento email je již registrován.');
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      // 2. Insert into issuers table
      if (authData.user) {
        const { error: issuerError } = await supabase.from('issuers').insert({
          user_id: authData.user.id,
          name,
          email,
          type,
          verified: false,
        });

        if (issuerError) {
          console.error('Issuer insert error:', issuerError);
          // Don't block — user is created, issuer record can be fixed later
        }
      }

      // 3. Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Nastala neočekávaná chyba. Zkuste to znovu.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full bg-graphite-2 border border-[rgba(201,169,110,0.2)] rounded-sm px-4 py-3 text-sm font-body font-light text-ivory outline-none transition-colors focus:border-[rgba(201,169,110,0.6)] placeholder:text-[rgba(245,242,236,0.25)]';

  const labelClass =
    'text-[8px] tracking-[3px] uppercase text-champagne font-medium mb-1.5 block';

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className={labelClass}>Jméno a příjmení</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jan Novák"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jan@email.cz"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Heslo</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Typ účtu</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as IssuerType)}
            className={`${inputClass} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C9A96E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_16px_center]`}
          >
            {issuerTypes.map((t) => (
              <option key={t.value} value={t.value} className="bg-graphite-2 text-ivory">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-[#E07070] text-xs text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-champagne text-obsidian font-semibold text-[10px] tracking-[3px] uppercase rounded-sm cursor-pointer transition-colors hover:bg-champagne-light disabled:opacity-50 disabled:cursor-not-allowed font-body"
        >
          {loading ? 'Registruji...' : 'Vytvořit účet'}
        </button>
      </form>

      <p className="text-center mt-6 text-[11px] text-[rgba(245,242,236,0.4)]">
        Již máte účet?{' '}
        <Link href="/auth/login" className="text-champagne hover:text-champagne-light transition-colors">
          Přihlásit se &rarr;
        </Link>
      </p>
    </AuthCard>
  );
}
