import { http } from '@shared/http/client';

export interface ProductDTO {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: { rate: number; count: number };
}

export async function listProducts(): Promise<ProductDTO[]> {
  const resp = await http.get('/v1/products');
  return resp.data as ProductDTO[];
}

export async function getProduct(id: number): Promise<ProductDTO> {
  const resp = await http.get(`/v1/products/${id}`);
  return resp.data as ProductDTO;
}

