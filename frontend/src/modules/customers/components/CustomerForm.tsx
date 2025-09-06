import * as React from 'react';
import { TextField, Button, Stack } from '@mui/material';

export interface CustomerFormValues {
  name: string;
  email: string;
}

export function CustomerForm({
  initial,
  onSubmit,
  submitLabel = 'Salvar'
}: {
  initial: CustomerFormValues;
  onSubmit: (values: CustomerFormValues) => void | Promise<void>;
  submitLabel?: string;
}) {
  const [values, setValues] = React.useState<CustomerFormValues>(initial);

  React.useEffect(() => setValues(initial), [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
    >
      <Stack spacing={2} sx={{ my: 2 }}>
        <TextField
          label="Nome"
          name="name"
          value={values.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained">
          {submitLabel}
        </Button>
      </Stack>
    </form>
  );
}

