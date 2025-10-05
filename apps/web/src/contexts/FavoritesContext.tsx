import { createContext, useState, useEffect, ReactNode } from 'react'
import { getJson, postJson } from '../lib/api'

interface FavoritesContextType {
  favorites: Set<string>
  isLoading: boolean
  addFavorite: (eventId: string) => Promise<boolean>
  removeFavorite: (eventId: string) => Promise<boolean>
  toggleFavorite: (eventId: string) => Promise<boolean>
  isFavorited: (eventId: string) => boolean
  loadFavorites: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  // Load user's favorites on mount
  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setIsLoading(true)
      const response = await getJson<{ favorites: Array<{ event: { id: string } }> }>('/api/favorites?limit=1000')
      const favoriteIds = new Set(response.favorites.map(fav => fav.event.id))
      setFavorites(favoriteIds)
    } catch (error) {
      console.error('Failed to load favorites:', error)
      // Don't show error to user, just fail silently
    } finally {
      setIsLoading(false)
    }
  }

  const addFavorite = async (eventId: string): Promise<boolean> => {
    try {
      await postJson(`/api/favorites`, { eventId })
      setFavorites(prev => new Set([...prev, eventId]))
      return true
    } catch (error) {
      console.error('Failed to add favorite:', error)
      return false
    }
  }

  const removeFavorite = async (eventId: string): Promise<boolean> => {
    try {
      await postJson(`/api/favorites/${eventId}/toggle`, {})
      setFavorites(prev => {
        const newSet = new Set(prev)
        newSet.delete(eventId)
        return newSet
      })
      return true
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      return false
    }
  }

  const toggleFavorite = async (eventId: string): Promise<boolean> => {
    try {
      const response = await postJson<{ isFavorited: boolean }>(`/api/favorites/${eventId}/toggle`, {})
      
      setFavorites(prev => {
        const newSet = new Set(prev)
        if (response.isFavorited) {
          newSet.add(eventId)
        } else {
          newSet.delete(eventId)
        }
        return newSet
      })
      
      return true
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      return false
    }
  }

  const isFavorited = (eventId: string): boolean => {
    return favorites.has(eventId)
  }

  const value: FavoritesContextType = {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorited,
    loadFavorites
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

// Export the context for use in hooks
export { FavoritesContext }