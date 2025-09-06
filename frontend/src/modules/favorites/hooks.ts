import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addFavorite, listFavorites, removeFavorite } from './api/favoritesApi';

export function useFavorites(customerId: number, params: { page?: number } = {}) {
  const queryKey = ['favorites', customerId, params] as const;
  const query = useQuery({
    queryKey,
    queryFn: () => listFavorites(customerId, params),
    placeholderData: keepPreviousData,
    enabled: !!customerId
  });
  return { ...query, queryKey };
}

export function useAddFavorite(customerId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => addFavorite(customerId, productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['favorites', customerId] });
    }
  });
}

export function useRemoveFavorite(customerId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => removeFavorite(customerId, productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['favorites', customerId] });
    }
  });
}
