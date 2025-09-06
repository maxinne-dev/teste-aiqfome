import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CustomerDTO,
  CustomerListResponse,
  createCustomer,
  getCustomer,
  listCustomers,
  updateCustomer
} from './api/customersApi';

export function useCustomers(params: { q?: string; page?: number }) {
  const queryKey = ['customers', params] as const;
  const query = useQuery<CustomerListResponse>({
    queryKey,
    queryFn: () => listCustomers(params),
    placeholderData: keepPreviousData
  });
  return { ...query, queryKey };
}

export function useCustomer(id: number) {
  return useQuery<CustomerDTO>({
    queryKey: ['customer', id],
    queryFn: () => getCustomer(id)
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
    }
  });
}

export function useUpdateCustomer(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; email: string }) => updateCustomer(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      qc.invalidateQueries({ queryKey: ['customer', id] });
    }
  });
}

