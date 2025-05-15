import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export interface Activity {
  id: string;
  action: string;
  entity_type: 'board' | 'list' | 'card' | 'comment';
  entity_id: string;
  user_id: string;
  user_name?: string;
  created_at: string;
  metadata?: {
    title?: string;
    from_list_id?: string;
    to_list_id?: string;
    from_list_title?: string;
    to_list_title?: string;
  };
}

export function useActivity(boardId: string) {
  return useQuery<Activity[]>({
    queryKey: ['activity', boardId],
    queryFn: () => api.get(`/activity/boards/${boardId}`).then(res => res.data),
    enabled: !!boardId,
  });
}