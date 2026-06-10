'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface GalleryToggleProps {
  objectId: string;
  initialInGallery: boolean;
}

export function GalleryToggle({ objectId, initialInGallery }: GalleryToggleProps) {
  const [inGallery, setInGallery] = useState(initialInGallery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function toggle() {
    setLoading(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Nejste přihlášeni');
        setLoading(false);
        return;
      }

      const newValue = !inGallery;

      const res = await fetch(`/api/objects/${objectId}/gallery`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ in_gallery: newValue }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? `Chyba ${res.status}: nepodařilo se změnit viditelnost`);
        setLoading(false);
        return;
      }

      setInGallery(data.in_gallery ?? newValue);
    } catch (err) {
      setError(`Síťová chyba: ${err instanceof Error ? err.message : 'nepodařilo se spojit se serverem'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-graphite border border-[rgba(201,169,110,0.2)] rounded-sm p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[9px] tracking-[2px] uppercase text-[rgba(245,242,236,0.4)] mb-1">
            Veřejná galerie
          </p>
          <p className="text-[12px] text-ivory">
            {inGallery ? 'Dílo je viditelné v galerii' : 'Dílo není v galerii'}
          </p>
        </div>

        <button
          onClick={toggle}
          disabled={loading}
          className={`
            relative shrink-0 w-12 h-7 rounded-full transition-colors cursor-pointer
            ${inGallery
              ? 'bg-success'
              : 'bg-[rgba(245,242,236,0.12)]'
            }
            ${loading ? 'opacity-50 cursor-wait' : ''}
          `}
          aria-label={inGallery ? 'Stáhnout z galerie' : 'Zveřejnit v galerii'}
        >
          <span
            className={`
              absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform
              ${inGallery ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {error && (
        <p className="mt-3 text-[12px] text-red-400 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-sm px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
