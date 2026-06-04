import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(request: Request) {
  let body: { email: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { email } = body;

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Email je povinný' }, { status: 400 });
  }

  // Save to Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error: dbError } = await supabase
    .from('waitlist')
    .insert({ email });

  if (dbError) {
    if (dbError.message.includes('duplicate') || dbError.message.includes('unique')) {
      return Response.json({ success: true, message: 'already_registered' });
    }
    console.error('Waitlist insert error:', dbError);
    return Response.json({ error: dbError.message }, { status: 500 });
  }

  // Notify admin
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: 'Be Mund <certifikat@bemund.cz>',
        to: 'jakub@bemund.com',
        subject: `Nová registrace na waitlist — ${email}`,
        html: `<div style="font-family:Arial,sans-serif;background:#0A0A0A;color:#F5F2EC;padding:32px;max-width:480px;">
<p style="color:#C9A96E;font-size:11px;letter-spacing:3px;text-transform:uppercase;">BE MUND · WAITLIST</p>
<h2 style="color:#F5F2EC;font-weight:300;font-size:24px;margin:16px 0;">Nová registrace</h2>
<p style="color:#F5F2EC;font-size:16px;">Email: <strong style="color:#C9A96E;">${email}</strong></p>
<p style="color:rgba(244,241,235,0.5);font-size:13px;">Přidáno: ${new Date().toLocaleString('cs-CZ')}</p>
<hr style="border-color:rgba(201,169,110,0.2);margin:24px 0;">
<a href="https://bemund.cz/dashboard" style="color:#C9A96E;font-size:12px;">Otevřít dashboard →</a>
</div>`,
      });
    }
  } catch (e) {
    console.error('Waitlist notification email failed:', e);
  }

  return Response.json({ success: true });
}
