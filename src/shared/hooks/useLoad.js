import { useCallback, useEffect, useState } from 'react';

export default function useLoad(fn) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    setLoading(true);
    try { setData(await fn()); setError(''); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [fn]);
  useEffect(() => { reload(); }, [reload]);
  return { data, error, loading, reload, setError };
}
