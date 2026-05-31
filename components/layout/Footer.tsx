import Link from 'next/link';
import { LogoWithTagline } from '@/components/ui/Logo';
import { NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-[rgba(201,169,110,0.15)] bg-obsidian">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <LogoWithTagline />
            <p className="mt-6 text-xs leading-relaxed text-[rgba(245,242,236,0.35)] max-w-sm">
              Every valuable object deserves a trusted digital identity.
              Verified on the Cardano blockchain, accessible forever.
            </p>
          </div>

          <div>
            <h4 className="text-[8px] tracking-[4px] uppercase text-champagne font-medium mb-5">
              Platform
            </h4>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[11px] text-[rgba(245,242,236,0.4)] hover:text-champagne transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/dashboard"
                  className="text-[11px] text-[rgba(245,242,236,0.4)] hover:text-champagne transition-colors"
                >
                  Issuer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[8px] tracking-[4px] uppercase text-champagne font-medium mb-5">
              Connect
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
          <span className="text-[9px] tracking-[2px] uppercase text-[rgba(201,169,110,0.3)]">
            &copy; {new Date().getFullYear()} Be Mund. All rights reserved.
          </span>
          <div className="flex gap-6">
            <span className="text-[9px] tracking-[1px] text-[rgba(245,242,236,0.2)] hover:text-[rgba(245,242,236,0.4)] cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="text-[9px] tracking-[1px] text-[rgba(245,242,236,0.2)] hover:text-[rgba(245,242,236,0.4)] cursor-pointer transition-colors">
              Terms of Use
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
