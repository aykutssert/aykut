# Product Workflow

- kullanıcı ürün görseli yükleyecek, isim/tag/text bilgilerini girecek, sonra template veya custom sahne seçip sonuç üretecek. İlk yapı generic olmayacak; başlangıç kategorileri **Home & Decor** ve **Beauty & Wellness** olacak. Template görselleri sahne/kompozisyon referansı olarak kullanılacak, kullanıcının yüklediği ürün ise ana ürün referansı olacak.


MVP için:

```sql
products
- id
- user_id
- category
- name
- image_url
- product_prompt
- created_at
```

```sql
product_templates
- id
- category
- name
- image_url
- sort_order
- is_active
- created_at
```

```sql
product_results
- id
- user_id
- product_id
- template_id
- image_size
- final_prompt
- negative_prompt
- image_url
- status
- created_at
```

MVP mantığı:
- kullanıcı ürün ekler
- template seçer
- generate eder
- tek tabloya result kaydı düşer
- sonuç gelince `image_url/status` update edilir



SUPABASE:

-- Product workflow tables

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('home_decor', 'beauty_wellness')),
  name text not null,
  image_url text not null,
  product_prompt text,
  created_at timestamptz not null default now()
);

create table if not exists public.product_templates (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('home_decor', 'beauty_wellness')),
  name text not null,
  image_url text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.product_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  template_id uuid references public.product_templates(id) on delete set null,
  image_size text not null check (image_size in ('1:1', '4:5', '9:16', '16:9')),
  final_prompt text not null,
  negative_prompt text not null,
  image_url text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz not null default now()
);

-- Indexes

create index if not exists products_user_created_idx
on public.products (user_id, created_at desc);

create index if not exists products_category_idx
on public.products (category);

create index if not exists product_templates_active_category_idx
on public.product_templates (category, is_active, sort_order);

create index if not exists product_results_user_created_idx
on public.product_results (user_id, created_at desc);

create index if not exists product_results_product_created_idx
on public.product_results (product_id, created_at desc);

-- RLS

alter table public.products enable row level security;
alter table public.product_templates enable row level security;
alter table public.product_results enable row level security;

-- Products policies

drop policy if exists "products owner select" on public.products;
create policy "products owner select"
on public.products
for select
using (auth.uid() = user_id or is_admin());

drop policy if exists "products owner insert" on public.products;
create policy "products owner insert"
on public.products
for insert
with check (auth.uid() = user_id);

drop policy if exists "products owner update" on public.products;
create policy "products owner update"
on public.products
for update
using (auth.uid() = user_id or is_admin())
with check (auth.uid() = user_id or is_admin());

drop policy if exists "products owner delete" on public.products;
create policy "products owner delete"
on public.products
for delete
using (auth.uid() = user_id or is_admin());

-- Product templates policies

drop policy if exists "product templates public read active" on public.product_templates;
create policy "product templates public read active"
on public.product_templates
for select
using (is_active = true or is_admin());

drop policy if exists "product templates admin manage" on public.product_templates;
create policy "product templates admin manage"
on public.product_templates
for all
using (is_admin())
with check (is_admin());

-- Product results policies

drop policy if exists "product results owner select" on public.product_results;
create policy "product results owner select"
on public.product_results
for select
using (auth.uid() = user_id or is_admin());

drop policy if exists "product results owner insert" on public.product_results;
create policy "product results owner insert"
on public.product_results
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.products p
    where p.id = product_id
      and p.user_id = auth.uid()
  )
);

drop policy if exists "product results owner update" on public.product_results;
create policy "product results owner update"
on public.product_results
for update
using (auth.uid() = user_id or is_admin())
with check (auth.uid() = user_id or is_admin());

drop policy if exists "product results owner delete" on public.product_results;
create policy "product results owner delete"
on public.product_results
for delete
using (auth.uid() = user_id or is_admin());


SUPABASE BUCKET:

```sql
-- Storage buckets

insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('product-results', 'product-results', true),
  ('product-template-images', 'product-template-images', true)
on conflict (id) do nothing;


-- Clean old policies if rerun

drop policy if exists "product images owner read" on storage.objects;
drop policy if exists "product images owner insert" on storage.objects;
drop policy if exists "product images owner update" on storage.objects;
drop policy if exists "product images owner delete" on storage.objects;

drop policy if exists "product results owner read" on storage.objects;
drop policy if exists "product results owner insert" on storage.objects;
drop policy if exists "product results owner update" on storage.objects;
drop policy if exists "product results owner delete" on storage.objects;

drop policy if exists "product template images public read" on storage.objects;
drop policy if exists "product template images admin insert" on storage.objects;
drop policy if exists "product template images admin update" on storage.objects;
drop policy if exists "product template images admin delete" on storage.objects;


-- product-images
-- Path format: {user_id}/{file_name}

create policy "product images owner read"
on storage.objects
for select
using (
  bucket_id = 'product-images'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_admin()
  )
);

create policy "product images owner insert"
on storage.objects
for insert
with check (
  bucket_id = 'product-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "product images owner update"
on storage.objects
for update
using (
  bucket_id = 'product-images'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_admin()
  )
)
with check (
  bucket_id = 'product-images'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_admin()
  )
);

create policy "product images owner delete"
on storage.objects
for delete
using (
  bucket_id = 'product-images'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_admin()
  )
);


-- product-results
-- Path format: {user_id}/{file_name}

create policy "product results owner read"
on storage.objects
for select
using (
  bucket_id = 'product-results'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_admin()
  )
);

create policy "product results owner insert"
on storage.objects
for insert
with check (
  bucket_id = 'product-results'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "product results owner update"
on storage.objects
for update
using (
  bucket_id = 'product-results'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_admin()
  )
)
with check (
  bucket_id = 'product-results'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_admin()
  )
);

create policy "product results owner delete"
on storage.objects
for delete
using (
  bucket_id = 'product-results'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_admin()
  )
);


-- product-template-images
-- Public read, admin write

create policy "product template images public read"
on storage.objects
for select
using (
  bucket_id = 'product-template-images'
);

create policy "product template images admin insert"
on storage.objects
for insert
with check (
  bucket_id = 'product-template-images'
  and public.is_admin()
);

create policy "product template images admin update"
on storage.objects
for update
using (
  bucket_id = 'product-template-images'
  and public.is_admin()
)
with check (
  bucket_id = 'product-template-images'
  and public.is_admin()
);

create policy "product template images admin delete"
on storage.objects
for delete
using (
  bucket_id = 'product-template-images'
  and public.is_admin()
);
```

Path kuralı önemli:

```text
product-images/{user_id}/file.png
product-results/{user_id}/file.png
product-template-images/template-name.png
```