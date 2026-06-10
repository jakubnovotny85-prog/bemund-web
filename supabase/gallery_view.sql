-- Gallery public view — safe columns only, security definer (default)
-- Run this in Supabase SQL Editor

create or replace view public.gallery_objects as
select
  o.id,
  o.title,
  o.image_url,
  o.edition_number,
  o.edition_total,
  o.year,
  o.category,
  o.medium,
  o.qr_code,
  i.name as author,
  (not exists (
    select 1 from public.ownerships ow
    where ow.object_id = o.id and ow.is_current = true
  )) as is_available
from public.objects o
left join public.issuers i on i.id = o.issuer_id
where o.status in ('active', 'claimed');

grant select on public.gallery_objects to anon, authenticated;
