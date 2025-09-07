import * as React from 'react';
import { Alert, Box, Button, Container, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@shared/auth/AuthContext';
import { http } from '@shared/http/client';
import { env } from '@app/env';

export default function LoginPage() {
  const [users, setUsers] = React.useState<Array<{ id: number; name: string; email: string; isDefault?: boolean }>>([]);
  const [selectedEmail, setSelectedEmail] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [featureDisabled, setFeatureDisabled] = React.useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const redirectTo = sp.get('to') || '/';

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await http.get(`${env.apiBaseUrl}/v1/dev/users`);
        if (!mounted) return;
        const list = res.data?.users ?? [];
        setUsers(list);
        const def = list.find((u: any) => u.isDefault) || list[0];
        if (def) setSelectedEmail(def.email);
      } catch (e) {
        // If backend route disabled (feature flag off), show a warning.
        setFeatureDisabled(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {featureDisabled && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Rotas de autenticação de desenvolvimento estão desativadas. Habilite em backend/.env:
            FEATURE_DEV_AUTH_ROUTES=true e recarregue a API.
          </Alert>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Selecione um usuário para gerar um token e entrar.
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            (async () => {
              if (!selectedEmail) return;
              setLoading(true);
              try {
                const res = await http.post(`${env.apiBaseUrl}/v1/dev/token`, { email: selectedEmail });
                const token = res.data?.token as string;
                if (token) {
                  login(token);
                  navigate(redirectTo);
                }
              } finally {
                setLoading(false);
              }
            })();
          }}
        >
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="login-user-label">Usuário</InputLabel>
              <Select
                labelId="login-user-label"
                label="Usuário"
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                required
              >
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.email}>
                    {u.email}
                    {u.isDefault ? ' (default)' : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" disabled={!selectedEmail || loading || featureDisabled}>
              Entrar
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}
