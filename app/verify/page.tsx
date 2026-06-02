import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { VerifyForm } from '@/components/verify/VerifyForm';

export const metadata: Metadata = {
  title: 'Ověřit objekt — Be Mund',
  description: 'Veřejné ověření autenticity a vlastnictví jakéhokoliv Be Mund certifikovaného objektu. Bez registrace.',
};

export default function VerifyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <VerifyForm />
      </main>
      <Footer />
    </>
  );
}
