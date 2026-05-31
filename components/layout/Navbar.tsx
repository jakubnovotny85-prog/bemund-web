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
              className="text-[9px] tracking-[2.5px] uppercase text-[rgba(245,242,236,0.4)] hover:text-champagne transition-colors duration-200 font-body font-normal"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Button variant="primary" className="px-5 py-2.5 text-[9px]">
            Get the app
          </Button>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-ivory transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-1' : ''}`} />
          <span className={`block w-5 h-px bg-ivory transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-ivory transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[rgba(201,169,110,0.15)] bg-[rgba(10,10,10,0.98)] px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[10px] tracking-[3px] uppercase text-[rgba(245,242,236,0.5)] hover:text-champagne transition-colors font-body"
            >
              {link.label}
            </Link>
          ))}
          <Button variant="primary" className="mt-2 w-full">
            Get the app
          </Button>
        </div>
      )}
    </nav>
  );
}
