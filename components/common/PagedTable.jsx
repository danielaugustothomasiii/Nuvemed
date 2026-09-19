import { Grid, Table } from 'antd';

// Tabela paginada que sempre ocupa a altura de uma página cheia (pageSize linhas),
// para que o card não mude de tamanho ao trocar de página, filtrar ou ficar vazio.
// As linhas têm altura fixa via CSS; as linhas faltantes viram um espaçador no rodapé.
export default function PagedTable({ pageSize, columns, dataSource, className = '', style, ...props }) {
  const screens = Grid.useBreakpoint();
  const isMobile = screens.md === false;
  const isEmpty = dataSource.length === 0;

  const renderSpacer = (pageData) => {
    const missing = pageSize - pageData.length;
    if (isEmpty || missing <= 0) return null;
    return (
      <Table.Summary.Row className="paged-table-spacer" style={{ '--missing-rows': missing }} aria-hidden>
        <Table.Summary.Cell index={0} colSpan={columns.length} />
      </Table.Summary.Row>
    );
  };

  return (
    <Table
      {...props}
      columns={columns}
      dataSource={dataSource}
      className={`paged-table ${isEmpty ? 'is-empty' : ''} ${className}`}
      style={{ ...style, '--table-rows': pageSize }}
      size={isMobile ? 'small' : 'middle'}
      pagination={{ pageSize, showSizeChanger: false, simple: isMobile }}
      summary={renderSpacer}
    />
  );
}
