import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { AxiosResponse } from 'axios';
import { useToast } from '../components/ui/useToast';

export interface Board {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export interface CreateBoardData {
  title: string;
  description?: string;
}

export function useBoards() {
  return useQuery<Board[]>({
    queryKey: ['boards'],
    queryFn: () => api.get('/boards/').then(res => res.data),
  });
}

export function useBoard(id: string) {
  return useQuery<Board>({
    queryKey: ['boards', id],
    queryFn: () => api.get(`/boards/${id}`).then(res => res.data),
    enabled: !!id,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation<AxiosResponse<any>, Error, CreateBoardData>(
    {
      mutationFn: (data: CreateBoardData) => api.post('/boards/', data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['boards'] });
        toast({
          title: 'Board created',
          description: 'Your new board is ready',
          type: 'success',
        });
      },
      onError: () => {
        toast({
          title: 'Failed to create board',
          description: 'Please try again later',
          type: 'error',
        });
      }
    }
  );
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation<AxiosResponse<any>, Error, { id: string; data: Partial<CreateBoardData> }>(
    {
      mutationFn: ({ id, data }: { id: string; data: Partial<CreateBoardData> }) => 
        api.patch(`/boards/${id}`, data),
      onSuccess: (_, variables: { id: string; data: Partial<CreateBoardData> }) => {
        // queryClient.invalidateQueries({ queryKey: ['boards'] });
        queryClient.invalidateQueries({ queryKey: ['boards', variables.id] });
        toast({
          title: 'Board updated',
          description: 'Your changes have been saved',
          type: 'success',
        });
      },
      onError: () => {
        toast({
          title: 'Failed to update board',
          description: 'Please try again later',
          type: 'error',
        });
      }
    }
  );
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation<AxiosResponse<any>, Error, string>(
    {
      mutationFn: (id: string) => api.delete(`/boards/${id}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['boards'] });
        toast({
          title: 'Board deleted',
          description: 'The board has been removed',
          type: 'success',
        });
      },
      onError: () => {
        toast({
          title: 'Failed to delete board',
          description: 'Please try again later',
          type: 'error',
        });
      }
    }
  );
}