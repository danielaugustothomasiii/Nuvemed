import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FilterOutlined } from '@ant-design/icons';

// Badge do filtro atual: entra com animação e troca o texto deslizando,
// enquanto a largura acompanha suavemente o novo rótulo.
export default function FilterBadge({ label }) {
  const [items, setItems] = useState(() => [{ id: 0, label, leaving: false }]);
  const [width, setWidth] = useState();
  const nextId = useRef(1);
  const activeLabel = useRef(label);
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeLabel.current === label) return;
    activeLabel.current = label;
    const id = nextId.current;
    nextId.current += 1;
    setItems((current) => [
      ...current.map((item) => ({ ...item, leaving: true })),
      { id, label, leaving: false },
    ]);
  }, [label]);

  useLayoutEffect(() => {
    if (activeRef.current) setWidth(activeRef.current.offsetWidth);
  }, [items]);

  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <span className="filter-badge" role="status" aria-live="polite">
      <FilterOutlined className="filter-badge-icon" />
      <span className="filter-badge-prefix">Filtro:</span>
      <span className="filter-badge-value" style={{ width }}>
        {items.map((item) => (
          <span
            key={item.id}
            ref={item.leaving ? undefined : activeRef}
            className={`filter-badge-label ${item.leaving ? 'is-leaving' : 'is-entering'}`}
            aria-hidden={item.leaving || undefined}
            onAnimationEnd={item.leaving ? () => removeItem(item.id) : undefined}
          >
            {item.label}
          </span>
        ))}
      </span>
    </span>
  );
}
