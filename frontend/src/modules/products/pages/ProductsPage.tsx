import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid2 as Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useProducts, useProductFilters } from '../hooks';

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('');
  const { categories, filtered } = useProductFilters(products, search, category);

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
      </Stack>

      {isLoading && <Typography>Carregando...</Typography>}

      {!isLoading && (
        <Grid container spacing={2} columns={12}>
          {filtered.map((p) => (
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

