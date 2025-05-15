import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export function useActivity(boardId: string) {
  return useQuery(['activity', boardId], () =>
    api.get(`/activity/boards/${boardId}`).then(res => res.data)
  );
}