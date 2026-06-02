'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LogoSymbol } from '@/components/ui/Logo';
import type { ObjectCategory } from '@/lib/types';

const categories: { value: ObjectCategory; label: string }[] = [
  { value: 'art', label: 'Umění / Art' },
  { value: 'sports', label: 'Sport / Sports' },
  { value: 'luxury', label: 'Luxus / Luxury' },
  { value: 'collectible', label: 'Sběratelství / Collectibles' },
  { value: 'other', label: 'Jiné / Other' },
];

export default function NewObjectPage() {
  const router = useRouter();
  const [issuerId, setIssuerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ObjectCategory>('art');
  const [year, setYear] = useState(new Date().getFullYear());
  const [medium, setMedium] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [editionNumber, setEditionNumber] = useState(1);
  const [editionTotal, setEditionTotal] = useState(1);
  const [royaltyPercent, setRoyaltyPercent] = useState(5);

  useEffect(() => {
    async function getIssuer() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push('/auth/login');
        return;
      }

      // Get issuer record for this user
      const { data: issuer } = await supabase
        .from('issuers')
        .select('id')
        .eq('user_id', userData.user.id)
        .single();

      if (issuer) {
        setIssuerId(issuer.id);
      } else {
        // Use user ID as fallback issuer_id
        setIssuerId(userData.user.id);
      }
      setAuthLoading(false);
    }
    getIssuer();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Název díla je povinný.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/objects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          year,
          medium: medium.trim(),
          dimensions: dimensions.trim(),
          edition_number: editionNumber,
          edition_total: editionTotal,
          royalty_percent: royaltyPercent,
          issuer_id: issuerId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Nastala chyba při ukládání.');
        setLoading(false);
        return;
      }

      router.push(`/dashboard/objects/${data.object.id}`);
    } catch {
      setError('Nastala neočekávaná chyba.');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass =
    'w-full bg-graphite-2 border border-[rgba(201,169,110,0.15)] rounded-sm px-4 py-3 text-sm font-body font-light text-ivory outline-none transition-colors focus:border-[rgba(201,169,110,0.6)] placeholder:text-[rgba(245,242,236,0.2)]';

  const labelClass =
    'text-[8px] tracking-[3px] uppercase text-champagne font-medium mb-1.5 block';

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Top bar */}
      <div className="border-b border-[rgba(201,169,110,0.15)] bg-[rgba(10,10,10,0.95)] backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 md:px-12 flex items-center justify-between h-[72px]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <LogoSymbol size={22} />
            <span className="font-display text-base tracking-[5px] uppercase font-light text-ivory">
              Be Mund
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="text-[9px] tracking-[2px] uppercase text-[rgba(245,242,236,0.4)] hover:text-champagne transition-colors font-body"
          >
            &larr; Zpět na dashboard
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        <h1 className="font-display text-3xl font-light tracking-tight mb-2">
          Zaregistrovat nové dílo
        </h1>
        <p className="text-sm text-[rgba(245,242,236,0.4)] mb-10">
          Vyplňte informace o díle. Po uložení se vygeneruje unikátní QR kód.
        </p>

        <form onSubmit={handleSubmit}>
          {/* SEKCE 1 — O díle */}
          <div className="bg-graphite-2 border border-[rgba(201,169,110,0.15)] rounded-sm p-8 mb-6">
            <p className="text-[9px] tracking-[4px] uppercase text-champagne font-medium mb-6">
              O díle
            </p>

            <div className="flex flex-col gap-5">
              <div>
                <label className={labelClass}>Název díla *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Praha v dešti"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Popis</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                  placeholder="Krátký popis díla, jeho příběh nebo kontext..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
                <p className="text-[9px] text-[rgba(245,242,236,0.2)] mt-1 text-right">
                  {description.length}/500
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Kategorie *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ObjectCategory)}
                    className={`${inputClass} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C9A96E' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_16px_center]`}
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value} className="bg-graphite-2 text-ivory">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Rok vzniku</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    min={1800}
                    max={2100}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Technika</label>
                  <input
                    type="text"
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    placeholder="Olej na plátně"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Rozměry</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="80 × 60 cm"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEKCE 2 — Edice */}
          <div className="bg-graphite-2 border border-[rgba(201,169,110,0.15)] rounded-sm p-8 mb-6">
            <p className="text-[9px] tracking-[4px] uppercase text-champagne font-medium mb-6">
              Edice & Royalty
            </p>

            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Číslo tohoto kusu</label>
                  <input
                    type="number"
                    value={editionNumber}
                    onChange={(e) => setEditionNumber(Math.max(1, Number(e.target.value)))}
                    min={1}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Celkem kusů v edici</label>
                  <input
                    type="number"
                    value={editionTotal}
                    onChange={(e) => setEditionTotal(Math.max(1, Number(e.target.value)))}
                    min={1}
                    className={inputClass}
                  />
                </div>
              </div>

              <p className="text-sm text-[rgba(245,242,236,0.5)] -mt-2">
                Kus č. <span className="text-champagne">{editionNumber}</span> z{' '}
                <span className="text-champagne">{editionTotal}</span>
              </p>

              <div>
                <label className={labelClass}>
                  Royalty %
                  <span className="ml-2 text-[rgba(245,242,236,0.3)] normal-case tracking-normal font-light">
                    — procento z každého přeprodeje jde vám
                  </span>
                </label>
                <input
                  type="number"
                  value={royaltyPercent}
                  onChange={(e) => setRoyaltyPercent(Math.min(30, Math.max(0, Number(e.target.value))))}
                  min={0}
                  max={30}
                  step={0.5}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-[#E07070] text-sm text-center mb-4">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-champagne text-obsidian font-semibold text-[10px] tracking-[3px] uppercase rounded-sm cursor-pointer transition-colors hover:bg-champagne-light disabled:opacity-50 disabled:cursor-not-allowed font-body"
          >
            {loading ? 'Generuji certifikát...' : 'Zaregistrovat dílo a vygenerovat QR'}
          </button>
        </form>
      </div>
    </div>
  );
}
