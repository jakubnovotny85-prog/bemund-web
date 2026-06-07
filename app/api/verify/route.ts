import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const qrCode = searchParams.get('qr_code')?.trim().toUpperCase();

  if (!qrCode) {
    return Response.json({ error: 'qr_code je povinný' }, { status: 400 });
  }

  // Service role client — server-only, bypasses RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Lookup object with issuer join
  const { data: obj, error: objError } = await supabase
    .from('objects')
    .select('title, category, year, medium, edition_number, edition_total, qr_code, created_at, status, id, issuers(name)')
    .eq('qr_code', qrCode)
    .single();

  if (objError || !obj) {
    return Response.json({ error: 'not_found' }, { status: 404 });
  }

  // Lookup current ownership — only safe columns
  const { data: own } = await supabase
    .from('ownerships')
    .select('owner_name, created_at')
    .eq('object_id', obj.id)
    .eq('is_current', true)
    .single();

  // Return only safe, GDPR-compliant data — never expose
  // owner_email, owner_user_id, transfer_price, transaction_hash, issuers.email
  return Response.json({
    object: {
      title: obj.title,
      category: obj.category,
      year: obj.year,
      medium: obj.medium,
      edition_number: obj.edition_number,
      edition_total: obj.edition_total,
      qr_code: obj.qr_code,
      created_at: obj.created_at,
      status: obj.status,
      issuer_name: (obj.issuers as unknown as { name: string } | null)?.name ?? null,
    },
    ownership: own
      ? {
          owner_name: own.owner_name,
          created_at: own.created_at,
        }
      : null,
  });
}
