import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Be Mund — A Modern Trust Layer for the Physical World',
  description:
    'Scan the QR code on your artwork, watch, or collectible. Be Mund records your ownership on the Cardano blockchain — forever, securely, verifiably.',
  keywords: ['Be Mund', 'blockchain', 'authenticity', 'NFT', 'Cardano', 'ownership', 'art', 'collectibles'],
  openGraph: {
    title: 'Be Mund — Ownership that cannot be forged',
    description: 'A modern trust layer for the physical world. Verify ownership on the Cardano blockchain.',
    siteName: 'Be Mund',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body font-light">
        {children}
      </body>
    </html>
  );
}
