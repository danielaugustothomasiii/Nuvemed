'use client';

import { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Typography } from 'antd';
import { toast } from 'react-hot-toast';

const { Text } = Typography;

export default function StockOutModal({ open, product, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleConfirm = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onSubmit(product, values.amount);
      toast.success('Baixa efetuada com sucesso!');
      onClose();
    } catch {
      toast.error('Informe uma quantidade válida.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Modal
      title="Dar Baixa no Estoque"
      open={open}
      onOk={handleConfirm}
      onCancel={onClose}
      confirmLoading={loading}
      okText="Confirmar Baixa"
      cancelText="Cancelar"
      okButtonProps={{ danger: true }}
    >
      <div className="py-2">
        <p className="mb-2">
          Medicamento: <Text strong>{product.name}</Text> (Lote: {product.lot})
        </p>
        <p className="mb-4 text-gray-500 text-sm">
          Quantidade atual disponível: <Text strong>{product.quantity}</Text> unidades
        </p>

        <Form form={form} layout="vertical">
          <Form.Item
            name="amount"
            label="Quantidade a retirar"
            rules={[
              { required: true, message: 'Informe a quantidade.' },
              {
                validator: (_, value) => {
                  if (value > product.quantity) {
                    return Promise.reject(new Error('A quantidade não pode ser maior que o estoque atual!'));
                  }
                  if (value <= 0) {
                    return Promise.reject(new Error('Informe um valor maior que zero.'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              min={1}
              max={product.quantity}
              style={{ width: '100%' }}
              placeholder="Ex.: 5"
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
