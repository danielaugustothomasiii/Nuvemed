'use client';

import { Menu, Button, Switch } from 'antd';
import { AppstoreOutlined, MedicineBoxOutlined, SwapOutlined, LogoutOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Brand />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[page]}
        onClick={({ key }) => onNavigate(key)}
        items={navItems}
      />

      <div style={{ marginTop: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            {resolvedTheme === 'dark' ? <MoonOutlined /> : <SunOutlined />} Modo escuro
          </span>
          <Switch
            checked={resolvedTheme === 'dark'}
            onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </div>

        <Button
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          block
          style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.24)' }}
        >
          Sair
        </Button>
      </div>
    </div>
  );
}