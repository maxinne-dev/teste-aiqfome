import * as React from 'react';
import { Autocomplete, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { useCustomers } from '@modules/customers/hooks';
import { useSelectedCustomer } from '@shared/customers/SelectedCustomerContext';

type Option = { id: number; label: string };

export default function CustomerSelector({ collapsed }: { collapsed: boolean }) {
  const { selectedCustomerId, setSelectedCustomer } = useSelectedCustomer();
  const [input, setInput] = React.useState('');
  const [q, setQ] = React.useState('');
  const { data, isLoading } = useCustomers({ q: q || undefined, page: 1 });

  React.useEffect(() => {
    const t = setTimeout(() => setQ(input), 250);
    return () => clearTimeout(t);
  }, [input]);

  const options: Option[] = (data?.data ?? []).map((c) => ({ id: c.id, label: `${c.name} <${c.email}>` }));
  const value = options.find((o) => o.id === selectedCustomerId) ?? null;

  if (collapsed) {
    return (
      <Stack sx={{ p: 1 }} alignItems="center">
        <Typography variant="caption">Cliente</Typography>
        <Typography variant="caption" noWrap maxWidth={48} title={value?.label || 'Nenhum'}>
          {value ? `#${value.id}` : '-'}
        </Typography>
      </Stack>
    );
  }

  return (
    <Autocomplete
      sx={{ px: 2, py: 1 }}
      loading={isLoading}
      options={options}
      value={value}
      onChange={(_, v) => setSelectedCustomer(v ? { id: v.id, label: v.label } : null)}
      inputValue={input}
      onInputChange={(_, v) => setInput(v)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Selecionar cliente"
          placeholder="nome ou email"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading ? <CircularProgress color="inherit" size={16} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
}
