import dayjs from 'dayjs';

export function filterMovements(movements, { search = '', typeFilter = 'all', range = null } = {}) {
  const term = search.trim().toLowerCase();

  return movements.filter((movement) => {
    if (typeFilter !== 'all' && movement.type !== typeFilter) return false;

    if (term) {
      const haystack = `${movement.productName ?? ''} ${movement.lot ?? ''} ${movement.reason ?? ''}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }

    if (range && range[0] && range[1]) {
      const date = dayjs(movement.date);
      const start = range[0].startOf('day');
      const end = range[1].endOf('day');
      if (date.isBefore(start) || date.isAfter(end)) return false;
    }

    return true;
  });
}

export function summarizeMovements(movements) {
  return movements.reduce(
    (totals, movement) => {
      if (movement.type === 'entrada') totals.entradas += movement.quantity;
      else if (movement.type === 'saida') totals.saidas += movement.quantity;
      else if (movement.type === 'ajuste') totals.ajustes += 1;
      return totals;
    },
    { entradas: 0, saidas: 0, ajustes: 0 },
  );
}