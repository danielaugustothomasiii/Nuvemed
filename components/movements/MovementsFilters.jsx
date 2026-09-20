import { DatePicker, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { movementTypeOptions } from '../../constants/inventory';

const { RangePicker } = DatePicker;

export default function MovementsFilters({ search, onSearchChange, type, onTypeChange, range, onRangeChange }) {
  return (
    <div className="filters-row">
      <Input
        allowClear
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        prefix={<SearchOutlined />}
        placeholder="Buscar medicamento, lote ou motivo"
        className="search-input"
      />
      <div className="filter-selects">
        <Select value={type} onChange={onTypeChange} options={movementTypeOptions} className="filter-select" />
        <RangePicker
          value={range}
          onChange={onRangeChange}
          format="DD/MM/YYYY"
          placeholder={['Início', 'Fim']}
          className="filter-range"
        />
      </div>
    </div>
  );
}
