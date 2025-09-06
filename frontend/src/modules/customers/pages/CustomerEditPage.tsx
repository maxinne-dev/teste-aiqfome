import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { CustomerForm } from '../components/CustomerForm';
import { useCustomer, useUpdateCustomer } from '../hooks';
import { useAddFavorite, useFavorites, useRemoveFavorite } from '@modules/favorites/hooks';

export default function CustomerEditPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data } = useCustomer(id);
  const { mutateAsync, isPending } = useUpdateCustomer(id);
  const navigate = useNavigate();

  const initial = data ? { name: data.name, email: data.email } : { name: '', email: '' };

  // Favorites section
  const { data: favs, isLoading: favsLoading } = useFavorites(id);
  const { mutateAsync: addFav, isPending: adding } = useAddFavorite(id);
  const { mutateAsync: removeFav } = useRemoveFavorite(id);
  const [productId, setProductId] = React.useState('');

  return (
    <div>
      <Typography variant="h4" sx={{ my: 2 }}>
        Editar Cliente
      </Typography>
      <CustomerForm
        initial={initial}
        submitLabel={isPending ? 'Salvando...' : 'Salvar'}
        onSubmit={async (values) => {
          await mutateAsync(values);
          navigate('/customers');
        }}
      />
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Favoritos
        </Typography>
        <Stack direction="row" spacing={2} sx={{ my: 2 }}>
          <TextField
            label="Product ID"
            type="number"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <Button
            variant="contained"
            disabled={!productId || adding}
            onClick={async () => {
              const pid = Number(productId);
              if (Number.isFinite(pid) && pid > 0) {
                await addFav(pid);
                setProductId('');
              }
            }}
          >
            Adicionar
          </Button>
        </Stack>

        {favsLoading && <Typography>Carregando favoritos...</Typography>}
        {!favsLoading && (
          <Stack component="ul" sx={{ listStyle: 'none', p: 0 }}>
            {favs?.data?.length ? (
              favs.data.map((f) => (
                <Stack
                  key={f.product_id}
                  component="li"
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ py: 0.5 }}
                >
                  <Typography sx={{ minWidth: 120 }}>Produto #{f.product_id}</Typography>
                  <Button variant="outlined" onClick={() => removeFav(f.product_id)}>
                    Remover
                  </Button>
                </Stack>
              ))
            ) : (
              <Typography>Nenhum favorito</Typography>
            )}
          </Stack>
        )}
      </Box>
    </div>
  );
}
