import { useContext, useState, useEffect } from 'react';
import { FavoritesContext } from '../contexts/FavoritesContext';

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

// Hook for optimistic UI updates
export function useOptimisticFavorites() {
  const { favorites, toggleFavorite } = useFavorites();
  const [optimisticFavorites, setOptimisticFavorites] =
    useState<Set<string>>(favorites);

  useEffect(() => {
    setOptimisticFavorites(favorites);
  }, [favorites]);

  const optimisticToggle = async (eventId: string) => {
    // Optimistically update UI
    setOptimisticFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });

    try {
      await toggleFavorite(eventId);
    } catch (error) {
      // Revert on error
      setOptimisticFavorites(favorites);
      throw error;
    }
  };

  return {
    favorites: optimisticFavorites,
    toggleFavorite: optimisticToggle,
    isFavorited: (eventId: string) => optimisticFavorites.has(eventId),
  };
}
