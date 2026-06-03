import { createClient } from '@supabase/supabase-js';

interface ClaimBody {
  qr_code: string;
  owner_name: string;
  owner_email: string;
  transfer_price: number | null;
}

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let body: ClaimBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid_body' }, { status: 400 });
  }

  const { qr_code, owner_name, owner_email, transfer_price } = body;

  if (!qr_code || !owner_name || !owner_email) {
    return Response.json({ error: 'missing_fields' }, { status: 400 });
  }

  // 1. Find object by qr_code
  const { data: object, error: objError } = await supabase
    .from('objects')
    .select('*')
    .eq('qr_code', qr_code)
    .single();

  if (objError || !object) {
    return Response.json({ error: 'not_found' }, { status: 404 });
  }

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
    return Response.json({ error: ownershipError.message }, { status: 500 });
  }

  // 3. Update object status
  await supabase
    .from('objects')
    .update({ status: 'claimed' })
    .eq('id', object.id);

  return Response.json({ success: true });
}
