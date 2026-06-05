'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import { supabase } from '@/lib/supabase';
import { LogoSymbol } from '@/components/ui/Logo';

interface CertObject {
  id: string;
  title: string;
  description: string | null;
  category: string;
  year: number;
  medium: string | null;
  dimensions: string | null;
  edition_number: number;
  edition_total: number;
  qr_code: string;
  image_url: string | null;
  issuers: { name: string; email: string } | null;
}

interface CertOwnership {
  owner_name: string;
  owner_email: string;
  created_at: string;
}

export default function CollectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const qrCode = params.qr_code as string;

  const [object, setObject] = useState<CertObject | null>(null);
  const [ownership, setOwnership] = useState<CertOwnership | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      router.push('/auth/login');
      return;
    }

    const { data: obj } = await supabase
      .from('objects')
      .select('*, issuers(name, email)')
      .eq('qr_code', qrCode)
      .single();

    if (!obj) {
      router.push('/dashboard');
      return;
    }

    setObject(obj);

    const { data: own } = await supabase
      .from('ownerships')
      .select('*')
      .eq('object_id', obj.id)
      .eq('is_current', true)
      .single();

    if (own) setOwnership(own);

    // Generate QR
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.bemund.cz'}/verify`;
    const qr = await QRCode.toDataURL(verifyUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#C9A96E', light: '#0A0A0A' },
    });
    setQrDataUrl(qr);

    setLoading(false);
  }, [qrCode, router]);

  useEffect(() => {
    load();
  }, [load]);

  function downloadQR() {
    if (!qrDataUrl || !object) return;
    const link = document.createElement('a');
    link.download = `bemund-cert-${object.qr_code}.png`;
    link.href = qrDataUrl;
    link.click();
  }

  function shareUrl() {
    const url = `${window.location.origin}/verify`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!object) return null;

  const authorName = object.issuers?.name && object.issuers.name !== object.issuers.email
    ? object.issuers.name
    : object.issuers?.email ?? 'Neznámý autor';
  const dateFormatter = new Intl.DateTimeFormat('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const certRows: [string, string, boolean?][] = [
    ['Dílo', object.title],
    ['Autor', authorName],
    ['Edice', `Kus č. ${object.edition_number} z ${object.edition_total}`],
    ['Majitel', ownership?.owner_name ?? '—'],
    ['Datum', ownership ? dateFormatter.format(new Date(ownership.created_at)) : '—'],
    ['ID', object.qr_code],
    ['Status', '✓ Ověřeno', true],
  ];

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
          <Link href="/dashboard" className="text-[9px] tracking-[2px] uppercase text-[rgba(245,242,236,0.4)] hover:text-champagne transition-colors font-body">
            &larr; Zpět na sbírku
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        <p className="text-xs tracking-[4px] uppercase text-champagne font-medium mb-6">
          Můj certifikát
        </p>

        {/* Photo */}
        {object.image_url && (
          <div className="mb-8">
            <img
              src={object.image_url}
              alt={object.title}
              className="w-full max-h-[400px] object-cover rounded-sm border border-[rgba(201,169,110,0.15)]"
            />
          </div>
        )}

        {/* Object info */}
        <div className="mb-10">
          <h1 className="font-display text-4xl font-light tracking-tight mb-2">
            {object.title}
          </h1>
          <p className="text-lg text-champagne italic font-display mb-4">
            {authorName}
          </p>

          {object.description && (
            <p className="text-sm text-[rgba(245,242,236,0.5)] mb-4 max-w-lg">
              {object.description}
            </p>
          )}

          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-[rgba(245,242,236,0.4)]">
            <span>{object.category}</span>
            <span>&middot;</span>
            <span>{object.year}</span>
            {object.medium && <><span>&middot;</span><span>{object.medium}</span></>}
            {object.dimensions && <><span>&middot;</span><span>{object.dimensions}</span></>}
            <span>&middot;</span>
            <span>Kus č. {object.edition_number} z {object.edition_total}</span>
          </div>
        </div>

        {/* Certificate card */}
        <div className="bg-graphite border border-[rgba(201,169,110,0.4)] rounded-sm relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-champagne" />

          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <LogoSymbol size={16} />
              <span className="text-[7px] tracking-[3px] uppercase text-champagne font-medium">
                Certificate of Ownership
              </span>
            </div>

            <div className="w-full h-px bg-[rgba(201,169,110,0.2)] mb-5" />

            {certRows.map(([label, value, isGreen]) => (
              <div key={label} className="flex justify-between py-2.5 border-b border-[rgba(201,169,110,0.08)] last:border-b-0">
                <span className="text-[9px] tracking-[2px] uppercase text-[rgba(245,242,236,0.35)]">
                  {label}
                </span>
                <span className={`text-[12px] ${
                  isGreen ? 'text-success' :
                  label === 'ID' ? 'font-mono text-champagne' :
                  'text-ivory'
                }`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-obsidian border border-[rgba(201,169,110,0.25)] rounded-sm p-8 text-center mb-8">
          <p className="text-[9px] tracking-[3px] uppercase text-champagne font-medium mb-6">
            QR kód certifikátu
          </p>

          {qrDataUrl && (
            <img
              src={qrDataUrl}
              alt="QR kód"
              width={200}
              height={200}
              className="mx-auto mb-4 rounded-sm"
            />
          )}

          <p className="text-[10px] font-mono text-[rgba(245,242,236,0.3)] mb-4">
            {object.qr_code}
          </p>

          <button
            onClick={downloadQR}
            className="text-[9px] tracking-[2px] uppercase text-champagne hover:text-champagne-light transition-colors cursor-pointer bg-transparent border-none font-body"
          >
            Stáhnout QR &darr;
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/verify"
            className="flex-1 py-3.5 bg-champagne text-obsidian font-semibold text-[10px] tracking-[3px] uppercase rounded-sm text-center transition-colors hover:bg-champagne-light font-body block"
          >
            Ověřit certifikát &rarr;
          </Link>
          <button
            onClick={shareUrl}
            className="flex-1 py-3.5 bg-transparent border border-[rgba(201,169,110,0.3)] text-[rgba(245,242,236,0.6)] font-medium text-[10px] tracking-[2px] uppercase rounded-sm text-center transition-colors hover:border-champagne hover:text-champagne font-body cursor-pointer"
          >
            {copied ? '✓ Zkopírováno' : 'Sdílet certifikát'}
          </button>
        </div>
      </div>
    </div>
  );
}
