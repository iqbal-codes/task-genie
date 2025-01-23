import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const api = axios.create({
  baseURL: BASE_URL,
});

export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data } = await api.get('/todos');
      return data as Todo[];
    },
  });
};

export const useAddTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      const { data } = await api.post('/todos', {
        title,
        completed: false,
        createdAt: new Date(),
      });
      return data as Todo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

export const useToggleTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/todos/${id}`);
      return data as Todo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};