import { Empty, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import PagedTable from '../common/PagedTable';
import { movementTypeColors, movementTypeLabels } from '../../constants/inventory';

const { Text } = Typography;

const columns = [
  {
    title: 'Data', dataIndex: 'date', key: 'date', width: 150,
    render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm'),
  },
  { title: 'Medicamento', dataIndex: 'productName', key: 'productName', width: 190 },
  { title: 'Lote', dataIndex: 'lot', key: 'lot', width: 110 },
  {
    title: 'Tipo', dataIndex: 'type', key: 'type', width: 100,
    render: (value) => <Tag color={movementTypeColors[value]}>{movementTypeLabels[value] ?? value}</Tag>,
  },
  {
    title: 'Quantidade', dataIndex: 'quantity', key: 'quantity', width: 110,
    render: (value, record) => {
      if (record.type === 'ajuste') return <Text>{value}</Text>;
      const isEntrada = record.type === 'entrada';
      return <Text type={isEntrada ? 'success' : 'danger'}>{isEntrada ? '+' : '−'}{value}</Text>;
    },
  },
  {
    title: 'Motivo', dataIndex: 'reason', key: 'reason', width: 220,
    render: (value) => value || <Text type="secondary">—</Text>,
  },
];

export default function MovementsTable({ movements }) {
  return (
    <PagedTable
      rowKey="id"
      className="movements-table"
      columns={columns}
      dataSource={movements}
      pageSize={10}
      scroll={{ x: 880 }}
      locale={{ emptyText: <Empty description="Nenhuma movimentação encontrada" /> }}
    />
  );
}
