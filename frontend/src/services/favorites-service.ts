import axios from 'axios'

const API_BASE_URL = 'http://13.221.227.133:4000/api/v1/favorites'

export interface FavoriteAuthorPayload {
  authorId: string
  name: string
  imageUrl: string
  birthDate: string
  deathDate?: string
  topWork?: string
  addedBy: string  // Aquí se espera el email correcto
  addedAt: string
}

export interface FavoriteAuthorResponse extends FavoriteAuthorPayload {
  id: string
}

export const FavoritesService = {
  // Ahora se requiere el email del usuario como argumento
  async addFavorite(favorite: FavoriteAuthorPayload, userEmail: string): Promise<FavoriteAuthorResponse> {
    const token = localStorage.getItem('accessToken') // Token para Authorization header

    const response = await axios.post<FavoriteAuthorResponse>(
      API_BASE_URL,
      { ...favorite, addedBy: userEmail }, // Se pasa el email recibido como argumento
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    )
    return response.data
  },

  // Obtener favoritos usando el email del usuario autenticado
  async getFavorites(userEmail: string): Promise<FavoriteAuthorResponse[]> {
    const token = localStorage.getItem('accessToken')

    if (!userEmail) {
      throw new Error('User email not found.')
    }

    const response = await axios.get<FavoriteAuthorResponse[]>(
      `${API_BASE_URL}/${userEmail}`, // Usar el email recibido como argumento
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    )
    return response.data
  },

  async removeFavorite(authorId: string, userEmail: string): Promise<void> {
    const token = localStorage.getItem('accessToken')

    if (!userEmail) {
      throw new Error('User email not found.')
    }

    await axios.delete(
      `${API_BASE_URL}/${userEmail}/${authorId}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    )
  }
}
