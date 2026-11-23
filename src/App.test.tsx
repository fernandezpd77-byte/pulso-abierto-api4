
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';
import { obtenerCotizaciones } from './Services/cryptoService';
import { useFavoritosStore } from './favoritosStore';
import type { CryptoItem } from './Types';

vi.mock('./Services/cryptoService', () => ({
  obtenerCotizaciones: vi.fn(),
}));

const cotizaciones: CryptoItem[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    priceUsd: 65000,
    priceEur: 60000,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    priceUsd: 3000,
    priceEur: 2800,
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    priceUsd: 150,
    priceEur: 140,
  },
];

const renderApp = () =>
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useFavoritosStore.setState({ favoritos: [] });
});

describe('App', () => {
  it('muestra las criptomonedas cuando la consulta es exitosa', async () => {
    vi.mocked(obtenerCotizaciones).mockResolvedValue(cotizaciones);

    renderApp();

    expect(await screen.findByText(/Bitcoin/i)).toBeInTheDocument();
    expect(screen.getByText(/Ethereum/i)).toBeInTheDocument();
  });

  it('muestra un mensaje cuando no hay cotizaciones', async () => {
    vi.mocked(obtenerCotizaciones).mockResolvedValue([]);

    renderApp();

    expect(
      await screen.findByText(/No se encontraron criptomonedas disponibles/i)
    ).toBeInTheDocument();
  });

  it('permite reintentar la consulta después de un error', async () => {
    const user = userEvent.setup();

    vi.mocked(obtenerCotizaciones)
      .mockRejectedValueOnce(new Error('Error de conexión simulado'))
      .mockResolvedValueOnce(cotizaciones);

    renderApp();

    expect(
      await screen.findByText(/Error de conexión simulado/i)
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /Reintentar consulta/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/Bitcoin/i)).toBeInTheDocument();
    });

    expect(obtenerCotizaciones).toHaveBeenCalledTimes(2);
  });
});

