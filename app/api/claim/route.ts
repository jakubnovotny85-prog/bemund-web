import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Use anon key with user's auth token — no service role key needed
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    }
  );

  // Verify user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Parse body
  let body: { qr_code: string; transfer_price: number | null };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Neplatné tělo požadavku' }, { status: 400 });
  }

  const { qr_code, transfer_price } = body;

  if (!qr_code) {
    return Response.json({ error: 'QR kód je povinný' }, { status: 400 });
  }

  // Find object
  const { data: object, error: objError } = await supabase
    .from('objects')
    .select('*')
    .eq('qr_code', qr_code)
    .single();

  if (objError || !object) {
    console.error('Object lookup error:', objError);
    return Response.json({ error: 'Objekt s tímto QR kódem neexistuje' }, { status: 404 });
  }

  if (object.status !== 'active') {
    return Response.json({ error: 'already_claimed' }, { status: 409 });
  }

  // Create ownership record
  const { error: ownershipError } = await supabase
    .from('ownerships')
    .insert({
      object_id: object.id,
      owner_name: (user.user_metadata?.name as string) ?? user.email ?? 'Unknown',
      owner_email: user.email,
      owner_user_id: user.id,
      transfer_price: transfer_price || null,
      is_current: true,
    });

  if (ownershipError) {
    console.error('Ownership error:', ownershipError);
    return Response.json({ error: ownershipError.message }, { status: 500 });
  }

  // Update object status
  await supabase
    .from('objects')
    .update({ status: 'claimed' })
    .eq('id', object.id);

  return Response.json({
    success: true,
    owner_name: (user.user_metadata?.name as string) ?? user.email,
    owner_email: user.email,
  });
}
