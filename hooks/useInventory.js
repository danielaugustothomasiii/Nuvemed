'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CREATION_REASON } from '@/constants/inventory';

const supabase = createClient();

function mapLoteParaProduto(lote) {
  return {
    id: lote.id,
    insumo_id: lote.insumo_id,
    name: lote.insumos?.nome,
    category: lote.insumos?.categorias?.nome,
    lot: lote.numero_lote,
    quantity: lote.quantidade,
    expiry: lote.data_validade,
    manufacturer: lote.fabricante,
  };
}

function mapMovimentacao(movimentacao) {
  return {
    id: movimentacao.id,
    date: movimentacao.data_hora,
    productName: movimentacao.lotes?.insumos?.nome,
    lot: movimentacao.lotes?.numero_lote,
    type: movimentacao.tipo,
    quantity: movimentacao.quantidade,
    reason: movimentacao.motivo,
  };
}

export function useInventory() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarProdutos = useCallback(async () => {
    const { data, error } = await supabase
      .from('lotes')
      .select('id, insumo_id, numero_lote, quantidade, data_validade, fabricante, insumos(nome, categorias(nome))')
      .order('data_validade', { ascending: true });
    if (error) throw error;
    setProducts((data ?? []).map(mapLoteParaProduto));
  }, []);

  const carregarMovimentacoes = useCallback(async () => {
    const { data, error } = await supabase
      .from('movimentacoes')
      .select('id, tipo, quantidade, motivo, data_hora, lotes(numero_lote, insumos(nome))')
      .order('data_hora', { ascending: false });
    if (error) throw error;
    setMovements((data ?? []).map(mapMovimentacao));
  }, []);

  const recarregarTudo = useCallback(
    () => Promise.all([carregarProdutos(), carregarMovimentacoes()]),
    [carregarProdutos, carregarMovimentacoes],
  );

  useEffect(() => {
    recarregarTudo()
      .catch((error) => console.error('Erro ao carregar o estoque:', error))
      .finally(() => setLoading(false));
  }, [recarregarTudo]);

  // ---------- Movimentações ----------

  const registrarMovimento = useCallback(async (lote_id, tipo, quantidade, motivo) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('movimentacoes').insert({
      lote_id,
      tipo,
      quantidade,
      motivo: motivo?.trim() || null,
      usuario_id: user?.id,
    });
    if (error) throw error;
  }, []);

  // Entrada e saída passam sempre por aqui: a quantidade atual é relida do banco
  // antes de gravar, para que duas pessoas mexendo no mesmo lote não sobrescrevam
  // o saldo uma da outra.
  const aplicarMovimentacao = useCallback(async (product, tipo, quantidade, motivo) => {
    const amount = Number(quantidade);
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error('Informe uma quantidade inteira maior que zero.');
    }

    const { data: lote, error: leituraError } = await supabase
      .from('lotes')
      .select('quantidade')
      .eq('id', product.id)
      .single();
    if (leituraError) throw leituraError;

    const saldoAtual = lote.quantidade;
    const novoSaldo = tipo === 'entrada' ? saldoAtual + amount : saldoAtual - amount;
    if (novoSaldo < 0) {
      throw new Error(`Estoque insuficiente: o lote tem ${saldoAtual} unidade${saldoAtual === 1 ? '' : 's'}.`);
    }

    const { error: updateError } = await supabase
      .from('lotes')
      .update({ quantidade: novoSaldo })
      .eq('id', product.id);
    if (updateError) throw updateError;

    await registrarMovimento(product.id, tipo, amount, motivo);
    await recarregarTudo();
  }, [registrarMovimento, recarregarTudo]);

  const stockIn = useCallback(
    (product, amount, motivo) => aplicarMovimentacao(product, 'entrada', amount, motivo),
    [aplicarMovimentacao],
  );

  const stockOut = useCallback(
    (product, amount, motivo) => aplicarMovimentacao(product, 'saida', amount, motivo),
    [aplicarMovimentacao],
  );

  // ---------- Cadastro e edição ----------

  const buscarOuCriarInsumo = useCallback(async (nome, categoriaNome) => {
    const { data: categoria, error: categoriaError } = await supabase
      .from('categorias')
      .select('id')
      .eq('nome', categoriaNome)
      .maybeSingle();
    if (categoriaError) throw categoriaError;

    let categoria_id = categoria?.id;
    if (!categoria_id) {
      const { data: novaCategoria, error } = await supabase
        .from('categorias')
        .insert({ nome: categoriaNome })
        .select('id')
        .single();
      if (error) throw error;
      categoria_id = novaCategoria.id;
    }

    const { data: insumo, error: insumoError } = await supabase
      .from('insumos')
      .select('id')
      .eq('nome', nome)
      .eq('categoria_id', categoria_id)
      .maybeSingle();
    if (insumoError) throw insumoError;
    if (insumo) return insumo.id;

    const { data: novoInsumo, error } = await supabase
      .from('insumos')
      .insert({ nome, categoria_id })
      .select('id')
      .single();
    if (error) throw error;
    return novoInsumo.id;
  }, []);

  const createProduct = useCallback(async (payload) => {
    const insumo_id = await buscarOuCriarInsumo(payload.name.trim(), payload.category);
    const quantidade = Number(payload.quantity) || 0;

    const { data: novoLote, error } = await supabase
      .from('lotes')
      .insert({
        insumo_id,
        numero_lote: payload.lot.trim(),
        quantidade,
        data_validade: payload.expiry,
        fabricante: payload.manufacturer?.trim() || null,
      })
      .select('id')
      .single();
    if (error) throw error;

    if (quantidade > 0) {
      await registrarMovimento(novoLote.id, 'entrada', quantidade, CREATION_REASON);
    }

    await recarregarTudo();
  }, [buscarOuCriarInsumo, registrarMovimento, recarregarTudo]);

  const updateProduct = useCallback(async (id, payload) => {
    const { data: atual, error: leituraError } = await supabase
      .from('lotes')
      .select('quantidade')
      .eq('id', id)
      .single();
    if (leituraError) throw leituraError;

    // O nome e a categoria vivem em `insumos`, então uma edição pode precisar
    // apontar o lote para outro insumo (ou criar um novo).
    const insumo_id = await buscarOuCriarInsumo(payload.name.trim(), payload.category);
    const novaQuantidade = Number(payload.quantity) || 0;

    const { error } = await supabase
      .from('lotes')
      .update({
        insumo_id,
        numero_lote: payload.lot.trim(),
        quantidade: novaQuantidade,
        data_validade: payload.expiry,
        fabricante: payload.manufacturer?.trim() || null,
      })
      .eq('id', id);
    if (error) throw error;

    // Alterar a quantidade pela tela de edição é um acerto de inventário:
    // fica registrado no histórico para o saldo continuar rastreável.
    if (novaQuantidade !== atual.quantidade) {
      await registrarMovimento(
        id,
        'ajuste',
        Math.abs(novaQuantidade - atual.quantidade),
        `Ajuste de inventário (${atual.quantidade} → ${novaQuantidade})`,
      );
    }

    await recarregarTudo();
  }, [buscarOuCriarInsumo, registrarMovimento, recarregarTudo]);

  const removeProduct = useCallback(async (id) => {
    // O histórico referencia o lote; apagamos primeiro para o delete funcionar
    // mesmo em bancos criados antes do ON DELETE CASCADE.
    const { error: historicoError } = await supabase.from('movimentacoes').delete().eq('lote_id', id);
    if (historicoError) throw historicoError;

    const { error } = await supabase.from('lotes').delete().eq('id', id);
    if (error) throw error;
    await recarregarTudo();
  }, [recarregarTudo]);

  return {
    products,
    movements,
    loading,
    createProduct,
    updateProduct,
    stockIn,
    stockOut,
    removeProduct,
  };
}
