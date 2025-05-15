import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export function useCards(listId: string) {
  return useQuery(['cards', listId], () =>
    api.get('/cards/', { params: { list_id: listId } }).then(res => res.data)
  );
}