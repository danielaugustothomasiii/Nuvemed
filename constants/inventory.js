export const PRODUCT_KEY = 'nuvemed.products.v1';
export const MOVEMENT_KEY = 'nuvemed.movements.v1';

export const categories = [
  'Analgésico',
  'Antibiótico',
  'Anti-inflamatório',
  'Antialérgico',
  'Antitérmico',
  'Vitamina',
  'Outros',
];

export const statusOptions = [
  { value: 'all', label: 'Todos os status' },
  { value: 'expired', label: 'Vencidos' },
  { value: 'soon15', label: 'Até 15 dias' },
  { value: 'soon30', label: '16 a 30 dias' },
  { value: 'safe', label: 'Dentro do prazo' },
];

export const cardFilterLabels = {
  soon15: 'Vencem em até 15 dias',
  expired: 'Vencidos',
  safe: 'Dentro do prazo',
  out: 'Sem estoque',
};

// ---------- Movimentações (tópico 1.4) ----------

export const movementTypeLabels = {
  entrada: 'Entrada',
  saida: 'Saída',
  ajuste: 'Ajuste',
};

export const movementTypeColors = {
  entrada: 'green',
  saida: 'blue',
  ajuste: 'gold',
};

export const movementTypeOptions = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'entrada', label: 'Entrada' },
  { value: 'saida', label: 'Saída' },
  { value: 'ajuste', label: 'Ajuste' },
];

// Motivos sugeridos em cada tipo de movimentação.
// O campo aceita texto livre, então a lista serve apenas como atalho.
export const movementReasons = {
  entrada: [
    'Compra',
    'Doação',
    'Transferência recebida',
    'Devolução de setor',
    'Outros',
  ],
  saida: [
    'Dispensação ao paciente',
    'Transferência enviada',
    'Perda ou avaria',
    'Descarte por vencimento',
    'Outros',
  ],
};

export const CREATION_REASON = 'Cadastro inicial do lote';
