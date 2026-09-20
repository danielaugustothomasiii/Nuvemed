'use client';

import { useEffect, useState } from 'react';
import { AutoComplete, Form, InputNumber, Modal, Typography } from 'antd';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { movementReasons } from '../../constants/inventory';

const { Text } = Typography;

const copy = {
  entrada: {
    title: 'Registrar entrada',
    icon: <LoginOutlined />,
    quantityLabel: 'Quantidade a adicionar',
    okText: 'Confirmar entrada',
    danger: false,
  },
  saida: {
    title: 'Dar baixa no estoque',
    icon: <LogoutOutlined />,
    quantityLabel: 'Quantidade a retirar',
    okText: 'Confirmar baixa',
    danger: true,
  },
};

export default function MovementModal({ open, type = 'saida', product, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  if (!product) return null;

  const config = copy[type];
  const isSaida = type === 'saida';
  const reasonOptions = movementReasons[type].map((item) => ({ value: item }));

  const confirm = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch {
      return; // o próprio formulário já mostra o erro embaixo do campo
    }

    setLoading(true);
    try {
      await onSubmit(product, values.amount, values.reason);
      onClose();
    } catch {
      // o erro já foi exibido em toast; o modal continua aberto para correção
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<span className="movement-modal-title">{config.icon} {config.title}</span>}
      open={open}
      onOk={confirm}
      onCancel={onClose}
      confirmLoading={loading}
      okText={config.okText}
      cancelText="Cancelar"
      okButtonProps={{ danger: config.danger, disabled: isSaida && product.quantity === 0 }}
      destroyOnHidden
    >
      <div className="movement-modal-content">
        <div className="movement-modal-product">
          <Text strong>{product.name}</Text>
          <Text type="secondary">
            Lote {product.lot} · validade {dayjs(product.expiry).format('DD/MM/YYYY')}
          </Text>
          <Text type={product.quantity === 0 ? 'danger' : 'secondary'}>
            Saldo atual: {product.quantity} unidade{product.quantity === 1 ? '' : 's'}
          </Text>
        </div>

        <Form form={form} layout="vertical" initialValues={{ amount: 1 }}>
          <Form.Item
            name="amount"
            label={config.quantityLabel}
            rules={[
              { required: true, message: 'Informe a quantidade.' },
              {
                validator: (_, value) => {
                  if (value === undefined || value === null) return Promise.resolve();
                  if (!Number.isInteger(value) || value <= 0) {
                    return Promise.reject(new Error('Informe um número inteiro maior que zero.'));
                  }
                  if (isSaida && value > product.quantity) {
                    return Promise.reject(new Error('A baixa não pode ser maior que o saldo do lote.'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              min={1}
              max={isSaida ? Math.max(product.quantity, 1) : undefined}
              precision={0}
              style={{ width: '100%' }}
              disabled={isSaida && product.quantity === 0}
              autoFocus
            />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Motivo"
            rules={[{ required: true, message: 'Informe o motivo da movimentação.' }]}
          >
            <AutoComplete
              options={reasonOptions}
              placeholder="Selecione ou escreva o motivo"
              filterOption={(input, option) =>
                option.value.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Form>

        {isSaida && product.quantity === 0 && (
          <Text type="danger">Este lote está sem estoque. Registre uma entrada antes de dar baixa.</Text>
        )}
      </div>
    </Modal>
  );
}
