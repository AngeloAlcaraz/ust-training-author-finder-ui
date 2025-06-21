import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'

interface FavoritesContextType {
  favorites: Set<string>
  toggleFavorite: (key: string) => Promise<void>
  isFavorite: (key: string) => boolean
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadFavorites = async () => {
      const userEmail = localStorage.getItem('userEmail') ?? ''
      console.log('userEmail from localStorage:', userEmail);
      const token = localStorage.getItem('accessToken') ?? ''
      if (!userEmail || !token) return

      try {
        const res = await fetch(`http://13.221.227.133:4000/api/v1/favorites/${userEmail}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error('Failed to load favorites')

        const result = await res.json()
        const favoritesArray = result.data

        if (!Array.isArray(favoritesArray)) {
          console.error('La propiedad "data" no es un array:', favoritesArray)
          return
        }

        const keys = favoritesArray.map((fav: any) => `/authors/${fav.authorId}`)
        setFavorites(new Set(keys))
        localStorage.setItem('favorites', JSON.stringify(keys))
      } catch (error) {
        console.error('Error loading favorites', error)
      }
    }

    loadFavorites()
  }, [])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)))
  }, [favorites])

  const isFavorite = useCallback((key: string) => favorites.has(key), [favorites])

  const removeFavorite = useCallback(
    async (key: string, userEmail: string, token: string | null, authorId: string) => {
      if (token) {
        try {
          const res = await fetch(
            `http://13.221.227.133:4000/api/v1/favorites/${userEmail}/${authorId}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          if (!res.ok) {
            throw new Error('Failed to remove favorite')
          }
        } catch (error) {
          console.error(error)
          throw error
        }
      }
      setFavorites((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    },
    []
  )

  const addFavorite = useCallback(
    async (key: string, userEmail: string, token: string | null, authorId: string) => {
      if (favorites.has(key)) {
        console.log('El favorito ya existe.');
        return; // No intentar agregar si ya existe
      }

      try {
        const res = await fetch(`https://openlibrary.org/authors/${authorId}.json`)
        if (!res.ok) throw new Error('Failed to fetch author data')
        const authorData = await res.json()

        const payload: Record<string, any> = {
          authorId,
          name: authorData.name,
          addedBy: userEmail,
          addedAt: new Date().toISOString(),
        }

        if (authorData.photos?.length) {
          payload.imageUrl = `https://covers.openlibrary.org/b/id/${authorData.photos[0]}-M.jpg`
        }

        if (authorData.birth_date) {
          payload.birthDate = authorData.birth_date
        }

        if (authorData.death_date) {
          payload.deathDate = authorData.death_date
        }

        if (authorData.top_work) {
          payload.topWork = authorData.top_work
        }

        const apiRes = await fetch('http://13.221.227.133:4000/api/v1/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        if (!apiRes.ok) {
          const errorData = await apiRes.json()
          throw new Error(errorData.message ?? 'Failed to add favorite')
        }

        setFavorites((prev) => new Set(prev).add(key)) // Actualiza el estado local
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    [favorites] // Asegúrate de que 'favorites' esté actualizado
  )


  const toggleFavorite = useCallback(
    async (key: string) => {
      const currentlyFavorite = favorites.has(key)
      const userEmail = localStorage.getItem('userEmail') ?? 'unknown_user'
      const token = localStorage.getItem('accessToken')
      const authorId = key.replace('/authors/', '')

      if (currentlyFavorite) {
        await removeFavorite(key, userEmail, token, authorId)
        return
      }

      await addFavorite(key, userEmail, token, authorId)
    },
    [favorites, removeFavorite, addFavorite]
  )

  const contextValue = useMemo(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite,
    }),
    [favorites, toggleFavorite, isFavorite]
  )

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
