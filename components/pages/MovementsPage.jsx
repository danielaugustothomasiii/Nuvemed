import { useMemo, useState } from 'react';
import { Card, Typography } from 'antd';
import PageHeader from '../layout/PageHeader';
import MovementsFilters from '../movements/MovementsFilters';
import MovementsTable from '../movements/MovementsTable';
import { filterMovements, summarizeMovements } from '../../utils/filterMovements';

const { Title, Text } = Typography;

export default function MovementsPage({ movements }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [range, setRange] = useState(null);

  const filtered = useMemo(
    () => filterMovements(movements, { search, typeFilter, range }),
    [movements, search, typeFilter, range],
  );

  const totals = useMemo(() => summarizeMovements(filtered), [filtered]);
  const plural = filtered.length !== 1;

  return (
    <>
      <PageHeader
        title="Movimentações"
        description="Histórico de entradas, saídas e ajustes registrados no estoque."
      />
      <Card className="table-card movements-card">
        <div className="table-card-header table-card-header-stacked">
          <Title level={4}>Histórico</Title>
          <Text type="secondary">
            {filtered.length} registro{plural ? 's' : ''} · {totals.entradas} unidade
            {totals.entradas === 1 ? '' : 's'} de entrada · {totals.saidas} de saída
            {totals.ajustes > 0 && ` · ${totals.ajustes} ajuste${totals.ajustes === 1 ? '' : 's'}`}
          </Text>
        </div>
        <MovementsFilters
          search={search}
          onSearchChange={setSearch}
          type={typeFilter}
          onTypeChange={setTypeFilter}
          range={range}
          onRangeChange={setRange}
        />
        <MovementsTable movements={filtered} />
      </Card>
    </>
  );
}
