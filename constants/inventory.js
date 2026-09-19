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
  { value: 'safe', label: 'Validade tranquila' },
];

export const cardFilterLabels = {
  soon15: 'Vencem em até 15 dias',
  expired: 'Vencidos',
  safe: 'Validade tranquila',
  out: 'Sem estoque',
};
