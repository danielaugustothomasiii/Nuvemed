# Nuvemed

Sistema de controle de estoque em nuvem para insumos de saúde (medicamentos, materiais de curativo, EPIs e demais itens de uso corrente), desenvolvido para uma Unidade Básica de Saúde (UBS) da rede municipal de saúde de Bauru e região.

Projeto acadêmico do módulo **Bootcamp Computação em Nuvem**, do curso de Ciências da Computação / Gestão da Tecnologia da Informação — UNISAGRADO.

## Sobre o projeto

Mesmo com sistemas oficiais obrigatórios para o controle de medicamentos no SUS (como SNGPC, e-SUS e HORUS), unidades de saúde ainda enfrentam fragilidades na gestão de materiais não farmacológicos — divergências entre estoque físico e sistema, falta de padronização de conferência e risco de vencimento de itens, como já apontado em fiscalizações do TCE-SP em municípios da região.

O Nuvemed propõe uma solução complementar em nuvem para esse controle, com cadastro de insumos, registro de entrada/saída, alertas automáticos de estoque baixo e de validade próxima, e um painel com indicadores de consumo.

## Tecnologias

- **Next.js** (App Router) — frontend
- **Supabase** — banco de dados PostgreSQL gerenciado, autenticação, storage e Edge Functions
- **Tailwind CSS** — estilização
- **TypeScript**

## Estrutura do banco de dados

O schema do banco (tabelas `categorias`, `insumos`, `lotes` e `movimentacoes`, com Row Level Security habilitado) está documentado em [`supabase/schema.sql`](./supabase/schema.sql).

Se o banco já tiver sido criado com a versão anterior do schema, rode o bloco **MIGRAÇÃO** comentado no final do arquivo: ele adiciona `lotes.fabricante`, `movimentacoes.motivo` e o tipo `ajuste`.

## Como rodar localmente

1. Clone o repositório e instale as dependências:
```bash
   npm install
```
2. Crie um projeto no [Supabase](https://supabase.com) e copie a Project URL e a chave anon/publishable em *Project Settings > API Keys*.
3. Renomeie `.env.local.example` para `.env.local` e preencha:
4. Rode as tabelas do banco: cole o conteúdo de `supabase/schema.sql` no SQL Editor do Supabase e execute.
5. Inicie o projeto:
```bash
   npm run dev
```
6. Acesse [http://localhost:3000](http://localhost:3000).

## Equipe

- Daniel Augusto Thomasi
- Lara Fernanda Cruz de Lima
- Matheus Kauan Rodrigues de Souza
- Victor Santiago Carnavali
- Giovanna Grigolato
- Rafael Gomes Zanini
- Guilherme Domingos Molero Nunes
- Leticia Isabela de Oliveira
- Maria Clara Fernanda dos Santos
- Pedro Henrique Lauris Marfil Moreira de Oliveira

**Professor responsável:** Victor Hugo Braguim Canto
