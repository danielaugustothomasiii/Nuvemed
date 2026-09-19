import { useCallback } from 'react';
import { MOVEMENT_KEY, PRODUCT_KEY } from '../constants/inventory';
import { seedProducts } from '../data/seedProducts';
import { useLocalStorageState } from './useLocalStorageState';

const emptyList = () => [];

export function useInventory() {
  const [products, setProducts] = useLocalStorageState(PRODUCT_KEY, seedProducts);
  const [movements, setMovements] = useLocalStorageState(MOVEMENT_KEY, emptyList);

  const addMovement = useCallback((product, type, quantity, reason) => {
    const movement = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      productName: product.name,
      lot: product.lot,
      type,
      quantity,
      reason,
    };
    setMovements((current) => [movement, ...current]);
  }, [setMovements]);

  const createProduct = useCallback((payload) => {
    const created = { id: crypto.randomUUID(), ...payload };
    setProducts((current) => [created, ...current]);
    if (created.quantity > 0) addMovement(created, 'Entrada', created.quantity, 'Cadastro inicial');
    return created;
  }, [setProducts, addMovement]);

  const updateProduct = useCallback((id, payload) => {
    setProducts((current) => current.map((item) => item.id === id ? { ...item, ...payload } : item));
  }, [setProducts]);

  const stockOut = useCallback((product, amount) => {
    setProducts((current) => current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity - amount } : item));
    addMovement(product, 'Saída', amount, 'Baixa de estoque');
  }, [setProducts, addMovement]);

  const removeProduct = useCallback((id) => {
    setProducts((current) => current.filter((item) => item.id !== id));
  }, [setProducts]);

  return { products, movements, createProduct, updateProduct, stockOut, removeProduct };
}
