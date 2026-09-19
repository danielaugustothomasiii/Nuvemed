import dayjs from 'dayjs';
import { getExpiryInfo } from './expiry';

export function filterProducts(products, { search, statusFilter, categoryFilter, cardFilter }) {
  const normalizedSearch = search.trim().toLowerCase();

  return products
    .filter((product) => {
      const info = getExpiryInfo(product.expiry);
      const matchesSearch = !normalizedSearch || [product.name, product.lot, product.manufacturer]
        .some((value) => value.toLowerCase().includes(normalizedSearch));
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || info.key === statusFilter;
      const matchesCard = !cardFilter
        || (cardFilter === 'out' ? product.quantity === 0 : info.key === cardFilter);
      return matchesSearch && matchesCategory && matchesStatus && matchesCard;
    })
    .sort((a, b) => dayjs(a.expiry).valueOf() - dayjs(b.expiry).valueOf());
}
