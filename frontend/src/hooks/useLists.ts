import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useToast } from '../components/ui/useToast';

export interface List {
  id: string;
  title: string;
  position: number;
  board_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateListData {
  title: string;
  board_id: string;
  position?: number;
}

// 1) Fetch all lists for a board
export function useLists(boardId: string) {
  return useQuery<List[], Error>({
    queryKey: ['lists', boardId],
    queryFn: () =>
      api
        .get<List[]>('/lists/', { params: { board_id: boardId } })
        .then(res => res.data),
    enabled: Boolean(boardId),
  });
}

// 2) Create a new list
export function useCreateList() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<List, Error, CreateListData>({
    mutationFn: data =>
      api.post<List>('/lists/', data).then(res => res.data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lists', variables.board_id] });
      toast({
        title: 'List created',
        description: 'Your new list is ready',
        type: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to create list',
        description: 'Please try again later',
        type: 'error',
      });
    },
  });
}

// 3) Update an existing list
export function useUpdateList() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<List, Error, { id: string; data: Partial<CreateListData> }>({
    mutationFn: ({ id, data }) =>
      api.patch<List>(`/lists/${id}`, data).then(res => res.data),
    onSuccess: updatedList => {
      queryClient.invalidateQueries({ queryKey: ['lists', updatedList.board_id] });
      toast({
        title: 'List updated',
        description: 'Your changes have been saved',
        type: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to update list',
        description: 'Please try again later',
        type: 'error',
      });
    },
  });
}

// 4) Delete a list
export function useDeleteList() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, { id: string; boardId: string }>({
    mutationFn: ({ id }) =>
      api.delete(`/lists/${id}`).then(() => {}),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lists', variables.boardId] });
      toast({
        title: 'List deleted',
        description: 'The list has been removed',
        type: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to delete list',
        description: 'Please try again later',
        type: 'error',
      });
    },
  });
}

// 5) Bulk‐update list positions
export function useUpdateListPositions() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { id: string; board_id: string; position: number }[]
  >({
    mutationFn: lists =>
      api.post('/lists/positions', { lists }).then(() => {}),
    onSuccess: (_data, lists) => {
      const boardIds = Array.from(new Set(lists.map(l => l.board_id)));
      boardIds.forEach(boardId =>
        queryClient.invalidateQueries({ queryKey: ['lists', boardId] })
      );
    },
  });
}
