import { render, screen } from '@testing-library/react';
import { SelectedCustomerProvider, useSelectedCustomer } from '@shared/customers/SelectedCustomerContext';

function ShowSelected() {
  const { selectedCustomerId } = useSelectedCustomer();
  return <div>Sel:{selectedCustomerId ?? 'none'}</div>;
}

describe('Selected customer persistence', () => {
  it('restores selection from localStorage', () => {
    localStorage.setItem('selected_customer', JSON.stringify({ id: 42, label: 'Alice <a@b.c>' }));
    render(
      <SelectedCustomerProvider>
        <ShowSelected />
      </SelectedCustomerProvider>
    );
    expect(screen.getByText('Sel:42')).toBeInTheDocument();
  });
});

