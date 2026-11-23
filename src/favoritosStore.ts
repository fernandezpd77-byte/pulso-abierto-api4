
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritosState {
  favoritos: string[];
  alternarFavorito: (id: string) => void;
}

export const useFavoritosStore = create<FavoritosState>()(
  persist(
    (set) => ({
      favoritos: [],

      alternarFavorito: (id) =>
        set((state) => ({
          favoritos: state.favoritos.includes(id)
            ? state.favoritos.filter((favorito) => favorito !== id)
            : [...state.favoritos, id],
        })),
    }),
    {
      name: 'pulso-abierto-favoritos',
      partialize: (state) => ({
        favoritos: state.favoritos,
      }),
    }
  )
);

