import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Grid2 as Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useProducts, useProductFilters } from '../hooks';
import { useFavorites, useAddFavorite, useRemoveFavorite } from '@modules/favorites/hooks';
import { CardsSkeleton } from '@shared/components/CardsSkeleton';

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [customerId, setCustomerId] = React.useState('');
  const { categories, filtered } = useProductFilters(products, search, category);
  const customerIdNum = Number(customerId);
  const hasCustomer = Number.isFinite(customerIdNum) && customerIdNum > 0;
  const { data: favs } = useFavorites(hasCustomer ? customerIdNum : 0);
  const { mutateAsync: addFav, isPending: adding } = useAddFavorite(hasCustomer ? customerIdNum : 0);
  const { mutateAsync: removeFav, isPending: removing } = useRemoveFavorite(hasCustomer ? customerIdNum : 0);

  return (
    <Box>
      <Typography variant="h4" sx={{ my: 2 }}>
        Produtos
      </Typography>

      <Stack direction="row" spacing={2} sx={{ my: 2 }}>
        <TextField label="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select
          displayEmpty
          value={category}
          onChange={(e) => setCategory(e.target.value as string)}
          renderValue={(val) => (val ? val : 'Todas categorias')}
        >
          <MenuItem value="">Todas categorias</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Customer ID"
          type="number"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="para favoritar/desfavoritar"
        />
      </Stack>

      {isLoading && <CardsSkeleton count={6} />}

      {!isLoading && (
        <Grid container spacing={2} columns={12}>
          {filtered.map((p) => {
            const isFav = !!favs?.data?.some((f: any) => f.product_id === p.id);
            const toggleDisabled = !hasCustomer || adding || removing;
            return (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card aria-label={`product-${p.id}`}>
                <CardHeader title={p.title} subheader={p.category} />
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    R$ {p.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {p.description}
                  </Typography>
                  <Stack direction="row" sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      disabled={toggleDisabled}
                      onClick={async () => {
                        if (!hasCustomer) return;
                        if (isFav) await removeFav(p.id);
                        else await addFav(p.id);
                      }}
                    >
                      {isFav ? 'Desfavoritar' : 'Favoritar'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );})}
        </Grid>
      )}
    </Box>
  );
}
