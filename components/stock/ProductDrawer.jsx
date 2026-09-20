import { useEffect } from 'react';
import { Alert, Button, DatePicker, Drawer, Form, Grid, Input, InputNumber, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';
import { categories } from '../../constants/inventory';

const { Text } = Typography;
const categoryOptions = categories.map((item) => ({ value: item, label: item }));

export default function ProductDrawer({ open, product, saving = false, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const screens = Grid.useBreakpoint();
  const isEditing = Boolean(product);

  useEffect(() => {
    if (!open) return;
    if (product) form.setFieldsValue({ ...product, expiry: dayjs(product.expiry) });
    else form.resetFields();
  }, [open, product, form]);

  const submit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({ ...values, expiry: values.expiry.format('YYYY-MM-DD') });
    } catch {
      toast.error('Confira os campos obrigatórios.');
    }
  };

  return (
    <Drawer
      title={isEditing ? 'Editar medicamento' : 'Cadastrar medicamento'}
      placement="right"
      width={screens.sm === false ? '100%' : 460}
      open={open}
      onClose={onClose}
      forceRender
      maskClosable={!saving}
      extra={(
        <Button type="primary" onClick={submit} loading={saving}>
          {isEditing ? 'Salvar' : 'Cadastrar'}
        </Button>
      )}
    >
      <Text type="secondary" className="drawer-intro">
        Preencha as informações do lote. O mesmo medicamento pode possuir vários lotes com validades diferentes.
      </Text>

      {isEditing && (
        <Alert
          type="info"
          showIcon
          className="drawer-alert"
          message="Alterar a quantidade aqui gera um ajuste de inventário no histórico. Para entradas e saídas do dia a dia, use as ações “Registrar entrada” e “Dar baixa”."
        />
      )}

      <Form form={form} layout="vertical" className="product-form" initialValues={{ quantity: 1 }}>
        <Form.Item name="name" label="Medicamento" rules={[{ required: true, message: 'Informe o medicamento.' }]}>
          <Input placeholder="Ex.: Dipirona 500mg" />
        </Form.Item>
        <Form.Item name="lot" label="Lote" rules={[{ required: true, message: 'Informe o lote.' }]}>
          <Input placeholder="Ex.: DP231A" />
        </Form.Item>
        <Form.Item name="manufacturer" label="Fabricante" rules={[{ required: true, message: 'Informe o fabricante.' }]}>
          <Input placeholder="Ex.: Medley" />
        </Form.Item>
        <Form.Item name="category" label="Categoria" rules={[{ required: true, message: 'Selecione a categoria.' }]}>
          <Select placeholder="Selecione" options={categoryOptions} />
        </Form.Item>
        <div className="form-two-columns">
          <Form.Item name="quantity" label="Quantidade" rules={[{ required: true, message: 'Informe a quantidade.' }]}>
            <InputNumber min={0} precision={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="expiry" label="Validade" rules={[{ required: true, message: 'Informe a validade.' }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} inputReadOnly={screens.md === false} />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
}
