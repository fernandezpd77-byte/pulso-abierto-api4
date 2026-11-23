
import type { CryptoItem } from '../Types';

// Estructura esperada de cada cotización de CoinGecko
interface CotizacionApi {
  usd?: number;
  eur?: number;
}

// Función encargada de consultar y transformar los datos de la API
export async function obtenerCotizaciones(): Promise<CryptoItem[]> {
  const url =
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd,eur';

  const response = await fetch(url);

  // Comprobamos si la respuesta HTTP fue exitosa
  if (!response.ok) {
    throw new Error('No se pudo conectar con el servidor de CoinGecko');
  }

  // Procesamos la respuesta JSON
  const data: Record<string, CotizacionApi | undefined> =
    await response.json();

  // Definimos las criptomonedas que queremos consultar
  const monedas = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
  ] as const;

  // Transformamos únicamente las cotizaciones que tienen datos válidos
  const items: CryptoItem[] = monedas.flatMap((moneda) => {
    const cotizacion = data[moneda.id];

    if (
      typeof cotizacion?.usd !== 'number' ||
      !Number.isFinite(cotizacion.usd) ||
      typeof cotizacion?.eur !== 'number' ||
      !Number.isFinite(cotizacion.eur)
    ) {
      return [];
    }

    return [
      {
        ...moneda,
        priceUsd: cotizacion.usd,
        priceEur: cotizacion.eur,
      },
    ];
  });

  return items;
}
