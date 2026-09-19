import dayjs from 'dayjs';

export function seedProducts() {
  const d = (days) => dayjs().add(days, 'day').format('YYYY-MM-DD');
  return [
    { id: crypto.randomUUID(), name: 'Dipirona 500mg', lot: 'DP231A', quantity: 42, expiry: d(8), manufacturer: 'Medley', category: 'Analgésico' },
    { id: crypto.randomUUID(), name: 'Dipirona 500mg', lot: 'DP231B', quantity: 70, expiry: d(76), manufacturer: 'Medley', category: 'Analgésico' },
    { id: crypto.randomUUID(), name: 'Amoxicilina 500mg', lot: 'AM991', quantity: 18, expiry: d(-4), manufacturer: 'EMS', category: 'Antibiótico' },
    { id: crypto.randomUUID(), name: 'Ibuprofeno 400mg', lot: 'IB455', quantity: 33, expiry: d(24), manufacturer: 'Neo Química', category: 'Anti-inflamatório' },
    { id: crypto.randomUUID(), name: 'Loratadina 10mg', lot: 'LO120', quantity: 0, expiry: d(110), manufacturer: 'Cimed', category: 'Antialérgico' },
    { id: crypto.randomUUID(), name: 'Paracetamol 750mg', lot: 'PA720', quantity: 56, expiry: d(145), manufacturer: 'Prati', category: 'Antitérmico' },
    { id: crypto.randomUUID(), name: 'Azitromicina 500mg', lot: 'AZ045', quantity: 12, expiry: d(13), manufacturer: 'Eurofarma', category: 'Antibiótico' },
    { id: crypto.randomUUID(), name: 'Vitamina C 500mg', lot: 'VC882', quantity: 0, expiry: d(260), manufacturer: 'Catarinense', category: 'Vitamina' },
    { id: crypto.randomUUID(), name: 'Nimesulida 100mg', lot: 'NI208', quantity: 21, expiry: d(34), manufacturer: 'Geolab', category: 'Anti-inflamatório' },
    { id: crypto.randomUUID(), name: 'Dipirona Gotas', lot: 'DG010', quantity: 15, expiry: d(-18), manufacturer: 'Medley', category: 'Analgésico' },
    { id: crypto.randomUUID(), name: 'Cetirizina 10mg', lot: 'CE014', quantity: 24, expiry: d(95), manufacturer: 'EMS', category: 'Antialérgico' },
    { id: crypto.randomUUID(), name: 'Paracetamol Gotas', lot: 'PG881', quantity: 31, expiry: d(4), manufacturer: 'Cimed', category: 'Antitérmico' },
  ];
}
