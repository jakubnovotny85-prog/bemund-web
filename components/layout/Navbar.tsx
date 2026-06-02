'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogoSymbol } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { NAV_LINKS } from '@/lib/constants';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,10,10,0.92)] backdrop-blur-md border-b border-[rgba(201,169,110,0.15)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between h-[72px]">
        <Link href="/" className="flex items-center gap-3.5">
          <LogoSymbol size={28} />
          <span className="font-display text-lg tracking-[5px] uppercase font-light text-ivory">
            Be Mund
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[9px] tracking-[2.5px] uppercase text-[rgba(245,242,236,0.4)] hover:text-champagne transition-colors duration-200 font-body font-normal relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-champagne hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link href="#waitlist">
            <Button variant="primary" className="px-5 py-2.5 text-[9px]">
              Získat přístup
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-ivory transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
          <span className={`block w-5 h-px bg-ivory transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-ivory transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-[rgba(201,169,110,0.15)] bg-[rgba(10,10,10,0.98)] px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[10px] tracking-[3px] uppercase text-[rgba(245,242,236,0.5)] hover:text-champagne transition-colors font-body py-1"
            >
              {link.label}
            </Link>
          ))}
          <Link href="#waitlist" onClick={() => setMenuOpen(false)}>
            <Button variant="primary" className="mt-2 w-full">
              Získat přístup
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
