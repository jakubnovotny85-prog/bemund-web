import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

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

  const ownerName = (user.user_metadata?.name as string) ?? user.email ?? 'Unknown';
  const ownerEmail = user.email ?? '';

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
      owner_name: ownerName,
      owner_email: ownerEmail,
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

  // Load full object details for email
  const { data: objectDetails } = await supabase
    .from('objects')
    .select('*, issuers(name, email)')
    .eq('id', object.id)
    .single();

  const authorName = objectDetails?.issuers?.name ?? objectDetails?.issuers?.email ?? 'Be Mund';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.bemund.cz';
  const today = new Date().toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Send certificate email (don't block claim if email fails)
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: 'Be Mund <onboarding@resend.dev>',
        to: ownerEmail,
        subject: `Certifikát vlastnictví — ${object.title}`,
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Georgia,serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">

<div style="text-align:center;margin-bottom:32px;">
<p style="color:#C9A96E;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px;">BE MUND</p>
<p style="color:rgba(244,241,235,0.4);font-size:9px;letter-spacing:3px;text-transform:uppercase;margin:0;">A MODERN TRUST LAYER FOR THE PHYSICAL WORLD</p>
</div>

<div style="border-top:1px solid rgba(201,169,110,0.2);margin-bottom:32px;"></div>

<div style="text-align:center;margin-bottom:32px;">
<p style="color:#C9A96E;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin:0 0 12px;">CERTIFICATE OF OWNERSHIP</p>
<h1 style="color:#F5F2EC;font-size:32px;font-weight:300;margin:0 0 8px;letter-spacing:1px;">${object.title}</h1>
<p style="color:#C9A96E;font-size:16px;font-style:italic;margin:0;">${authorName}</p>
</div>

<div style="background:#141414;border:1px solid rgba(201,169,110,0.3);border-radius:4px;overflow:hidden;margin-bottom:32px;">
<div style="height:2px;background:#C9A96E;"></div>
<div style="padding:24px;">

<table style="width:100%;border-collapse:collapse;">
<tr style="border-bottom:1px solid rgba(201,169,110,0.1);">
<td style="color:rgba(244,241,235,0.4);font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;padding:10px 0;">DÍLO</td>
<td style="color:#F5F2EC;font-size:13px;text-align:right;padding:10px 0;">${object.title}</td>
</tr>
<tr style="border-bottom:1px solid rgba(201,169,110,0.1);">
<td style="color:rgba(244,241,235,0.4);font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;padding:10px 0;">AUTOR</td>
<td style="color:#F5F2EC;font-size:13px;text-align:right;padding:10px 0;">${authorName}</td>
</tr>
<tr style="border-bottom:1px solid rgba(201,169,110,0.1);">
<td style="color:rgba(244,241,235,0.4);font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;padding:10px 0;">EDICE</td>
<td style="color:#F5F2EC;font-size:13px;text-align:right;padding:10px 0;">Kus č. ${object.edition_number} z ${object.edition_total}</td>
</tr>
<tr style="border-bottom:1px solid rgba(201,169,110,0.1);">
<td style="color:rgba(244,241,235,0.4);font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;padding:10px 0;">MAJITEL</td>
<td style="color:#F5F2EC;font-size:13px;text-align:right;padding:10px 0;">${ownerName}</td>
</tr>
<tr style="border-bottom:1px solid rgba(201,169,110,0.1);">
<td style="color:rgba(244,241,235,0.4);font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;padding:10px 0;">DATUM</td>
<td style="color:#F5F2EC;font-size:13px;text-align:right;padding:10px 0;">${today}</td>
</tr>
<tr style="border-bottom:1px solid rgba(201,169,110,0.1);">
<td style="color:rgba(244,241,235,0.4);font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;padding:10px 0;">ID</td>
<td style="color:#C9A96E;font-size:13px;font-family:monospace;text-align:right;padding:10px 0;">${object.qr_code}</td>
</tr>
<tr>
<td style="color:rgba(244,241,235,0.4);font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;padding:10px 0;">STATUS</td>
<td style="color:#7AB89A;font-size:13px;text-align:right;padding:10px 0;">✓ Ověřeno</td>
</tr>
</table>

</div>
</div>

<div style="text-align:center;margin-bottom:32px;">
<a href="${appUrl}/verify" style="display:inline-block;background:#C9A96E;color:#0A0A0A;padding:14px 32px;text-decoration:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:600;font-family:Arial,sans-serif;border-radius:2px;">OVĚŘIT CERTIFIKÁT →</a>
</div>

<div style="border-top:1px solid rgba(201,169,110,0.15);padding-top:24px;text-align:center;">
<p style="color:rgba(244,241,235,0.3);font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;margin:0 0 8px;">BE MUND · BEMUND.CZ</p>
<p style="color:rgba(244,241,235,0.2);font-size:9px;font-family:Arial,sans-serif;margin:0;">Tento certifikát je zapsán na Cardano blockchainu.</p>
</div>

</div>
</body>
</html>`,
      });

      console.log('Certificate email sent to:', ownerEmail);
    } else {
      console.log('RESEND_API_KEY not set, skipping email');
    }
  } catch (emailError) {
    console.error('Email send failed (claim still successful):', emailError);
  }

  return Response.json({
    success: true,
    owner_name: ownerName,
    owner_email: ownerEmail,
  });
}
