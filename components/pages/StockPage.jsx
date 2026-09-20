import { useMemo, useState } from 'react';
import { App, Button, Card, Grid, Typography } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-hot-toast';
import PageHeader from '../layout/PageHeader';
import ExpiryChart from '../stock/ExpiryChart';
import FilterBadge from '../stock/FilterBadge';
import MovementModal from '../stock/MovementModal';
import ProductDrawer from '../stock/ProductDrawer';
import ProductFilters from '../stock/ProductFilters';
import ProductsTable from '../stock/ProductsTable';
import SummaryCards from '../stock/SummaryCards';
import { cardFilterLabels, statusOptions } from '../../constants/inventory';
import { filterProducts } from '../../utils/filterProducts';

const { Title } = Typography;

function mensagemDeErro(error, fallback) {
  return error?.message || fallback;
}

export default function StockPage({ inventory }) {
  const { products, createProduct, updateProduct, stockIn, stockOut, removeProduct } = inventory;
  const { modal } = App.useApp();
  const screens = Grid.useBreakpoint();
  const compactButton = screens.sm === false;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [movement, setMovement] = useState({ open: false, type: 'saida', product: null });
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

  // ---------- Cadastro e edição ----------

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setDrawerOpen(true);
  };

  const submitProduct = async (payload) => {
    setSaving(true);
    try {
      if (editing) {
        await updateProduct(editing.id, payload);
        toast.success('Medicamento atualizado com sucesso.');
      } else {
        await createProduct(payload);
        toast.success('Medicamento cadastrado com sucesso.');
      }
      setDrawerOpen(false);
    } catch (error) {
      toast.error(mensagemDeErro(error, 'Não foi possível salvar o medicamento.'));
    } finally {
      setSaving(false);
    }
  };

  // ---------- Movimentações ----------

  const openMovement = (type) => (product) => setMovement({ open: true, type, product });
  const closeMovement = () => setMovement((current) => ({ ...current, open: false }));

  const submitMovement = async (product, amount, reason) => {
    const isEntrada = movement.type === 'entrada';
    try {
      await (isEntrada ? stockIn : stockOut)(product, amount, reason);
      const unidade = `${amount} unidade${amount === 1 ? '' : 's'}`;
      toast.success(isEntrada
        ? `Entrada de ${unidade} registrada.`
        : `Baixa de ${unidade} registrada.`);
    } catch (error) {
      toast.error(mensagemDeErro(error, 'Não foi possível registrar a movimentação.'));
      throw error; // mantém o modal aberto para o usuário corrigir
    }
  };

  const confirmDelete = (product) => {
    modal.confirm({
      title: 'Excluir medicamento?',
      icon: <ExclamationCircleOutlined />,
      content: `${product.name}, lote ${product.lot}, será removido do estoque junto com o histórico de movimentações.`,
      okText: 'Excluir',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await removeProduct(product.id);
          toast.success('Medicamento excluído.');
        } catch (error) {
          toast.error(mensagemDeErro(error, 'Não foi possível excluir o medicamento.'));
          throw error;
        }
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
          onStockIn={openMovement('entrada')}
          onStockOut={openMovement('saida')}
          onDelete={confirmDelete}
        />
      </Card>

      <ProductDrawer
        open={drawerOpen}
        product={editing}
        saving={saving}
        onClose={() => setDrawerOpen(false)}
        onSubmit={submitProduct}
      />

      <MovementModal
        open={movement.open}
        type={movement.type}
        product={movement.product}
        onClose={closeMovement}
        onSubmit={submitMovement}
      />
    </>
  );
}
