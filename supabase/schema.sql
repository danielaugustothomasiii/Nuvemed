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
  data_validade date,
  quantidade int not null default 0
);

create table movimentacoes (
  id uuid primary key default gen_random_uuid(),
  lote_id uuid references lotes(id),
  usuario_id uuid references auth.users(id),
  tipo text check (tipo in ('entrada', 'saida')),
  quantidade int not null,
  data_hora timestamp default now()
);
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