import { useCallback, useEffect, useState } from 'react';

export const useFetch = <T>(url: string, end: string): { loading: boolean; data: T | null } => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${url}api/${end}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      setLoading(false);
    }
  }, [url, end]);

  useEffect(() => {
    void fetchData();
    const intervalId = setInterval(() => {
      void fetchData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  return { loading, data };
};
