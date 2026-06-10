'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import { supabase } from '@/lib/supabase';
import { LogoSymbol } from '@/components/ui/Logo';
import { GalleryToggle } from '@/components/dashboard/GalleryToggle';
import type { BeMundObject } from '@/lib/types';

export default function ObjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [object, setObject] = useState<BeMundObject | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const loadObject = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push('/auth/login');
      return;
    }

    const { data, error } = await supabase
      .from('objects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      router.push('/dashboard');
      return;
    }

    setObject(data);

    // Generate QR code
    const claimUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.bemund.cz'}/claim/${data.qr_code}`;
    const qr = await QRCode.toDataURL(claimUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#C9A96E',
        light: '#0A0A0A',
      },
    });
    setQrDataUrl(qr);
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    loadObject();
  }, [loadObject]);

  function downloadQR() {
    if (!qrDataUrl || !object) return;
    const link = document.createElement('a');
    link.download = `bemund-qr-${object.qr_code}.png`;
    link.href = qrDataUrl;
    link.click();
  }

  function copyId() {
    if (!object) return;
    navigator.clipboard.writeText(object.qr_code);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!object) return null;

  const claimUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.bemund.cz'}/claim/${object.qr_code}`;

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

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        {/* Object image */}
        {object.image_url && (
          <div className="mb-8 flex items-center justify-center max-h-[70vh] bg-graphite rounded-sm border border-[rgba(201,169,110,0.15)]">
            <img
              src={object.image_url}
              alt={object.title}
              className="max-w-full max-h-[70vh] object-contain rounded-sm"
            />
          </div>
        )}

        {/* Object info */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[rgba(122,184,154,0.1)] border border-[rgba(122,184,154,0.3)] rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              <span className="text-[8px] tracking-[2px] uppercase text-success font-medium">
                Aktivní
              </span>
            </span>
            <span className="text-[9px] tracking-[2px] uppercase text-[rgba(245,242,236,0.3)]">
              {object.category}
            </span>
          </div>

          <h1 className="font-display text-4xl font-light tracking-tight mb-2">
            {object.title}
          </h1>

          {object.description && (
            <p className="text-sm text-[rgba(245,242,236,0.5)] mb-4 max-w-lg">
              {object.description}
            </p>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-[rgba(245,242,236,0.4)]">
            {object.year && <span>Rok: {object.year}</span>}
            {object.medium && <span>Technika: {object.medium}</span>}
            {object.dimensions && <span>Rozměry: {object.dimensions}</span>}
            <span>
              Edice: kus č. {object.edition_number} z {object.edition_total}
            </span>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="bg-obsidian border border-[rgba(201,169,110,0.4)] rounded-sm p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-champagne via-champagne-light to-transparent" />

          <p className="text-[9px] tracking-[4px] uppercase text-champagne font-medium mb-1">
            QR kód vygenerován
          </p>
          <div className="w-12 h-px bg-[rgba(201,169,110,0.3)] mb-8" />

          {/* QR Image */}
          <div className="flex justify-center mb-8">
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt={`QR kód pro ${object.title}`}
                width={240}
                height={240}
                className="rounded-sm"
              />
            )}
          </div>

          {/* ID & URL */}
          <div className="text-center mb-6">
            <p className="text-sm font-mono text-champagne tracking-wider mb-1">
              {object.qr_code}
            </p>
            <p className="text-[10px] text-[rgba(245,242,236,0.3)] font-mono break-all">
              {claimUrl}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-center mb-8">
            <button
              onClick={downloadQR}
              className="flex items-center gap-2 px-5 py-2.5 bg-champagne text-obsidian font-semibold text-[9px] tracking-[2px] uppercase rounded-sm cursor-pointer transition-colors hover:bg-champagne-light font-body"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Stáhnout PNG
            </button>
            <button
              onClick={copyId}
              className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[rgba(201,169,110,0.3)] text-[rgba(245,242,236,0.6)] font-medium text-[9px] tracking-[2px] uppercase rounded-sm cursor-pointer transition-colors hover:border-champagne hover:text-champagne font-body"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Kopírovat ID
            </button>
          </div>

          {/* Instructions */}
          <div className="text-center border-t border-[rgba(201,169,110,0.15)] pt-6">
            <p className="text-sm text-[rgba(245,242,236,0.5)] leading-relaxed max-w-sm mx-auto">
              Vytiskněte a přilepte tento QR kód na zadní stranu díla.
              Kupující naskenuje a stane se ověřeným majitelem.
            </p>
          </div>
        </div>

        {/* Gallery toggle */}
        <div className="mt-8">
          <GalleryToggle objectId={object.id} initialInGallery={object.in_gallery ?? false} />
        </div>

        {/* Back to dashboard */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-[10px] tracking-[2px] uppercase text-[rgba(245,242,236,0.4)] hover:text-champagne transition-colors font-body"
          >
            &larr; Zpět na přehled díla
          </Link>
        </div>
      </div>
    </div>
  );
}
