import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const CATEGORIES = [
  {
    slug: 'painting',
    label: 'Obrazy',
    description: 'Originální umělecká díla s doloženým původem.',
  },
  {
    slug: 'card',
    label: 'Sběratelské karty',
    description: 'Limitované edice s ověřitelným pořadovým číslem.',
  },
  {
    slug: 'jewelry',
    label: 'Klenoty',
    description: 'Šperky a luxusní předměty s certifikátem pravosti.',
  },
] as const;

export const metadata = {
  title: 'Galerie — Be Mund',
  description: 'Díla s ověřitelným digitálním certifikátem vlastnictví.',
};

export default async function GaleryPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Count available items per category
  const counts: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    const { count } = await supabase
      .from('gallery_objects')
      .select('id', { count: 'exact', head: true })
      .eq('category', cat.slug);
    counts[cat.slug] = count ?? 0;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-32 pb-16 lg:pb-24">
          {/* Header */}
          <div className="mb-14">
            <p className="text-xs tracking-[4px] uppercase text-champagne font-medium mb-3">
              Be Mund
            </p>
            <h1 className="font-display text-4xl lg:text-5xl font-light tracking-tight mb-6">
              Galerie
            </h1>
            <p className="text-sm leading-[1.9] text-[rgba(245,242,236,0.5)] max-w-2xl">
              Galerie Be Mund je místo, kde se sběratelská a umělecká díla vystavují
              i nabízejí k pořízení. Ke každému objektu patří digitální certifikát
              vlastnictví&nbsp;— ověřitelný důkaz jeho původu, pravosti a majitele,
              trvale zapsaný na blockchainu. Vyberte si z kategorií níže a staňte se
              doloženým vlastníkem.
            </p>
          </div>

          {/* Category tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => {
              const count = counts[cat.slug];
              const hasItems = count > 0;
              const href = hasItems ? `/galery/${cat.slug}` : '/#waitlist';

              return (
                <Link
                  key={cat.slug}
                  href={href}
                  className={`group relative bg-graphite border rounded-sm p-8 transition-all duration-200 ${
                    hasItems
                      ? 'border-[rgba(201,169,110,0.2)] hover:-translate-y-1 hover:border-[rgba(201,169,110,0.5)]'
                      : 'border-[rgba(201,169,110,0.08)] opacity-55'
                  }`}
                >
                  {/* Gold top accent */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] transition-opacity ${
                    hasItems
                      ? 'bg-gradient-to-r from-champagne via-champagne-light to-transparent opacity-60 group-hover:opacity-100'
                      : 'bg-gradient-to-r from-champagne to-transparent opacity-20'
                  }`} />

                  {/* Category label */}
                  <p className="text-[8px] tracking-[3px] uppercase text-champagne font-medium mb-4">
                    Kategorie
                  </p>

                  <h2 className={`font-display text-2xl font-light tracking-tight mb-2 transition-colors ${
                    hasItems ? 'text-ivory group-hover:text-champagne-light' : 'text-[rgba(245,242,236,0.5)]'
                  }`}>
                    {cat.label}
                  </h2>

                  <p className="text-[11px] leading-[1.7] text-[rgba(245,242,236,0.4)] mb-6">
                    {cat.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    {hasItems ? (
                      <>
                        <span className="text-[10px] text-[rgba(245,242,236,0.35)]">
                          {count} {count === 1 ? 'dílo' : count < 5 ? 'díla' : 'děl'}
                        </span>
                        <span className="text-[9px] tracking-[2px] uppercase text-champagne opacity-0 group-hover:opacity-100 transition-opacity">
                          Prohlédnout &rarr;
                        </span>
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(201,169,110,0.06)] border border-[rgba(201,169,110,0.12)] rounded-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-champagne opacity-40" />
                        <span className="text-[8px] tracking-[2px] uppercase text-[rgba(201,169,110,0.5)] font-medium">
                          Připravujeme
                        </span>
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
