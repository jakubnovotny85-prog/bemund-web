import { createClient } from '@supabase/supabase-js';
import { generateQRId, getClaimUrl } from '@/lib/qr';

interface CreateObjectBody {
  title: string;
  description: string;
  category: string;
  year: number;
  medium: string;
  dimensions: string;
  edition_number: number;
  edition_total: number;
  royalty_percent: number;
  image_url: string | null;
}

export async function POST(request: Request) {
  // 1. Get user from Authorization header
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use anon key with user's auth token
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }

  const userId = user.id;
  const userEmail = user.email ?? '';

  // 2. Find or create issuer
  const { data: existingIssuer } = await supabase
    .from('issuers')
    .select('id')
    .eq('user_id', userId)
    .single();

  let issuerId = existingIssuer?.id;

  if (!issuerId) {
    const { data: newIssuer, error: issuerError } = await supabase
      .from('issuers')
      .insert({
        user_id: userId,
        name: userEmail,
        email: userEmail,
        type: 'artist',
      })
      .select('id')
      .single();

    if (issuerError || !newIssuer) {
      return Response.json({ error: 'Failed to create issuer: ' + (issuerError?.message ?? 'unknown') }, { status: 500 });
    }

    issuerId = newIssuer.id;
  }

  // 3. Parse body
  let body: CreateObjectBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const {
    title,
    description,
    category,
    year,
    medium,
    dimensions,
    edition_number,
    edition_total,
    royalty_percent,
    image_url,
  } = body;

  if (!title) {
    return Response.json({ error: 'Title is required' }, { status: 400 });
  }

  // 4. Generate unique QR code
  const qr_code = generateQRId();
  const qr_url = getClaimUrl(qr_code);

  // 5. Save to database
  const { data, error } = await supabase
    .from('objects')
    .insert({
      issuer_id: issuerId,
      title,
      description: description || null,
      category,
      year,
      medium: medium || null,
      dimensions: dimensions || null,
      edition_number,
      edition_total,
      royalty_percent,
      qr_code,
      qr_url,
      image_url: image_url || null,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true, object: data });
}
