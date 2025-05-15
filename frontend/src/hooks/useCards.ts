import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useToast } from '../components/ui/useToast';

export interface Card {
  id: string;
  title: string;
  description?: string;
  position: number;
  list_id: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  labels?: string[];
}

export interface CreateCardData {
  title: string;
  list_id: string;
  description?: string;
  position?: number;
  due_date?: string;
  labels?: string[];
}

// 1) Fetch all cards for a list
export function useCards(listId: string) {
  return useQuery<Card[], Error>({
    queryKey: ['cards', listId],
    queryFn: () =>
      api
        .get<Card[]>('/cards/', { params: { list_id: listId } })
        .then(res => res.data),
    enabled: Boolean(listId),
  });
}

// 2) Fetch single card detail
export function useCard(cardId: string) {
  return useQuery<Card, Error>({
    queryKey: ['cards', 'detail', cardId],
    queryFn: () => api.get<Card>(`/cards/${cardId}`).then(res => res.data),
    enabled: Boolean(cardId),
  });
}

// 3) Create a new card
export function useCreateCard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Card, Error, CreateCardData>({
    mutationFn: data =>
      api.post<Card>('/cards/', data).then(res => res.data),
    onSuccess: (_newCard, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cards', variables.list_id] });
      toast({
        title: 'Card created',
        description: 'Your new card is ready',
        type: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to create card',
        description: 'Please try again later',
        type: 'error',
      });
    },
  });
}

// 4) Update an existing card
export function useUpdateCard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Card, Error, { id: string; data: Partial<CreateCardData> }>({
    mutationFn: ({ id, data }) =>
      api.patch<Card>(`/cards/${id}`, data).then(res => res.data),
    onSuccess: updatedCard => {
      queryClient.invalidateQueries({ queryKey: ['cards', updatedCard.list_id] });
      queryClient.invalidateQueries({ queryKey: ['cards', 'detail', updatedCard.id] });
      toast({
        title: 'Card updated',
        description: 'Your changes have been saved',
        type: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to update card',
        description: 'Please try again later',
        type: 'error',
      });
    },
  });
}

// 5) Delete a card
type DeleteCardVars = { id: string; listId: string };
export function useDeleteCard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, DeleteCardVars>({
    mutationFn: async ({ id }) => {
      await api.delete(`/cards/${id}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cards', variables.listId] });
      toast({
        title: 'Card deleted',
        description: 'The card has been removed',
        type: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to delete card',
        description: 'Please try again later',
        type: 'error',
      });
    },
  });
}

// 6) Bulk‐update card positions
export function useUpdateCardPositions() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; list_id: string; position: number }[]>({
    mutationFn: async cards => {
      await api.post('/cards/positions', { cards });
    },
    onSuccess: (_data, cards) => {
      const listIds = Array.from(new Set(cards.map(c => c.list_id)));
      listIds.forEach(listId =>
        queryClient.invalidateQueries({ queryKey: ['cards', listId] })
      );
    },
  });
}
