import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LogoSymbol } from '@/components/ui/Logo';

export const metadata = {
  title: 'Detail díla — Be Mund',
};

export default function GaleryDetailPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian">
        <div className="max-w-3xl mx-auto px-6 md:px-12 pt-32 pb-16 text-center">
          <LogoSymbol size={48} className="opacity-20 mx-auto mb-8" />
          <h1 className="font-display text-3xl font-light tracking-tight mb-3">
            Detail díla
          </h1>
          <p className="text-sm text-[rgba(245,242,236,0.4)] mb-8">
            Tato stránka je ve vývoji. Brzy zde najdete kompletní detail díla s certifikátem.
          </p>
          <Link
            href="/galery"
            className="text-[10px] tracking-[2px] uppercase text-champagne hover:text-champagne-light transition-colors font-body"
          >
            &larr; Zpět do galerie
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
