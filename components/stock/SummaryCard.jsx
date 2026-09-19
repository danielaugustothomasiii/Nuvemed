import { Badge, Card, Statistic, Typography } from 'antd';

const { Text } = Typography;

export default function SummaryCard({ title, value, subtitle, icon, tone, active, onClick }) {
  return (
    <Card
      className={`summary-card ${active ? 'summary-card-active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={active}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className="summary-card-top">
        <span className={`summary-icon ${tone}`}>{icon}</span>
        {active && <Badge status="success" />}
      </div>
      <Statistic value={value} />
      <Text strong className="summary-title">{title}</Text>
      <Text type="secondary" className="summary-subtitle">{subtitle}</Text>
    </Card>
  );
}
