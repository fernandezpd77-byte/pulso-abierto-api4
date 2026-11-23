import { Link } from 'react-router-dom';
import type { CryptoItem } from '../Types';
import { useFavoritosStore } from '../favoritosStore';

interface FavoritosSectionProps {
  criptos: CryptoItem[];
}

export function FavoritosSection({ criptos }: FavoritosSectionProps) {
  const favoritos = useFavoritosStore((state) => state.favoritos);

  const criptosFavoritas = criptos.filter((crypto) =>
    favoritos.includes(crypto.id)
  );

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <section
        style={{
          margin: '20px 0',
          padding: '15px',
          background: '#222',
          borderRadius: '8px',
          width: '420px',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        <h3 style={{ marginTop: 0, color: '#f5c542' }}>★ Mis favoritos</h3>

        {criptosFavoritas.length > 0 ? (
          criptosFavoritas.map((crypto) => (
            <Link
              key={crypto.id}
              to={`/criptomonedas/${crypto.id}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                color: '#ddd',
                textDecoration: 'none',
                borderBottom: '1px solid #444',
              }}
            >
              <span>
                <strong>{crypto.name}</strong>
                <span
                  style={{
                    marginLeft: '8px',
                    color: '#999',
                    fontSize: '0.85em',
                  }}
                >
                  {crypto.symbol}
                </span>
              </span>

              <span style={{ color: '#61dafb' }}>Ver detalle →</span>
            </Link>
          ))
        ) : (
          <p style={{ color: '#999', fontSize: '0.9em', marginBottom: 0 }}>
            Todavía no tenés favoritos. Agregá una criptomoneda usando la
            estrella de sus tarjetas.
          </p>
        )}
      </section>
    </div>
  );
}
