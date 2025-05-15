import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useToast } from '../components/ui/useToast';

export interface Comment {
  id: string;
  content: string;
  card_id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_name?: string;
}

// 1) Fetch all comments for a given card
export function useComments(cardId: string) {
  return useQuery<Comment[], Error>({
    queryKey: ['comments', cardId],
    queryFn: () =>
      api
        .get<Comment[]>(`/comments/cards/${cardId}`)
        .then(res => res.data),
    enabled: Boolean(cardId),
  });
}

// 2) Add a new comment
export function useAddComment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Comment, Error, { cardId: string; content: string }>({
    mutationFn: ({ cardId, content }) =>
      api
        .post<Comment>(`/comments/cards/${cardId}`, { content })
        .then(res => res.data),

    onSuccess: (_newComment, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.cardId] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      toast({
        title: 'Comment added',
        type: 'success',
      });
    },

    onError: () => {
      toast({
        title: 'Failed to add comment',
        description: 'Please try again later',
        type: 'error',
      });
    },
  });
}

// 3) Delete an existing comment
export function useDeleteComment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, { id: string; cardId: string }>({
    mutationFn: ({ id }) =>
      api
        .delete(`/comments/${id}`)
        .then(() => {}),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.cardId] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      toast({
        title: 'Comment deleted',
        type: 'success',
      });
    },

    onError: () => {
      toast({
        title: 'Failed to delete comment',
        description: 'Please try again later',
        type: 'error',
      });
    },
  });
}
