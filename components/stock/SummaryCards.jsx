import { useMemo } from 'react';
import {
  CalendarOutlined,
  ExclamationCircleOutlined,
  MedicineBoxOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { getExpiryInfo } from '../../utils/expiry';
import SummaryCard from './SummaryCard';

const cards = [
  { key: 'soon15', title: 'Vencem em 15 dias', subtitle: 'Lotes que precisam de atenção', icon: <WarningOutlined />, tone: 'orange' },
  { key: 'expired', title: 'Vencidos', subtitle: 'Lotes com validade encerrada', icon: <ExclamationCircleOutlined />, tone: 'red' },
  { key: 'safe', title: 'Longe de expirar', subtitle: 'Validade acima de 30 dias', icon: <CalendarOutlined />, tone: 'green' },
  { key: 'out', title: 'Sem estoque', subtitle: 'Lotes com quantidade zerada', icon: <MedicineBoxOutlined />, tone: 'gray' },
];

export default function SummaryCards({ products, activeFilter, onToggle }) {
  const counts = useMemo(() => {
    const result = { soon15: 0, expired: 0, safe: 0, out: 0 };
    products.forEach((product) => {
      const { key } = getExpiryInfo(product.expiry);
      if (key in result) result[key] += 1;
      if (product.quantity === 0) result.out += 1;
    });
    return result;
  }, [products]);

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <SummaryCard
          key={card.key}
          {...card}
          value={counts[card.key]}
          active={activeFilter === card.key}
          onClick={() => onToggle(card.key)}
        />
      ))}
    </div>
  );
}
