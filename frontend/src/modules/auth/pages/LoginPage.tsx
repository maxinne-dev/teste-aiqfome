import * as React from 'react';
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@shared/auth/AuthContext';

export default function LoginPage() {
  const [token, setToken] = React.useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const redirectTo = sp.get('to') || '/';

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Informe um token de acesso pessoal (Sanctum) com as abilities necessárias.
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (token.trim()) {
              login(token.trim());
              navigate(redirectTo);
            }
          }}
        >
          <Stack spacing={2}>
            <TextField
              label="Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="paste your token here"
              required
            />
            <Button type="submit" variant="contained">
              Entrar
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}

