
import { describe, it, expect, vi, afterEach } from 'vitest';
import { obtenerCotizaciones } from './cryptoService';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('obtenerCotizaciones', () => {
  it('devuelve las cotizaciones cuando la respuesta es exitosa', async () => {
    const datosApi = {
      bitcoin: { usd: 65000, eur: 60000 },
      ethereum: { usd: 3000, eur: 2800 },
      solana: { usd: 150, eur: 140 },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => datosApi,
      })
    );

    const resultado = await obtenerCotizaciones();

    expect(resultado).toHaveLength(3);
    expect(resultado[0]).toMatchObject({
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      priceUsd: 65000,
      priceEur: 60000,
    });
  });

  it('devuelve un array vacío cuando la API no tiene datos', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      })
    );

    const resultado = await obtenerCotizaciones();

    expect(resultado).toEqual([]);
  });

  it('omite las criptomonedas que tienen cotizaciones incompletas', async () => {
    const datosApi = {
      bitcoin: { usd: 65000, eur: 60000 },
      ethereum: { usd: 3000 },
      solana: { eur: 140 },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => datosApi,
      })
    );

    const resultado = await obtenerCotizaciones();

    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe('bitcoin');
  });

  it('lanza un error cuando la respuesta HTTP no es exitosa', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({}),
      })
    );

    await expect(obtenerCotizaciones()).rejects.toThrow(
      'No se pudo conectar con el servidor de CoinGecko'
    );
  });
});
