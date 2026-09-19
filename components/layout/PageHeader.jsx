import { Typography } from 'antd';

const { Title, Text } = Typography;

export default function PageHeader({ title, description, extra }) {
  return (
    <div className="page-header">
      <div className="page-header-text">
        <Title level={2}>{title}</Title>
        {description && <Text type="secondary">{description}</Text>}
      </div>
      {extra && <div className="page-header-extra">{extra}</div>}
    </div>
  );
}
