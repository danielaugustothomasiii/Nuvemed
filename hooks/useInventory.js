'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

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

export function useInventory() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarProdutos = useCallback(async () => {
    const { data, error } = await supabase
      .from('lotes')
      .select('id, insumo_id, numero_lote, quantidade, data_validade, fabricante, insumos(nome, categorias(nome))')
      .order('data_validade', { ascending: true });
    if (error) console.error('Erro ao carregar produtos:', error);
    setProducts((data ?? []).map(mapLoteParaProduto));
  }, []);

  const carregarMovimentacoes = useCallback(async () => {
    const { data } = await supabase
      .from('movimentacoes')
      .select('id, tipo, quantidade, data_hora, lotes(numero_lote, insumos(nome))')
      .order('data_hora', { ascending: false });
    setMovements(
      (data ?? []).map((m) => ({
        id: m.id,
        date: m.data_hora,
        productName: m.lotes?.insumos?.nome,
        lot: m.lotes?.numero_lote,
        type: m.tipo === 'entrada' ? 'Entrada' : 'Saída',
        quantity: m.quantidade,
      }))
    );
  }, []);

  useEffect(() => {
    Promise.all([carregarProdutos(), carregarMovimentacoes()]).finally(() => setLoading(false));
  }, [carregarProdutos, carregarMovimentacoes]);

  const registrarMovimento = useCallback(async (lote_id, tipo, quantidade) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('movimentacoes').insert({
      lote_id,
      tipo,
      quantidade,
      usuario_id: user?.id,
    });
  }, []);

  const buscarOuCriarInsumo = useCallback(async (nome, categoriaNome) => {
    const { data: categoria } = await supabase
      .from('categorias')
      .select('id')
      .eq('nome', categoriaNome)
      .maybeSingle();

    let categoria_id = categoria?.id;
    if (!categoria_id) {
      const { data: novaCategoria } = await supabase
        .from('categorias')
        .insert({ nome: categoriaNome })
        .select('id')
        .single();
      categoria_id = novaCategoria.id;
    }

    const { data: insumo } = await supabase
      .from('insumos')
      .select('id')
      .eq('nome', nome)
      .eq('categoria_id', categoria_id)
      .maybeSingle();

    if (insumo) return insumo.id;

    const { data: novoInsumo } = await supabase
      .from('insumos')
      .insert({ nome, categoria_id })
      .select('id')
      .single();
    return novoInsumo.id;
  }, []);

  const createProduct = useCallback(async (payload) => {
    const insumo_id = await buscarOuCriarInsumo(payload.name, payload.category);

    const { data: novoLote } = await supabase
      .from('lotes')
      .insert({
        insumo_id,
        numero_lote: payload.lot,
        quantidade: payload.quantity,
        data_validade: payload.expiry,
        fabricante: payload.manufacturer,
      })
      .select('id')
      .single();

    if (payload.quantity > 0) {
      await registrarMovimento(novoLote.id, 'entrada', payload.quantity);
    }

    await Promise.all([carregarProdutos(), carregarMovimentacoes()]);
  }, [buscarOuCriarInsumo, registrarMovimento, carregarProdutos, carregarMovimentacoes]);

  const updateProduct = useCallback(async (id, payload) => {
    await supabase
      .from('lotes')
      .update({
        numero_lote: payload.lot,
        quantidade: payload.quantity,
        data_validade: payload.expiry,
        fabricante: payload.manufacturer,
      })
      .eq('id', id);
    await carregarProdutos();
  }, [carregarProdutos]);

  const stockOut = useCallback(async (product, amount) => {
    await supabase
      .from('lotes')
      .update({ quantidade: product.quantity - amount })
      .eq('id', product.id);
    await registrarMovimento(product.id, 'saida', amount);
    await Promise.all([carregarProdutos(), carregarMovimentacoes()]);
  }, [registrarMovimento, carregarProdutos, carregarMovimentacoes]);

  const removeProduct = useCallback(async (id) => {
    await supabase.from('lotes').delete().eq('id', id);
    await carregarProdutos();
  }, [carregarProdutos]);

  return { products, movements, loading, createProduct, updateProduct, stockOut, removeProduct };
}