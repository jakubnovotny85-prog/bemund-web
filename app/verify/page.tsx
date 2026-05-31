import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { VerifyForm } from '@/components/verify/VerifyForm';

export const metadata: Metadata = {
  title: 'Verify — Be Mund',
  description: 'Publicly verify the authenticity and ownership of any Be Mund certified object. No account required.',
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
