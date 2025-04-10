import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFavoritesStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),
      isFavorite: (itemId) => {
        const state = useFavoritesStore.getState();
        return state.items.some((item) => item.id === itemId);
      },
      clearFavorites: () => set({ items: [] }),
    }),
    {
      name: 'favorites-storage',
    }
  )
);

export default useFavoritesStore; 