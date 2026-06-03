import { createClient } from '@supabase/supabase-js';

interface ClaimBody {
  qr_code: string;
  transfer_price: number | null;
}

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return Response.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const supabase = createClient(url, key);

  // 1. Authenticate user from token
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  const ownerName = (user.user_metadata?.name as string) ?? user.email ?? 'Unknown';
  const ownerEmail = user.email ?? '';

  // 2. Parse body
  let body: ClaimBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Neplatné tělo požadavku' }, { status: 400 });
  }

  const { qr_code, transfer_price } = body;

  if (!qr_code) {
    return Response.json({ error: 'QR kód je povinný' }, { status: 400 });
  }

  // 3. Find object
  const { data: object, error: objError } = await supabase
    .from('objects')
    .select('*')
    .eq('qr_code', qr_code)
    .single();

  if (objError || !object) {
    return Response.json({ error: 'Objekt s tímto QR kódem neexistuje' }, { status: 404 });
  }

  if (object.status !== 'active') {
    return Response.json({ error: 'already_claimed' }, { status: 409 });
  }

  // 4. Create ownership record
  const { error: ownershipError } = await supabase
    .from('ownerships')
    .insert({
      object_id: object.id,
      owner_name: ownerName,
      owner_email: ownerEmail,
      owner_user_id: user.id,
      transfer_price: transfer_price || null,
      is_current: true,
    });

  if (ownershipError) {
    console.error('Ownership insert error:', ownershipError);
    return Response.json({ error: `Chyba při zápisu: ${ownershipError.message}` }, { status: 500 });
  }

  // 5. Update object status
  await supabase
    .from('objects')
    .update({ status: 'claimed' })
    .eq('id', object.id);

  return Response.json({
    success: true,
    owner_name: ownerName,
    owner_email: ownerEmail,
  });
}
