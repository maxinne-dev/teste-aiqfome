import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listProducts, ProductDTO } from './api/productsApi';

export function useProducts() {
  return useQuery<ProductDTO[]>({ queryKey: ['products'], queryFn: listProducts });
}

export function useProductFilters(products: ProductDTO[] | undefined, search: string, category: string) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    (products ?? []).forEach((p) => set.add(p.category));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (products ?? []).filter((p) => {
      const matchesQ = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchesCat = !category || p.category === category;
      return matchesQ && matchesCat;
    });
  }, [products, search, category]);

  return { categories, filtered };
}

