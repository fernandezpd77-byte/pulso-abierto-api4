
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CryptoCard } from './Cryptocard';
import { useFavoritosStore } from '../favoritosStore';
import type { CryptoItem } from '../Types';

const bitcoin: CryptoItem = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  priceUsd: 95000,
  priceEur: 88000,
};

describe('CryptoCard', () => {
  beforeEach(() => {
    localStorage.removeItem('pulso-abierto-favoritos');
    useFavoritosStore.setState({ favoritos: [] });
  });

  it('muestra los datos de la criptomoneda', () => {
    render(
      <MemoryRouter>
        <CryptoCard crypto={bitcoin} monedaActiva="USD" />
      </MemoryRouter>
    );

    expect(screen.getByText('Bitcoin (BTC)')).toBeInTheDocument();
    expect(screen.getByText(/Precio \(USD\):/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver detalle' }))
      .toHaveAttribute('href', '/criptomonedas/bitcoin');
  });

  it('agrega y quita una criptomoneda de favoritos', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CryptoCard crypto={bitcoin} monedaActiva="USD" />
      </MemoryRouter>
    );

    const botonAgregar = screen.getByRole('button', {
      name: /Agregar a favoritos/,
    });

    expect(botonAgregar).toHaveAttribute('aria-pressed', 'false');

    await user.click(botonAgregar);

    const botonQuitar = screen.getByRole('button', {
      name: /Quitar de favoritos/,
    });

    expect(botonQuitar).toHaveAttribute('aria-pressed', 'true');
    expect(useFavoritosStore.getState().favoritos).toContain('bitcoin');

    await user.click(botonQuitar);

    expect(
      screen.getByRole('button', { name: /Agregar a favoritos/ })
    ).toHaveAttribute('aria-pressed', 'false');

    expect(useFavoritosStore.getState().favoritos).not.toContain('bitcoin');
  });

  it('muestra el precio en euros cuando corresponde', () => {
    render(
      <MemoryRouter>
        <CryptoCard crypto={bitcoin} monedaActiva="EUR" />
      </MemoryRouter>
    );

    expect(screen.getByText(/Precio \(EUR\):/)).toBeInTheDocument();
    expect(screen.getByText(/€88\.000/)).toBeInTheDocument();
  });
});
