import { createClient } from '@supabase/supabase-js';

interface ClaimBody {
  qr_code: string;
  owner_name: string;
  owner_email: string;
  transfer_price: number | null;
}

export async function POST(request: Request) {
  // Debug: check env vars
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('Claim API - SUPABASE_URL exists:', !!url);
  console.log('Claim API - SERVICE_ROLE_KEY exists:', !!key);

  if (!url || !key) {
    console.error('Missing env vars:', { url: !!url, key: !!key });
    return Response.json(
      { error: 'Server misconfigured: missing Supabase credentials' },
      { status: 500 }
    );
  }

  const supabase = createClient(url, key);

  let body: ClaimBody;
  try {
    body = await request.json();
  } catch (e) {
    console.error('JSON parse error:', e);
    return Response.json({ error: 'Neplatné tělo požadavku' }, { status: 400 });
  }

  const { qr_code, owner_name, owner_email, transfer_price } = body;
  console.log('Claim request:', { qr_code, owner_name, owner_email });

  if (!qr_code || !owner_name || !owner_email) {
    return Response.json({ error: 'Vyplňte všechna povinná pole' }, { status: 400 });
  }

  // 1. Find object by qr_code
  const { data: object, error: objError } = await supabase
    .from('objects')
    .select('*')
    .eq('qr_code', qr_code)
    .single();

  if (objError) {
    console.error('Object lookup error:', objError);
    return Response.json({ error: `Objekt nenalezen: ${objError.message}` }, { status: 404 });
  }

  if (!object) {
    return Response.json({ error: 'Objekt s tímto QR kódem neexistuje' }, { status: 404 });
  }

  console.log('Found object:', { id: object.id, status: object.status, title: object.title });

  if (object.status !== 'active') {
    return Response.json({ error: 'already_claimed' }, { status: 409 });
  }

  // 2. Create ownership record
  const { error: ownershipError } = await supabase
    .from('ownerships')
    .insert({
      object_id: object.id,
      owner_name,
      owner_email,
      transfer_price: transfer_price || null,
      is_current: true,
    });

  if (ownershipError) {
    console.error('Ownership insert error:', ownershipError);
    return Response.json(
      { error: `Chyba při zápisu vlastnictví: ${ownershipError.message}` },
      { status: 500 }
    );
  }

  // 3. Update object status
  const { error: updateError } = await supabase
    .from('objects')
    .update({ status: 'claimed' })
    .eq('id', object.id);

  if (updateError) {
    console.error('Object update error:', updateError);
    // Ownership was created, so we still return success
  }

  console.log('Claim success for:', qr_code);
  return Response.json({ success: true });
}
