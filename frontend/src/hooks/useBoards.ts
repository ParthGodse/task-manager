import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export function useBoards() {
  return useQuery(['boards'], () => api.get('/boards/').then(res => res.data));
}