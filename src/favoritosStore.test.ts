
import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoritosStore } from './favoritosStore';

describe('favoritosStore', () => {
  beforeEach(() => {
    useFavoritosStore.setState({ favoritos: [] });
  });

  it('agrega una criptomoneda a favoritos', () => {
    useFavoritosStore.getState().alternarFavorito('bitcoin');

    expect(useFavoritosStore.getState().favoritos).toContain('bitcoin');
  });

  it('quita una criptomoneda que ya estaba en favoritos', () => {
    useFavoritosStore.setState({ favoritos: ['bitcoin'] });

    useFavoritosStore.getState().alternarFavorito('bitcoin');

    expect(useFavoritosStore.getState().favoritos).not.toContain('bitcoin');
  });

  it('permite guardar varias criptomonedas como favoritas', () => {
    const { alternarFavorito } = useFavoritosStore.getState();

    alternarFavorito('bitcoin');
    alternarFavorito('ethereum');
    alternarFavorito('solana');

    expect(useFavoritosStore.getState().favoritos).toEqual([
      'bitcoin',
      'ethereum',
      'solana',
    ]);
  });
   it('persiste y recupera los favoritos desde localStorage', async () => {
    const { alternarFavorito } = useFavoritosStore.getState();

    alternarFavorito('bitcoin');
    alternarFavorito('ethereum');

    const datosGuardados = localStorage.getItem(
      'pulso-abierto-favoritos'
    );

    expect(datosGuardados).not.toBeNull();

    const favoritosGuardados = JSON.parse(datosGuardados!).state.favoritos;

    expect(favoritosGuardados).toEqual(['bitcoin', 'ethereum']);

    // Simulamos que el estado en memoria se perdió.
    useFavoritosStore.setState({ favoritos: [] });

    // Recuperamos los datos guardados.
    localStorage.setItem('pulso-abierto-favoritos', datosGuardados!);
    await useFavoritosStore.persist.rehydrate();

    expect(useFavoritosStore.getState().favoritos).toEqual([
      'bitcoin',
      'ethereum',
    ]);
  });
});

