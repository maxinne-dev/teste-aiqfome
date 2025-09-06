import { http } from '@shared/http/client';

export interface CustomerDTO {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerListResponse {
  data: CustomerDTO[];
  meta?: { total?: number; page?: number; per_page?: number };
}

export async function listCustomers(params: { q?: string; page?: number } = {}): Promise<CustomerListResponse> {
  const resp = await http.get('/v1/customers', { params });
  return resp.data as CustomerListResponse;
}

export async function getCustomer(id: number): Promise<CustomerDTO> {
  const resp = await http.get(`/v1/customers/${id}`);
  return resp.data as CustomerDTO;
}

export async function createCustomer(payload: { name: string; email: string }): Promise<CustomerDTO> {
  const resp = await http.post('/v1/customers', payload);
  return resp.data as CustomerDTO;
}

export async function updateCustomer(
  id: number,
  payload: { name: string; email: string }
): Promise<CustomerDTO> {
  const resp = await http.put(`/v1/customers/${id}`, payload);
  return resp.data as CustomerDTO;
}

