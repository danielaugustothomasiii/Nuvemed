import { Empty, Tag } from 'antd';
import dayjs from 'dayjs';
import PagedTable from '../common/PagedTable';

const columns = [
  {
    title: 'Data', dataIndex: 'date', key: 'date', width: 150,
    render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm'),
  },
  { title: 'Medicamento', dataIndex: 'productName', key: 'productName', width: 190 },
  { title: 'Lote', dataIndex: 'lot', key: 'lot', width: 110 },
  {
    title: 'Tipo', dataIndex: 'type', key: 'type', width: 100,
    render: (value) => <Tag color={value === 'Entrada' ? 'green' : 'blue'}>{value}</Tag>,
  },
  { title: 'Quantidade', dataIndex: 'quantity', key: 'quantity', width: 110 },
  { title: 'Motivo', dataIndex: 'reason', key: 'reason', width: 170 },
];

export default function MovementsTable({ movements }) {
  return (
    <PagedTable
      rowKey="id"
      className="movements-table"
      columns={columns}
      dataSource={movements}
      pageSize={10}
      scroll={{ x: 830 }}
      locale={{ emptyText: <Empty description="Nenhuma movimentação registrada ainda" /> }}
    />
  );
}
