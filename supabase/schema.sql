-- ============================================================
-- Nuvemed — schema do banco (Supabase / PostgreSQL)
-- ============================================================

create table categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null
);

create table insumos (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid references categorias(id),
  nome text not null,
  unidade_medida text,
  estoque_minimo int default 0
);

create table lotes (
  id uuid primary key default gen_random_uuid(),
  insumo_id uuid references insumos(id),
  numero_lote text,
  fabricante text,
  data_validade date,
  quantidade int not null default 0 check (quantidade >= 0)
);

create table movimentacoes (
  id uuid primary key default gen_random_uuid(),
  lote_id uuid references lotes(id) on delete cascade,
  usuario_id uuid references auth.users(id),
  tipo text check (tipo in ('entrada', 'saida', 'ajuste')),
  quantidade int not null check (quantidade > 0),
  motivo text,
  data_hora timestamp default now()
);

create index on movimentacoes (data_hora desc);
create index on lotes (data_validade);

-- Libera leitura e escrita para qualquer usuário autenticado
create policy "Usuários autenticados podem tudo em categorias"
on categorias for all
to authenticated
using (true)
with check (true);

create policy "Usuários autenticados podem tudo em insumos"
on insumos for all
to authenticated
using (true)
with check (true);

create policy "Usuários autenticados podem tudo em lotes"
on lotes for all
to authenticated
using (true)
with check (true);

create policy "Usuários autenticados podem tudo em movimentacoes"
on movimentacoes for all
to authenticated
using (true)
with check (true);

-- ============================================================
-- MIGRAÇÃO — rode apenas se o banco já existe com o schema antigo
-- ============================================================
-- alter table lotes add column if not exists fabricante text;
-- alter table movimentacoes add column if not exists motivo text;
-- alter table movimentacoes drop constraint if exists movimentacoes_tipo_check;
-- alter table movimentacoes add constraint movimentacoes_tipo_check
--   check (tipo in ('entrada', 'saida', 'ajuste'));
-- alter table movimentacoes drop constraint if exists movimentacoes_lote_id_fkey;
-- alter table movimentacoes add constraint movimentacoes_lote_id_fkey
--   foreign key (lote_id) references lotes(id) on delete cascade;
