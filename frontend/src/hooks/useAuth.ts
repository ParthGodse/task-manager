import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export function useLogin() {
  const navigate = useNavigate();
  return useMutation<{ access_token: string }, Error, { email: string; password: string }>(
    {
      mutationFn: (data: { email: string; password: string }) =>
        api.post<{ access_token: string }>('/auth/login', data).then((res) => res.data),
      onSuccess: (data) => {
        localStorage.setItem('token', data.access_token);
        navigate('/');
      },
    }
  );
}

export function useRegister() {
  const navigate = useNavigate();
  return useMutation<unknown, Error, { email: string; password: string; name?: string }>(
    {
      mutationFn: (data: { email: string; password: string; name?: string }) =>
        api.post<unknown>('/auth/register', data).then((res) => res.data),
      onSuccess: () => {
        navigate('/login');
      },
    }
  );
}
