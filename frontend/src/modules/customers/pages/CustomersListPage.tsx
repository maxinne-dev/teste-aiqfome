import * as React from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useCustomers } from '../hooks';

export default function CustomersListPage() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get('q') ?? '';
  const page = Number(sp.get('page') ?? '1');

  const { data, isLoading } = useCustomers({ q: q || undefined, page });

  const [localQ, setLocalQ] = React.useState(q);
  React.useEffect(() => setLocalQ(q), [q]);

  const applyFilters = () => {
    const next = new URLSearchParams(sp);
    if (localQ) next.set('q', localQ);
    else next.delete('q');
    next.set('page', '1');
    setSp(next, { replace: false });
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ my: 2 }}>
        <Typography variant="h4">Clientes</Typography>
        <Button component={RouterLink} to="/customers/new" variant="contained">
          Novo
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ my: 2 }}>
        <TextField
          label="Buscar"
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          placeholder="nome ou email"
        />
        <Button variant="outlined" onClick={applyFilters}>
          Buscar
        </Button>
      </Stack>

      {isLoading && <Typography>Carregando...</Typography>}

      {!isLoading && (
        <Table size="small" aria-label="customers-table">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data?.length ? (
              data.data.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link component={RouterLink} to={`/customers/${c.id}`} underline="hover">
                      {c.name}
                    </Link>
                  </TableCell>
                  <TableCell>{c.email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>Nenhum cliente encontrado</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}

