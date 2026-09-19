import { useMemo } from 'react';
import { Card, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { colors } from '../../theme';

const { Text } = Typography;

export default function ExpiryChart({ products }) {
  const chartData = useMemo(() => {
    return Array.from({ length: 6 }, (_, index) => {
      const month = dayjs().startOf('month').add(index, 'month');
      const count = products.filter((p) => dayjs(p.expiry).isSame(month, 'month')).length;
      return { month: month.format('MMM').replace('.', ''), quantidade: count };
    });
  }, [products]);

  return (
    <Card className="chart-card">
      <div className="section-heading">
        <div>
          <Text strong>Vencimentos por mês</Text>
          <Text type="secondary">Próximos 6 meses</Text>
        </div>
        <CalendarOutlined className="section-heading-icon" />
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: colors.muted, fontSize: 12 }} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: colors.muted, fontSize: 12 }} />
            <Tooltip cursor={{ fill: colors.surfaceHover }} contentStyle={{ borderRadius: 8, border: `1px solid ${colors.border}` }} />
            <Bar dataKey="quantidade" fill={colors.primary} radius={[5, 5, 0, 0]} maxBarSize={38} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
