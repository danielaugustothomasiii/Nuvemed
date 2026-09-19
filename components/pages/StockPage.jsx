import { useMemo, useState } from 'react';
import { App, Button, Card, Grid, InputNumber, Typography } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { toast } from 'react-hot-toast';
import PageHeader from '../layout/PageHeader';
import ExpiryChart from '../stock/ExpiryChart';
import FilterBadge from '../stock/FilterBadge';
import ProductDrawer from '../stock/ProductDrawer';
import ProductFilters from '../stock/ProductFilters';
import ProductsTable from '../stock/ProductsTable';
import SummaryCards from '../stock/SummaryCards';
import { cardFilterLabels, statusOptions } from '../../constants/inventory';
import { filterProducts } from '../../utils/filterProducts';

const { Title, Text } = Typography;

export default function StockPage({ inventory }) {
  const { products, createProduct, updateProduct, stockOut, removeProduct } = inventory;
  const { modal } = App.useApp();
  const screens = Grid.useBreakpoint();
  const compactButton = screens.sm === false;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [cardFilter, setCardFilter] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProducts = useMemo(
    () => filterProducts(products, { search, statusFilter, categoryFilter, cardFilter }),
    [products, search, statusFilter, categoryFilter, cardFilter],
  );

  const currentFilterLabel = useMemo(() => {
    if (cardFilter) return cardFilterLabels[cardFilter];
    if (statusFilter !== 'all') return statusOptions.find((option) => option.value === statusFilter).label;
    return 'Todos os medicamentos';
  }, [cardFilter, statusFilter]);

  const toggleCardFilter = (filter) => {
    setCardFilter((current) => current === filter ? null : filter);
    setStatusFilter('all');
  };

  const changeStatusFilter = (value) => {
    setStatusFilter(value);
    setCardFilter(null);
  };

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setDrawerOpen(true);
  };

  const submitProduct = (payload) => {
    if (editing) {
      updateProduct(editing.id, payload);
      toast.success('Medicamento atualizado com sucesso.');
    } else {
      createProduct(payload);
      toast.success('Medicamento cadastrado com sucesso.');
    }
    setDrawerOpen(false);
  };

  const openStockOut = (product) => {
    let amount = 1;
    modal.confirm({
      title: `Dar baixa em ${product.name}`,
      icon: <SwapOutlined />,
      content: (
        <div className="stockout-modal-content">
          <Text type="secondary">Estoque atual: {product.quantity}</Text>
          <InputNumber
            min={1}
            max={Math.max(product.quantity, 1)}
            defaultValue={1}
            style={{ width: '100%' }}
            onChange={(value) => { amount = Number(value || 1); }}
            disabled={product.quantity === 0}
          />
        </div>
      ),
      okText: 'Confirmar baixa',
      cancelText: 'Cancelar',
      okButtonProps: { disabled: product.quantity === 0 },
      onOk: () => {
        if (product.quantity === 0) return undefined;
        if (amount < 1 || amount > product.quantity) {
          toast.error('Quantidade de baixa inválida.');
          return Promise.reject();
        }
        stockOut(product, amount);
        toast.success(`Baixa de ${amount} unidade${amount === 1 ? '' : 's'} registrada.`);
        return undefined;
      },
    });
  };

  const confirmDelete = (product) => {
    modal.confirm({
      title: 'Excluir medicamento?',
      icon: <ExclamationCircleOutlined />,
      content: `${product.name}, lote ${product.lot}, será removido do estoque.`,
      okText: 'Excluir',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => {
        removeProduct(product.id);
        toast.success('Medicamento excluído.');
      },
    });
  };

  return (
    <>
      <PageHeader
        title="Estoque de medicamentos"
        description="Acompanhe lotes, quantidades e vencimentos em um só lugar."
        extra={(
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={openCreate}
            aria-label="Cadastrar medicamento"
            title={compactButton ? 'Cadastrar medicamento' : undefined}
          >
            {compactButton ? null : 'Cadastrar medicamento'}
          </Button>
        )}
      />

      <section className="overview-grid">
        <ExpiryChart products={products} />
        <SummaryCards products={products} activeFilter={cardFilter} onToggle={toggleCardFilter} />
      </section>

      <Card className="table-card">
        <div className="table-card-header">
          <Title level={4}>Medicamentos</Title>
          <FilterBadge label={currentFilterLabel} />
        </div>
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={changeStatusFilter}
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />
        <ProductsTable
          products={filteredProducts}
          onEdit={openEdit}
          onStockOut={openStockOut}
          onDelete={confirmDelete}
        />
      </Card>

      <ProductDrawer
        open={drawerOpen}
        product={editing}
        onClose={() => setDrawerOpen(false)}
        onSubmit={submitProduct}
      />
    </>
  );
}