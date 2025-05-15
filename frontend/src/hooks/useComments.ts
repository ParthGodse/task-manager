import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export function useComments(cardId: string) {
  return useQuery(['comments', cardId], () =>
    api.get(`/comments/cards/${cardId}`).then(res => res.data)
  );
}

export function useAddComment() {
  const qc = useQueryClient();
  return useMutation(
    ({ cardId, content }: { cardId: string; content: string }) =>
      api.post(`/comments/cards/${cardId}`, { content }),
    {
      onSuccess: (_data, variables) => {
        qc.invalidateQueries(['comments', variables.cardId]);
      },
    }
  );
}