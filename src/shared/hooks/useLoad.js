import { useCallback, useEffect, useState } from 'react';
import { asList } from '../../shared/api/admin';
import { flattenLoc } from './loc';

// Загружает список и даёт перезагрузить его после изменений
export function useLoad(fetcher) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // переводимые поля превращаем в строки активного языка для списка
      setItems(flattenLoc(asList(await fetcher())));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, loading, error, setError, reload };
}