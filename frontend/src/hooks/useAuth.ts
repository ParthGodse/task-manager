import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { AxiosResponse } from 'axios';
import { useToast } from '../components/ui/useToast';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export function useLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  return useMutation<AxiosResponse<any>, Error, LoginCredentials>({
    mutationFn: (data: LoginCredentials) => api.post('/auth/login', data),
    onSuccess: (res) => {
      localStorage.setItem('token', res.data.access_token);
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
        type: 'success',
      });
      navigate('/');
    },
    onError: (error: any) => {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Please check your credentials',
        type: 'error',
      });
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  return useMutation<AxiosResponse<any>, Error, RegisterCredentials>({
    mutationFn: (data: RegisterCredentials) => api.post('/auth/register', data),
    onSuccess: () => {
      toast({
        title: 'Registration successful',
        description: 'You can now login with your credentials',
        type: 'success',
      });
      navigate('/login');
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'Please check your information',
        type: 'error',
      });
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  
  return () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
}

export function useIsAuthenticated() {
  return !!localStorage.getItem('token');
}