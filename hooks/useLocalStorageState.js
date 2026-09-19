import { useEffect, useState } from 'react';

function readStored(key, fallbackFactory) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallbackFactory();
  } catch {
    return fallbackFactory();
  }
}

export function useLocalStorageState(key, fallbackFactory) {
  const [value, setValue] = useState(() => readStored(key, fallbackFactory));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // armazenamento indisponível (ex.: navegação privada)
    }
  }, [key, value]);

  return [value, setValue];
}
