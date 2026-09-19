import { useCallback, useEffect, useState } from 'react';

// Navegação por hash (#/pagina): funciona no GitHub Pages, inclusive ao recarregar (F5).
function resolvePage(pages, defaultPage) {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return pages.includes(hash) ? hash : defaultPage;
}

export function useHashPage(pages, defaultPage) {
  const [page, setPage] = useState(() => resolvePage(pages, defaultPage));

  useEffect(() => {
    const onHashChange = () => {
      setPage(resolvePage(pages, defaultPage));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [pages, defaultPage]);

  const navigate = useCallback((next) => {
    window.location.hash = `/${next}`;
  }, []);

  return [page, navigate];
}
