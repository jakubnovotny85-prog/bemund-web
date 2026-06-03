import type { Issuer, BeMundObject, Ownership, VerifyResult } from './types';

const mockIssuer: Issuer = {
  id: 'issuer-001',
  created_at: '2024-01-15T10:00:00Z',
  name: 'Jan Novak',
  email: 'jan@novak-art.cz',
  type: 'artist',
  verified: true,
};

const mockObject: BeMundObject = {
  id: 'obj-001',
  created_at: '2024-06-01T14:30:00Z',
  issuer_id: 'issuer-001',
  title: 'Praha v desti',
  description: 'Oil on canvas depicting Prague in the rain. Part of the "Prague Seasons" collection capturing the city\'s atmospheric moods across different weather conditions.',
  category: 'art',
  edition_number: 7,
  edition_total: 50,
  year: 2024,
  medium: 'Oil on canvas',
  dimensions: '80 × 60 cm',
  image_url: null,
  qr_code: 'BM-2024-007-A4K9',
  qr_url: 'https://www.bemund.cz/claim/BM-2024-007-A4K9',
  royalty_percent: 5.0,
  status: 'active',
  issuer: mockIssuer,
};

const mockCurrentOwnership: Ownership = {
  id: 'own-002',
  created_at: '2025-06-15T16:00:00Z',
  object_id: 'obj-001',
  owner_name: 'Karel N.',
  owner_email: 'karel@email.cz',
  owner_user_id: 'user-002',
  acquired_at: '2025-06-15T16:00:00Z',
  transaction_hash: 'addr1qx8f2k9m3p5n7v6w4j8h2y9c4d7e2f1a',
  transfer_price: null,
  is_current: true,
};

const mockOwnershipHistory: Ownership[] = [
  mockCurrentOwnership,
  {
    id: 'own-001',
    created_at: '2024-06-15T14:30:00Z',
    object_id: 'obj-001',
    owner_name: 'Jan Novak (author)',
    owner_email: 'jan@novak-art.cz',
    owner_user_id: 'user-001',
    acquired_at: '2024-06-15T14:30:00Z',
    transaction_hash: 'addr1qx9a3b7c2d5e8f4g6h1j3k5l7m9n0p2q4r',
    transfer_price: null,
    is_current: false,
  },
];

export const MOCK_VERIFY_DATA: Record<string, VerifyResult> = {
  'BM-2024-007-A4K9': {
    object: mockObject,
    currentOwnership: mockCurrentOwnership,
    ownershipHistory: mockOwnershipHistory,
    issuer: mockIssuer,
    verified: true,
  },
};

export function lookupVerify(id: string): VerifyResult | null {
  return MOCK_VERIFY_DATA[id.toUpperCase()] ?? null;
}
