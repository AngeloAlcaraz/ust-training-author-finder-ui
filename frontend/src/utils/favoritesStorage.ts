const FAVORITES_KEY = 'favorite_authors'

export const loadFavorites = (): Set<string> => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch {
    return new Set()
  }
}

export const saveFavorites = (favorites: Set<string>) => {
  try {
    const array = Array.from(favorites)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(array))
  } catch {
    
  }
}
