import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LogoSymbol } from '@/components/ui/Logo';

export const metadata: Metadata = {
  title: 'Issuer Dashboard — Be Mund',
  description: 'Manage your objects, certificates, and editions on the Be Mund platform.',
};

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-32">
        <div className="text-center max-w-md px-6">
          <LogoSymbol size={56} className="mx-auto mb-8 opacity-30" />
          <h1 className="font-display text-3xl font-light tracking-[1px] mb-4">
            Issuer Dashboard
          </h1>
          <p className="text-sm leading-[1.9] text-[rgba(245,242,236,0.4)] mb-2">
            The issuer portal is coming soon. Register your artworks,
            manage editions, and track ownership — all in one place.
          </p>
          <p className="text-[9px] tracking-[3px] uppercase text-champagne font-medium mt-6">
            Phase 2 — MVP Build
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
