import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { categories, statusOptions } from '../../constants/inventory';

const categoryOptions = [
  { value: 'all', label: 'Todas as categorias' },
  ...categories.map((item) => ({ value: item, label: item })),
];

export default function ProductFilters({ search, onSearchChange, status, onStatusChange, category, onCategoryChange }) {
  return (
    <div className="filters-row">
      <Input
        allowClear
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        prefix={<SearchOutlined />}
        placeholder="Buscar medicamento, lote ou fabricante"
        className="search-input"
      />
      <div className="filter-selects">
        <Select value={status} onChange={onStatusChange} options={statusOptions} className="filter-select" />
        <Select value={category} onChange={onCategoryChange} options={categoryOptions} className="filter-select" />
      </div>
    </div>
  );
}
