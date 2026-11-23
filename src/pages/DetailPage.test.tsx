
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DetailPage } from './DetailPage';
import { obtenerCotizaciones } from '../Services/cryptoService';
import { useFavoritosStore } from '../favoritosStore';
import type { CryptoItem } from '../Types';

vi.mock('../Services/cryptoService', () => ({
  obtenerCotizaciones: vi.fn(),
}));

const bitcoin: CryptoItem = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  priceUsd: 95000,
  priceEur: 88000,
};

function renderDetalle(id = 'bitcoin') {
  return render(
    <MemoryRouter initialEntries={[`/criptomonedas/${id}`]}>
      <Routes>
        <Route path="/criptomonedas/:id" element={<DetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('DetailPage', () => {
  beforeEach(() => {
    localStorage.removeItem('pulso-abierto-favoritos');
    useFavoritosStore.setState({ favoritos: [] });
    vi.clearAllMocks();
  });

  it('muestra los datos de la criptomoneda encontrada', async () => {
    vi.mocked(obtenerCotizaciones).mockResolvedValue([bitcoin]);

    renderDetalle();

    expect(
      await screen.findByRole('heading', {
        name: /Detalle de: Bitcoin \(BTC\)/,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Precio en USD:/)).toBeInTheDocument();
    expect(screen.getByText(/Precio en EUR:/)).toBeInTheDocument();
  });

  it('permite agregar y quitar favoritos desde el detalle', async () => {
    vi.mocked(obtenerCotizaciones).mockResolvedValue([bitcoin]);

    const user = userEvent.setup();

    renderDetalle();

    const botonAgregar = await screen.findByRole('button', {
      name: /Agregar a favoritos/,
    });

    await user.click(botonAgregar);

    expect(
      screen.getByRole('button', { name: /Quitar de favoritos/ })
    ).toHaveAttribute('aria-pressed', 'true');

    expect(useFavoritosStore.getState().favoritos).toContain('bitcoin');

    await user.click(
      screen.getByRole('button', { name: /Quitar de favoritos/ })
    );

    expect(
      screen.getByRole('button', { name: /Agregar a favoritos/ })
    ).toHaveAttribute('aria-pressed', 'false');

    expect(useFavoritosStore.getState().favoritos).not.toContain('bitcoin');
  });

  it('muestra un error cuando la criptomoneda no existe', async () => {
    vi.mocked(obtenerCotizaciones).mockResolvedValue([bitcoin]);

    renderDetalle('dogecoin');

    expect(
      await screen.findByText(/La criptomoneda "dogecoin" no existe/)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /Volver al inicio/ })
    ).toBeInTheDocument();
  });
});
