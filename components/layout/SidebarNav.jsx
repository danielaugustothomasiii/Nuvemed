import { Menu } from 'antd';
import { AppstoreOutlined, MedicineBoxOutlined, SwapOutlined } from '@ant-design/icons';

export const navItems = [
  { key: 'estoque', icon: <AppstoreOutlined />, label: 'Estoque' },
  { key: 'movimentacoes', icon: <SwapOutlined />, label: 'Movimentações' },
];

export function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark"><MedicineBoxOutlined /></div>
      <div>
        <div className="brand-name">Nuvemed</div>
        <div className="brand-caption">Controle de validade</div>
      </div>
    </div>
  );
}

export default function SidebarNav({ page, onNavigate }) {
  return (
    <>
      <Brand />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[page]}
        onClick={({ key }) => onNavigate(key)}
        items={navItems}
      />
    </>
  );
}
