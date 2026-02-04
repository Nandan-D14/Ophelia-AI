import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CartPage from '@/pages/CartPage';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/contexts/AuthContext');
vi.mock('@/lib/supabase');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockUser = { id: 'user-123' };

const mockCartData = {
  cart: { id: 'cart-1', user_id: 'user-123', created_at: '', updated_at: '' },
  items: [
    { id: 'item-1', product_id: 'prod-1', product_name: 'Product 1', product_image: null, price_at_addition: 10, quantity: 2 },
    { id: 'item-2', product_id: 'prod-2', product_name: 'Product 2', product_image: null, price_at_addition: 20, quantity: 1 },
  ],
  total: 40,
  itemCount: 3,
};

describe('CartPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({ data: mockCartData, error: null });
  });

  it('should display loading state initially', () => {
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should display cart items when data is loaded', async () => {
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  it('should display empty cart message when cart is empty', async () => {
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({ data: { cart: null, items: [], total: 0, itemCount: 0 }, error: null });
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });
  });

  it('should display error message when loading fails', async () => {
    (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error('Failed to load cart'));
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Failed to load cart. Please try again.')).toBeInTheDocument();
    });
  });

  it('should allow quantity increase', async () => {
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    const increaseButton = screen.getAllByRole('button', { name: /plus/i })[0];
    fireEvent.click(increaseButton);

    await waitFor(() => {
        expect(supabase.functions.invoke).toHaveBeenCalledWith('cart-manager', {
            body: { action: 'update', productId: 'prod-1', quantity: 3 }
        });
    });
  });

  it('should allow quantity decrease', async () => {
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    const decreaseButton = screen.getAllByRole('button', { name: /minus/i })[0];
    fireEvent.click(decreaseButton);

    await waitFor(() => {
        expect(supabase.functions.invoke).toHaveBeenCalledWith('cart-manager', {
            body: { action: 'update', productId: 'prod-1', quantity: 1 }
        });
    });
  });

  it('should remove item when quantity becomes 0', async () => {
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    await waitFor(() => {
        expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    const decreaseButton = screen.getAllByRole('button', { name: /minus/i })[1];
    fireEvent.click(decreaseButton);

    await waitFor(() => {
        expect(supabase.functions.invoke).toHaveBeenCalledWith('cart-manager', {
            body: { action: 'remove', productId: 'prod-2' }
        });
    });
  });

  it('should allow item removal', async () => {
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    const removeButton = screen.getAllByRole('button', { name: /trash/i })[0];
    fireEvent.click(removeButton);

    await waitFor(() => {
        expect(supabase.functions.invoke).toHaveBeenCalledWith('cart-manager', {
            body: { action: 'remove', productId: 'prod-1' }
        });
    });
  });

  it('should rollback quantity on failed update', async () => {
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    // Ensure the quantity is initially 2
    expect(screen.getByText('2')).toBeInTheDocument();

    (supabase.functions.invoke as jest.Mock).mockRejectedValueOnce(new Error('Update failed'));

    const increaseButton = screen.getAllByRole('button', { name: /plus/i })[0];
    fireEvent.click(increaseButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to update quantity. Please try again.')).toBeInTheDocument();
    });

    // Check that the quantity rolled back to 2
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should navigate to checkout on Proceed button click', async () => {
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
    fireEvent.click(checkoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });
});
