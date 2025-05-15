import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export function useLists(boardId: string) {
  return useQuery(['lists', boardId], () =>
    api.get('/lists/', { params: { board_id: boardId } }).then(res => res.data)
  );
}
