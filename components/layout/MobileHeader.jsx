import { useState } from 'react';
import { Button, Drawer } from 'antd';
import { CloseOutlined, MenuOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { colors } from '../../theme';
import SidebarNav from './SidebarNav';

export default function MobileHeader({ page, onNavigate }) {
  const [open, setOpen] = useState(false);

  const navigate = (key) => {
    onNavigate(key);
    setOpen(false);
  };

  return (
    <>
      <header className="mobile-header">
        <div className="mobile-brand">
          <MedicineBoxOutlined />
          <span>Nuvemed</span>
        </div>
        <Button
          type="text"
          className="mobile-menu-button"
          icon={<MenuOutlined />}
          aria-label="Abrir menu"
          onClick={() => setOpen(true)}
        />
      </header>

      <Drawer
        placement="left"
        size="default" 
        open={open}
        onClose={() => setOpen(false)}
        closable={false}
        rootClassName="mobile-nav-drawer"
        styles={{ content: { background: colors.primaryDark }, body: { padding: 0 } }}
      >
        <Button
          type="text"
          className="mobile-nav-close"
          icon={<CloseOutlined />}
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        />
        <SidebarNav page={page} onNavigate={navigate} />
      </Drawer>
    </>
  );
}
