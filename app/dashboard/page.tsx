'use client';

import { useState } from 'react';
import { Grid, Layout } from 'antd';
import { Toaster } from 'react-hot-toast';
import MobileHeader from '@/components/layout/MobileHeader';
import SidebarNav from '@/components/layout/SidebarNav';
import { useInventory } from '@/hooks/useInventory';
import StockPage from '@/components/pages/StockPage';
import MovementsPage from '@/components/pages/MovementsPage';
import { colors } from '@/theme';

const { Sider, Content } = Layout;

export default function DashboardPage() {
  const inventory = useInventory();
  const [page, setPage] = useState('estoque');
  const screens = Grid.useBreakpoint();

  return (
    <Layout className="app-shell">
      <Sider width={232} className="sidebar">
        <SidebarNav page={page} onNavigate={setPage} />
      </Sider>

      <Layout>
        <MobileHeader page={page} onNavigate={setPage} />
        <Content className="content">
          {page === 'movimentacoes' ? (
            <MovementsPage movements={inventory.movements} />
          ) : (
            <StockPage inventory={inventory} />
          )}
        </Content>
      </Layout>

      <Toaster
        position={screens.md === false ? 'top-center' : 'top-right'}
        toastOptions={{
          duration: 2600,
          style: { borderRadius: 8, border: `1px solid ${colors.border}`, color: colors.text },
        }}
      />
    </Layout>
  );
}