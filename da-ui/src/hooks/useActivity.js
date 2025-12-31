import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useActivity = () => {
  const [activity, setActivity] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const response = await apiService.getActivity();

        if (response.success && response.data) {
          setActivity(response.data.activities);
          setStats(response.data.stats);
        }
      } catch (err) {
        console.error('Erro ao buscar atividades:', err);
        setError(err.message || 'Erro ao carregar atividades');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return { activity, stats, loading, error };
};

