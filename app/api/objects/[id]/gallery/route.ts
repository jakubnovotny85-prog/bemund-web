import { createClient } from '@supabase/supabase-js';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: objectId } = await params;

  // 1. Authenticate user from Bearer token
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Verify identity via anon key + user token
  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  // 2. Parse body
  let body: { in_gallery: boolean };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (typeof body.in_gallery !== 'boolean') {
    return Response.json({ error: 'in_gallery must be boolean' }, { status: 400 });
  }

  // 3. Use service role for authorization checks and write
  //    (RLS may block anon client from reading cross-table data needed for auth checks)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 4. Load the object
  const { data: object, error: objError } = await supabase
    .from('objects')
    .select('id, issuer_id')
    .eq('id', objectId)
    .single();

  if (objError || !object) {
    return Response.json({ error: 'Object not found' }, { status: 404 });
  }

  // 5. Check current ownership
  const { data: currentOwnership } = await supabase
    .from('ownerships')
    .select('owner_user_id')
    .eq('object_id', objectId)
    .eq('is_current', true)
    .single();

  // 6. Authorization: who may toggle?
  if (currentOwnership) {
    // Object HAS a current owner → only that owner may toggle
    if (currentOwnership.owner_user_id !== user.id) {
      return Response.json(
        { error: 'Pouze aktuální vlastník může měnit viditelnost v galerii' },
        { status: 403 }
      );
    }
  } else {
    // Object has NO current owner → only the issuer may toggle
    const { data: issuer } = await supabase
      .from('issuers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!issuer || issuer.id !== object.issuer_id) {
      return Response.json(
        { error: 'Pouze vydavatel tohoto díla může měnit viditelnost v galerii' },
        { status: 403 }
      );
    }
  }

  // 7. Update in_gallery
  const { error: updateError } = await supabase
    .from('objects')
    .update({ in_gallery: body.in_gallery })
    .eq('id', objectId);

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 });
  }

  return Response.json({
    success: true,
    in_gallery: body.in_gallery,
  });
}
