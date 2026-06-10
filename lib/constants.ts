export const BRAND = {
  name: 'Be Mund',
  tagline: 'A modern trust layer for the physical world',
  url: 'bemund.cz',
  verifyUrl: 'verify.bemund.cz',
} as const;

export const COLORS = {
  obsidian: '#0A0A0A',
  graphite: '#141414',
  graphite2: '#1C1C1C',
  slate: '#252525',
  champagne: '#C9A96E',
  champagneLight: '#DFC18A',
  champagnePale: '#E8D5A8',
  ivory: '#F5F2EC',
  success: '#7AB89A',
} as const;

export const NAV_LINKS = [
  { label: 'Jak to funguje', href: '#how-it-works' },
  { label: 'Galerie', href: '/galery' },
  { label: 'Pro koho', href: '#use-cases' },
  { label: 'Ověřit objekt', href: '/verify' },
] as const;

export const FOOTER_LINKS = [
  { label: 'Jak to funguje', href: '#how-it-works' },
  { label: 'Ověřit objekt', href: '/verify' },
  { label: 'Pro umělce', href: '#use-cases' },
  { label: 'Kontakt', href: 'mailto:info@bemund.cz' },
] as const;

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/bemund.cz' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/bemund' },
] as const;
