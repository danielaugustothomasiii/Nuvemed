import { Button, Dropdown, Empty, Grid, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, MoreOutlined, SwapOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import PagedTable from '../common/PagedTable';
import { formatDays, getExpiryInfo } from '../../utils/expiry';

const { Text } = Typography;

export default function ProductsTable({ products, onEdit, onStockOut, onDelete }) {
  const screens = Grid.useBreakpoint();
  const isMobile = screens.md === false;

  const actionMenu = (product) => ({
    items: [
      { key: 'edit', icon: <EditOutlined />, label: 'Editar' },
      { key: 'stockout', icon: <SwapOutlined />, label: 'Dar baixa', disabled: product.quantity === 0 },
      { type: 'divider' },
      { key: 'delete', icon: <DeleteOutlined />, label: 'Excluir', danger: true },
    ],
    onClick: ({ key }) => {
      if (key === 'edit') onEdit(product);
      if (key === 'stockout') onStockOut(product);
      if (key === 'delete') onDelete(product);
    },
  });

  const columns = [
    {
      title: 'Medicamento',
      dataIndex: 'name',
      key: 'name',
      // em telas pequenas a coluna fixa ocuparia quase toda a largura
      fixed: isMobile ? undefined : 'left',
      width: isMobile ? 170 : 210,
      render: (value, record) => (
        <div className="medicine-cell">
          <Text strong>{value}</Text>
          <Text type="secondary">Lote {record.lot}</Text>
        </div>
      ),
    },
    { title: 'Categoria', dataIndex: 'category', key: 'category', width: 170 },
    { title: 'Fabricante', dataIndex: 'manufacturer', key: 'manufacturer', width: 150 },
    {
      title: 'Quantidade',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: (value) => value === 0 ? <Tag color="red">Sem estoque</Tag> : <Text strong>{value}</Text>,
    },
    {
      title: 'Validade',
      dataIndex: 'expiry',
      key: 'expiry',
      width: 170,
      render: (value) => {
        const info = getExpiryInfo(value);
        return (
          <div className="medicine-cell">
            <Text strong>{dayjs(value).format('DD/MM/YYYY')}</Text>
            <Text type={info.days < 0 ? 'danger' : 'secondary'}>{formatDays(info.days)}</Text>
          </div>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      width: 160,
      render: (_, record) => {
        const info = getExpiryInfo(record.expiry);
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: '',
      key: 'actions',
      width: 62,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Dropdown menu={actionMenu(record)} trigger={['click']} placement="bottomRight">
          <Button type="text" icon={<MoreOutlined />} aria-label="Ações" />
        </Dropdown>
      ),
    },
  ];

  return (
    <PagedTable
      rowKey="id"
      className="products-table"
      columns={columns}
      dataSource={products}
      pageSize={8}
      scroll={{ x: 1000 }}
      locale={{ emptyText: <Empty description="Nenhum medicamento encontrado" /> }}
    />
  );
}
