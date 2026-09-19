import { Card, Typography } from 'antd';
import PageHeader from '../layout/PageHeader';
import MovementsTable from '../movements/MovementsTable';

const { Title, Text } = Typography;

export default function MovementsPage({ movements }) {
  const plural = movements.length !== 1;

  return (
    <>
      <PageHeader
        title="Movimentações"
        description="Histórico simples de entradas e saídas registradas no estoque."
      />
      <Card className="table-card movements-card">
        <div className="table-card-header table-card-header-stacked">
          <Title level={4}>Histórico</Title>
        </div>
        <MovementsTable movements={movements} />
      </Card>
    </>
  );
}