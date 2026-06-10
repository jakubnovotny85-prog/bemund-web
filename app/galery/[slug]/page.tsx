import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LogoSymbol } from '@/components/ui/Logo';

const CATEGORIES: Record<string, { label: string; subtitle: string }> = {
  painting: {
    label: 'Obrazy',
    subtitle: 'Originální umělecká díla s doloženým původem a digitálním certifikátem.',
  },
  card: {
    label: 'Sběratelské karty',
    subtitle: 'Limitované edice sportovních a sběratelských karet s ověřitelným pořadovým číslem.',
  },
  jewelry: {
    label: 'Klenoty',
    subtitle: 'Šperky a luxusní předměty s certifikátem pravosti a původu.',
  },
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = CATEGORIES[slug];
  if (!cat) return { title: 'Galerie — Be Mund' };
  return {
    title: `${cat.label} — Galerie Be Mund`,
    description: cat.subtitle,
  };
}

export default async function GaleryCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = CATEGORIES[slug];

  if (!cat) {
    notFound();
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: objects } = await supabase
    .from('gallery_objects')
    .select('*')
    .eq('category', slug)
    .order('year', { ascending: false });

  const items: GalleryObject[] = objects ?? [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-32 pb-16 lg:pb-24">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href="/galery"
              className="text-[9px] tracking-[2px] uppercase text-[rgba(245,242,236,0.35)] hover:text-champagne transition-colors font-body"
            >
              &larr; Galerie
            </Link>
          </div>

          {/* Header */}
          <div className="mb-12">
            <p className="text-xs tracking-[4px] uppercase text-champagne font-medium mb-3">
              Kategorie
            </p>
            <h1 className="font-display text-4xl lg:text-5xl font-light tracking-tight mb-4">
              {cat.label}
            </h1>
            <p className="text-sm leading-relaxed text-[rgba(245,242,236,0.5)] max-w-lg">
              {cat.subtitle}
            </p>
          </div>

          {/* Grid */}
          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((obj) => (
                <Link
                  key={obj.id}
                  href={`/galery/${slug}/${obj.qr_code}`}
                  className="group bg-graphite border border-[rgba(201,169,110,0.12)] rounded-sm overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(201,169,110,0.4)]"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-graphite overflow-hidden flex items-center justify-center">
                    {obj.image_url ? (
                      <img
                        src={obj.image_url}
                        alt={obj.title}
                        className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <LogoSymbol size={40} className="opacity-10" />
                      </div>
                    )}

                    {/* Availability badge */}
                    <div className="absolute top-3 right-3">
                      {obj.is_available ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[rgba(10,10,10,0.75)] backdrop-blur-sm border border-[rgba(122,184,154,0.3)] rounded-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          <span className="text-[7px] tracking-[1.5px] uppercase text-success font-medium">
                            K dispozici
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[rgba(10,10,10,0.75)] backdrop-blur-sm border border-[rgba(201,169,110,0.2)] rounded-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-champagne opacity-60" />
                          <span className="text-[7px] tracking-[1.5px] uppercase text-[rgba(201,169,110,0.6)] font-medium">
                            Vlastněno
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[8px] tracking-[2px] uppercase text-champagne font-medium">
                        {cat.label}
                      </span>
                      {obj.medium && (
                        <span className="text-[8px] tracking-[1.5px] uppercase text-[rgba(245,242,236,0.25)]">
                          {obj.medium}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-lg font-light tracking-tight text-ivory mb-1 group-hover:text-champagne-light transition-colors">
                      {obj.title}
                    </h3>

                    <p className="text-[11px] text-[rgba(245,242,236,0.45)] mb-3">
                      {obj.author ?? 'Neznámý autor'} &middot; {obj.year}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[rgba(245,242,236,0.3)]">
                        Edice {obj.edition_number} / {obj.edition_total}
                      </span>

                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[rgba(122,184,154,0.08)] rounded-sm">
                        <span className="w-1 h-1 rounded-full bg-success" />
                        <span className="text-[7px] tracking-[1px] uppercase text-success font-medium">
                          Ověřeno &middot; Cardano
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty category */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <LogoSymbol size={56} className="opacity-15 mb-8" />
              <h2 className="font-display text-2xl font-light tracking-tight mb-3 text-ivory">
                V této kategorii zatím nejsou žádná díla
              </h2>
              <p className="text-sm text-[rgba(245,242,236,0.4)] max-w-sm mb-8">
                Připravujeme první {cat.label.toLowerCase()} s digitálním certifikátem.
              </p>
              <Link
                href="/galery"
                className="text-[10px] tracking-[2px] uppercase text-champagne hover:text-champagne-light transition-colors font-body"
              >
                &larr; Zpět do galerie
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
