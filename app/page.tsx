import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { UseCases } from '@/components/landing/UseCases';
import { TrustSection } from '@/components/landing/TrustSection';
import { WaitlistForm } from '@/components/landing/WaitlistForm';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <UseCases />
        <TrustSection />
        <WaitlistForm />
      </main>
      <Footer />
    </>
  );
}
