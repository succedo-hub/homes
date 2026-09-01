create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending' check (status in ('draft', 'pending', 'published', 'rejected', 'archived')),
  listing_types text[] not null check (
    cardinality(listing_types) between 1 and 2
    and listing_types <@ array['sale', 'rent']::text[]
  ),
  property_type text not null check (property_type in ('apartment', 'house', 'terraced_house', 'semi_detached', 'cottage', 'plot', 'other')),
  title text not null check (char_length(title) between 8 and 140),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  street_address text not null check (char_length(street_address) between 2 and 160),
  district text,
  locality text not null default 'Mariehamn',
  rooms numeric(3,1) not null check (rooms > 0 and rooms <= 30),
  bedrooms smallint check (bedrooms between 0 and 20),
  living_area numeric(8,2) not null check (living_area > 0 and living_area <= 10000),
  total_area numeric(8,2) check (total_area is null or total_area >= living_area),
  floor text,
  construction_year smallint check (construction_year between 1700 and 2200),
  description text not null check (char_length(description) between 80 and 8000),
  features text[] not null default '{}',
  sale_price numeric(12,2) check (sale_price is null or sale_price > 0),
  monthly_rent numeric(12,2) check (monthly_rent is null or monthly_rent > 0),
  currency char(3) not null default 'EUR' check (currency = 'EUR'),
  available_from date,
  availability_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint listings_sale_price_required check ('sale' <> all(listing_types) or sale_price is not null),
  constraint listings_rent_required check ('rent' <> all(listing_types) or monthly_rent is not null),
  constraint listings_publication_date check (status <> 'published' or published_at is not null)
);

create table public.listing_contacts (
  listing_id uuid primary key references public.listings(id) on delete cascade,
  contact_name text not null check (char_length(contact_name) between 2 and 120),
  contact_email text not null check (contact_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  contact_phone text,
  privacy_consent boolean not null check (privacy_consent),
  created_at timestamptz not null default now()
);

create table public.listing_images (
  id bigint generated always as identity primary key,
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text,
  external_url text,
  alt_text text not null default '',
  sort_order smallint not null default 0 check (sort_order between 0 and 99),
  created_at timestamptz not null default now(),
  constraint listing_images_source check (num_nonnulls(storage_path, external_url) = 1),
  constraint listing_images_storage_path_unique unique (storage_path)
);

create index listings_published_at_idx on public.listings (published_at desc) where status = 'published';
create index listings_listing_types_idx on public.listings using gin (listing_types) where status = 'published';
create index listing_images_listing_id_sort_idx on public.listing_images (listing_id, sort_order);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger listings_set_updated_at
before update on public.listings
for each row execute function private.set_updated_at();

alter table public.listings enable row level security;
alter table public.listing_contacts enable row level security;
alter table public.listing_images enable row level security;

revoke all on public.listings from anon, authenticated;
revoke all on public.listing_contacts from anon, authenticated;
revoke all on public.listing_images from anon, authenticated;
grant select on public.listings to anon, authenticated;
grant select on public.listing_images to anon, authenticated;

create policy "Published listings are public"
on public.listings for select
to anon, authenticated
using (status = 'published');

create policy "Published listing images are public"
on public.listing_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.listings
    where listings.id = listing_images.listing_id
      and listings.status = 'published'
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-images', 'listing-images', false, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Published listing image files are public"
on storage.objects for select
to anon, authenticated
using (
  bucket_id = 'listing-images'
  and exists (
    select 1
    from public.listing_images
    join public.listings on listings.id = listing_images.listing_id
    where listing_images.storage_path = storage.objects.name
      and listings.status = 'published'
  )
);

insert into public.listings (
  id, status, listing_types, property_type, title, slug, street_address, district, locality,
  rooms, bedrooms, living_area, total_area, floor, construction_year, description, features,
  sale_price, monthly_rent, available_from, availability_note, published_at
) values (
  '8ac83c98-0249-4b07-a657-0e29cc101001',
  'published',
  array['sale', 'rent'],
  'semi_detached',
  '4 rum och kök i parhus i Mariehamn',
  '4-rum-och-kok-i-parhus-i-mariehamn',
  'Svärtesgränd',
  'Västernäs',
  'Mariehamn',
  4,
  3,
  94.10,
  97.00,
  '2',
  2016,
  'Ett bekvämt boende i ett plan med ljusa sociala ytor, tre separata sovrum, egen uteplats med bastu som är gemensam i bolaget bestående av två lägenheter och ett lugnt läge vid återvändsgränd i Västernäs, Mariehamn. Lägenheten är tillgänglig för dialog och visning nu och uthyres omöblerad från 1 januari 2027 eller enligt överenskommelse. Vissa möbler kan ingå enligt överenskommelse.',
  array['Egen uteplats i västerläge', 'Gemensam bastu', 'Vattenburen golvvärme', 'Fiber', 'Bilplats med eluttag'],
  142500,
  1290,
  '2027-01-01',
  'Tillgänglig för dialog och visning nu. Inflyttning enligt överenskommelse.',
  now()
);

insert into public.listing_contacts (listing_id, contact_name, contact_email, privacy_consent)
values ('8ac83c98-0249-4b07-a657-0e29cc101001', 'Anton Strandvik', 'anton.strandvik@gmail.com', true);

insert into public.listing_images (listing_id, external_url, alt_text, sort_order) values
  ('8ac83c98-0249-4b07-a657-0e29cc101001', '/media/mariehamn/drone-overview-west.jpg', 'Drönarvy rakt ovanifrån över parhusområdet i Västernäs', 0),
  ('8ac83c98-0249-4b07-a657-0e29cc101001', '/media/mariehamn/drone-property-west.jpg', 'Drönarvy över parhuset, uteplatsen och trädgården i västerläge', 1),
  ('8ac83c98-0249-4b07-a657-0e29cc101001', '/media/mariehamn/living-room.jpeg', 'Ljust vardagsrum och matplats i öppen planlösning', 2);
