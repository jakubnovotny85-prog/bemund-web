export type IssuerType = 'artist' | 'gallery' | 'club' | 'brand';

export type ObjectCategory = 'art' | 'sports' | 'collectible' | 'luxury' | 'other';

export type ObjectStatus = 'draft' | 'active' | 'claimed' | 'transferred';

export interface Issuer {
  id: string;
  created_at: string;
  name: string;
  email: string;
  type: IssuerType;
  verified: boolean;
}

export interface BeMundObject {
  id: string;
  created_at: string;
  issuer_id: string;
  title: string;
  description: string;
  category: ObjectCategory;
  edition_number: number;
  edition_total: number;
  year: number;
  medium: string | null;
  dimensions: string | null;
  image_url: string | null;
  qr_code: string;
  qr_url: string;
  royalty_percent: number;
  status: ObjectStatus;
  in_gallery: boolean;
  issuer?: Issuer;
}

export interface Ownership {
  id: string;
  created_at: string;
  object_id: string;
  owner_name: string;
  owner_email: string;
  owner_user_id: string | null;
  acquired_at: string;
  transaction_hash: string;
  transfer_price: number | null;
  is_current: boolean;
}

export interface VerifyResult {
  object: BeMundObject;
  currentOwnership: Ownership;
  ownershipHistory: Ownership[];
  issuer: Issuer;
  verified: boolean;
}
