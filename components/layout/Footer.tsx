import Link from 'next/link';
import { LogoSymbol } from '@/components/ui/Logo';
import { FOOTER_LINKS, SOCIAL_LINKS } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-[rgba(201,169,110,0.15)] bg-obsidian">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Logo + tagline */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <LogoSymbol size={28} />
              <span className="font-display text-lg tracking-[5px] uppercase font-light text-ivory">
                Be Mund
              </span>
            </div>
            <p className="text-[11px] tracking-[2px] uppercase text-champagne opacity-60 mb-4">
              A modern trust layer for the physical world.
            </p>
            <p className="text-xs leading-relaxed text-[rgba(245,242,236,0.3)] max-w-sm">
              Každý hodnotný objekt si zaslouží důvěryhodnou digitální identitu.
              Ověřeno na Cardano blockchainu, přístupné navždy.
            </p>
          </div>

          {/* Navigace */}
          <div>
            <h4 className="text-[8px] tracking-[4px] uppercase text-champagne font-medium mb-5">
              Navigace
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[11px] text-[rgba(245,242,236,0.4)] hover:text-champagne transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sociální sítě */}
          <div>
            <h4 className="text-[8px] tracking-[4px] uppercase text-champagne font-medium mb-5">
              Sledujte nás
            </h4>
            <ul className="flex flex-col gap-3">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[rgba(245,242,236,0.4)] hover:text-champagne transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[rgba(201,169,110,0.1)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="text-[9px] tracking-[2px] uppercase text-[rgba(201,169,110,0.3)]">
              &copy; 2025 Be Mund &middot; Všechna práva vyhrazena
            </span>
            <span className="text-[8px] tracking-[1px] text-[rgba(245,242,236,0.15)]">
              Powered by Cardano blockchain
            </span>
          </div>
          <div className="flex gap-6">
            <span className="text-[9px] tracking-[1px] text-[rgba(245,242,236,0.2)] hover:text-[rgba(245,242,236,0.4)] cursor-pointer transition-colors">
              Ochrana soukromí
            </span>
            <span className="text-[9px] tracking-[1px] text-[rgba(245,242,236,0.2)] hover:text-[rgba(245,242,236,0.4)] cursor-pointer transition-colors">
              Podmínky použití
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
