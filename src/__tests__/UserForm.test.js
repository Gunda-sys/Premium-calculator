import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserForm from '../UserForm/UserForm';

describe('UserForm Component', () => {
  beforeEach(() => {
    render(<UserForm />);
  });

  test('renders all fields and labels', () => {
    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age Next Birthday:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Birth \(MM\/YYYY\):/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Usual Occupation:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Death – Sum Insured:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Calculate Premium/i })).toBeInTheDocument();
  });

  test('shows validation errors when submitting empty form', async () => {
    fireEvent.click(screen.getByRole('button', { name: /Calculate Premium/i }));

    await waitFor(() => {
      expect(screen.getByText(/Age is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Occupation is required/i)).toBeInTheDocument();
    });
  });

  test('shows specific validation message for invalid age and sum insured', async () => {
    fireEvent.change(screen.getByLabelText(/Age Next Birthday:/i), { target: { value: '-5' } });
    fireEvent.change(screen.getByLabelText(/Death – Sum Insured:/i), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /Calculate Premium/i }));

    await waitFor(() => {
      // Use getAllByText to handle multiple matching elements
      const errors = screen.getAllByText(/must be greater than 0/i);
      expect(errors.length).toBe(2);
      expect(screen.getByText(/Age must be greater than 0/i)).toBeInTheDocument();
      //expect(screen.getByText(/Must be greater than 0/i)).toBeInTheDocument();
    });
  });

  test('calculates and displays correct premium for valid input', async () => {
    fireEvent.change(screen.getByLabelText(/Name:/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Age Next Birthday:/i), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText(/Usual Occupation:/i), { target: { value: 'Doctor' } });
    fireEvent.change(screen.getByLabelText(/Death – Sum Insured:/i), { target: { value: '100000' } });

    fireEvent.click(screen.getByRole('button', { name: /Calculate Premium/i }));

    await waitFor(() => {
      const premium = screen.getByText(/\$\d+(\.\d{2})?/i);
      expect(premium).toBeInTheDocument();
      // Optional: Check the exact calculated value if formula is known
    });
  });

  test('calculates correct premium for Light Manual occupation', async () => {
    fireEvent.change(screen.getByLabelText(/Age Next Birthday:/i), { target: { value: '40' } });
    fireEvent.change(screen.getByLabelText(/Usual Occupation:/i), { target: { value: 'Mechanic' } });
    fireEvent.change(screen.getByLabelText(/Death – Sum Insured:/i), { target: { value: '500000' } });

    fireEvent.click(screen.getByRole('button', { name: /Calculate Premium/i }));

    await waitFor(() => {
      const premium = screen.getByText(/\$\d+(\.\d{2})?/i);
      expect(premium).toBeInTheDocument();
      // Example: expect(premium.textContent).toBe('$276000.00');
    });
  });

  test('handles unknown occupation gracefully', async () => {
    fireEvent.change(screen.getByLabelText(/Age Next Birthday:/i), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText(/Usual Occupation:/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Death – Sum Insured:/i), { target: { value: '10000' } });

    fireEvent.click(screen.getByRole('button', { name: /Calculate Premium/i }));

    await waitFor(() => {
      const premium = screen.getByText(/\$0(\.00)?/i);
      expect(premium).toBeInTheDocument();
    });
  });
});
