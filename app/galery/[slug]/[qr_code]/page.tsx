import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ImageLightbox } from '@/components/gallery/ImageLightbox';

const CATEGORIES: Record<string, string> = {
  painting: 'Obrazy',
  card: 'Sběratelské karty',
  jewelry: 'Klenoty',
};

interface GalleryObject {
  id: string;
  title: string;
  image_url: string | null;
  edition_number: number;
  edition_total: number;
  year: number;
  category: string;
  medium: string | null;
  qr_code: string;
  author: string | null;
  is_available: boolean;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; qr_code: string }> }) {
  const { qr_code } = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from('gallery_objects')
    .select('title, author')
    .eq('qr_code', qr_code)
    .single();

  if (!data) return { title: 'Dílo nenalezeno — Be Mund' };
  return {
    title: `${data.title} — Galerie Be Mund`,
    description: `${data.title} od ${data.author ?? 'neznámého autora'} — digitální certifikát vlastnictví Be Mund.`,
  };
}

export default async function GaleryDetailPage({ params }: { params: Promise<{ slug: string; qr_code: string }> }) {
  const { slug, qr_code } = await params;

  if (!CATEGORIES[slug]) {
    notFound();
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: obj } = await supabase
    .from('gallery_objects')
    .select('*')
    .eq('qr_code', qr_code)
    .single();

  if (!obj) {
    notFound();
  }

  const item = obj as GalleryObject;

  // Redirect to correct category slug if mismatched
  if (item.category !== slug) {
    const correctSlug = CATEGORIES[item.category] ? item.category : null;
    if (correctSlug) {
      redirect(`/galery/${correctSlug}/${item.qr_code}`);
    }
    redirect('/galery');
  }

  const categoryLabel = CATEGORIES[item.category] ?? item.category;
  const authorName = item.author ?? 'Neznámý autor';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 pt-32 pb-16 lg:pb-24">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href={`/galery/${slug}`}
              className="text-[9px] tracking-[2px] uppercase text-[rgba(245,242,236,0.35)] hover:text-champagne transition-colors font-body"
            >
              &larr; {categoryLabel}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Image */}
            <div>
              {item.image_url ? (
                <ImageLightbox src={item.image_url} alt={item.title} />
              ) : (
                <div className="aspect-[4/3] bg-graphite border border-[rgba(201,169,110,0.12)] rounded-sm flex items-center justify-center">
                  <div className="text-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.2)" strokeWidth="1" strokeLinecap="round" className="mx-auto mb-3">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <p className="text-[9px] tracking-[2px] uppercase text-[rgba(245,242,236,0.2)]">
                      Fotografie bude doplněna
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="text-[8px] tracking-[3px] uppercase text-champagne font-medium mb-4">
                {categoryLabel}
              </p>

              <h1 className="font-display text-4xl lg:text-5xl font-light tracking-tight mb-3">
                {item.title}
              </h1>

              <p className="text-lg text-champagne italic font-display mb-6">
                {authorName} &middot; {item.year}
              </p>

              {/* Details */}
              <div className="bg-graphite border border-[rgba(201,169,110,0.15)] rounded-sm p-6 mb-6">
                <div className="flex flex-col gap-3.5">
                  {[
                    ['Kategorie', categoryLabel],
                    ...(item.medium ? [['Technika', item.medium]] : []),
                    ['Edice', `#${String(item.edition_number).padStart(3, '0')} / ${String(item.edition_total).padStart(3, '0')}`],
                    ['ID', item.qr_code],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center py-1 border-b border-[rgba(201,169,110,0.08)] last:border-b-0">
                      <span className="text-[9px] tracking-[2px] uppercase text-[rgba(245,242,236,0.35)]">
                        {label}
                      </span>
                      <span className={`text-[12px] ${label === 'ID' ? 'font-mono text-champagne' : 'text-ivory'}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status chips */}
              <div className="flex flex-wrap gap-3 mb-8">
                {/* Availability */}
                {item.is_available ? (
                  <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-[rgba(122,184,154,0.08)] border border-[rgba(122,184,154,0.25)] rounded-sm">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-[9px] tracking-[2px] uppercase text-success font-medium">
                      Dostupné
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-[rgba(201,169,110,0.06)] border border-[rgba(201,169,110,0.15)] rounded-sm">
                    <span className="w-2 h-2 rounded-full bg-champagne opacity-50" />
                    <span className="text-[9px] tracking-[2px] uppercase text-[rgba(201,169,110,0.6)] font-medium">
                      Vlastněno
                    </span>
                  </span>
                )}

                {/* Verified */}
                <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-[rgba(122,184,154,0.08)] border border-[rgba(122,184,154,0.25)] rounded-sm">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-[9px] tracking-[2px] uppercase text-success font-medium">
                    Ověřeno &middot; Cardano
                  </span>
                </span>
              </div>

              {/* TODO: ověření + on-chain odkaz po prvním mintu */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
