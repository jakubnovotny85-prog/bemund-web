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
  issuer_id: string;
}

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

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
    issuer_id,
  } = body;

  if (!title || !issuer_id) {
    return Response.json({ error: 'Title and issuer_id are required' }, { status: 400 });
  }

  // Generate unique QR code
  const qr_code = generateQRId();
  const qr_url = getClaimUrl(qr_code);

  // Save to database
  const { data, error } = await supabase
    .from('objects')
    .insert({
      issuer_id,
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
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true, object: data });
}
