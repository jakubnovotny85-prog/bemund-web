'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { AuthCard } from '@/components/auth/AuthCard';

export default function LoginPage() {
  const router = useRouter();
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
            className={inputClass}
          />
        </div>

        {error && (
          <p className="text-[#E07070] text-xs text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-champagne text-obsidian font-semibold text-[10px] tracking-[3px] uppercase rounded-sm cursor-pointer transition-colors hover:bg-champagne-light disabled:opacity-50 disabled:cursor-not-allowed font-body"
        >
          {loading ? 'Přihlašuji...' : 'Přihlásit se'}
        </button>
      </form>

      <p className="text-center mt-6 text-[11px] text-[rgba(245,242,236,0.4)]">
        Nemáte účet?{' '}
        <Link href="/auth/register" className="text-champagne hover:text-champagne-light transition-colors">
          Registrovat se &rarr;
        </Link>
      </p>
    </AuthCard>
  );
}
