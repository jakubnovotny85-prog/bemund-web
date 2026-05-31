# Be Mund — Web Platform

A modern trust layer for the physical world. Digital authenticity for art, collectibles, sports memorabilia, and luxury goods — verified on the Cardano blockchain.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (scroll animations)
- **Supabase** (auth, database, storage — prepared, currently using mock data)
- **NMKR.io API** (Cardano NFT minting — structure prepared for Phase 2)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, how it works, use cases, trust section, waitlist |
| `/verify` | Public verification portal — enter a Be Mund ID to verify authenticity |
| `/dashboard` | Issuer dashboard (placeholder for Phase 2) |

## Demo Data

The verify portal includes mock data. Try verifying:
- **ID:** `BM-2024-007-A4K9` — "Praha v desti" by Jan Novak

## Project Structure

```
app/
  page.tsx              Landing page
  verify/page.tsx       Verify portal
  dashboard/page.tsx    Issuer dashboard (placeholder)
  layout.tsx            Root layout with fonts and metadata
  globals.css           CSS variables, fonts, Tailwind config
components/
  ui/                   Button, Logo
  layout/               Navbar, Footer
  landing/              Hero, HowItWorks, UseCases, TrustSection, WaitlistForm, FadeIn
  verify/               VerifyForm, VerifyResult
lib/
  types.ts              TypeScript types for all database tables
  constants.ts          Brand constants, navigation links
  supabase.ts           Supabase client (placeholder)
  mock-data.ts          Mock data for verify portal demo
```

## Brand

- **Colors:** Obsidian (#0A0A0A), Graphite (#141414), Champagne (#C9A96E), Ivory (#F5F2EC)
- **Display font:** Cormorant Garamond (300, 400)
- **Body font:** Montserrat (300, 400, 500, 600)
- **Design style:** Luxury Dark — minimal, elegant, generous negative space

## Deployment

```bash
npm run build
npm start
```

Compatible with Vercel, Netlify, or any Node.js hosting.
