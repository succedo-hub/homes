create policy "Listing contacts are private"
on public.listing_contacts for select
to anon, authenticated
using (false);
