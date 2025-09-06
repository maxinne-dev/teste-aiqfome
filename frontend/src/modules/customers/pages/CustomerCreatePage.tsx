import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import { CustomerForm } from '../components/CustomerForm';
import { useCreateCustomer } from '../hooks';

export default function CustomerCreatePage() {
  const { mutateAsync, isPending } = useCreateCustomer();
  const navigate = useNavigate();

  return (
    <div>
      <Typography variant="h4" sx={{ my: 2 }}>
        Novo Cliente
      </Typography>
      <CustomerForm
        initial={{ name: '', email: '' }}
        submitLabel={isPending ? 'Salvando...' : 'Salvar'}
        onSubmit={async (values) => {
          await mutateAsync(values);
          navigate('/customers');
        }}
      />
    </div>
  );
}

