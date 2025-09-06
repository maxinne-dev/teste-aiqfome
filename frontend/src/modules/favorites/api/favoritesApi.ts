import { http } from '@shared/http/client';

export interface FavoriteDTO {
  customer_id: number;
  product_id: number;
  created_at?: string;
}

export interface FavoritesListResponse {
  data: FavoriteDTO[];
  meta?: { total?: number; page?: number; per_page?: number };
}

export async function listFavorites(customerId: number, params: { page?: number } = {}) {
  const resp = await http.get(`/v1/customers/${customerId}/favorites`, { params });
  return resp.data as FavoritesListResponse;
}

export async function addFavorite(customerId: number, productId: number) {
  const resp = await http.post(`/v1/customers/${customerId}/favorites`, { product_id: productId });
  return resp.data as FavoriteDTO;
}

export async function removeFavorite(customerId: number, productId: number) {
  await http.delete(`/v1/customers/${customerId}/favorites/${productId}`);
}

