export const BRAND = {
  name: 'Be Mund',
  tagline: 'A modern trust layer for the physical world',
  url: 'bemund.io',
  verifyUrl: 'verify.bemund.io',
} as const;

export const COLORS = {
  obsidian: '#0A0A0A',
  graphite: '#141414',
  slate: '#252525',
  champagne: '#C9A96E',
  champagneLight: '#DFC18A',
  champagnePale: '#E8D5A8',
  ivory: '#F5F2EC',
  success: '#7AB89A',
} as const;

export const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Use cases', href: '#use-cases' },
  { label: 'Verify', href: '/verify' },
] as const;

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/bemund' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/bemund' },
  { label: 'X', href: 'https://x.com/bemund' },
] as const;
