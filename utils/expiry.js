import dayjs from 'dayjs';

export function getExpiryInfo(expiry) {
  const today = dayjs().startOf('day');
  const date = dayjs(expiry).startOf('day');
  const days = date.diff(today, 'day');

  if (days < 0) return { key: 'expired', label: 'Vencido', color: 'red', days };
  if (days <= 15) return { key: 'soon15', label: 'Até 15 dias', color: 'orange', days };
  if (days <= 30) return { key: 'soon30', label: '16 a 30 dias', color: 'gold', days };
  return { key: 'safe', label: 'Validade tranquila', color: 'green', days };
}

export function formatDays(days) {
  if (days < 0) return `Venceu há ${Math.abs(days)} dia${Math.abs(days) === 1 ? '' : 's'}`;
  if (days === 0) return 'Vence hoje';
  return `${days} dia${days === 1 ? '' : 's'} restante${days === 1 ? '' : 's'}`;
}
