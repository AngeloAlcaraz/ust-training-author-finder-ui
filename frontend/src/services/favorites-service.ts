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

    // Verificar que el email del usuario es el correcto
    console.log('User email passed to addFavorite:', userEmail); // Agregar un log para verificar el email

    // Crear el objeto con el `addedBy` correcto
    const requestPayload = { ...favorite, addedBy: userEmail };

    // Verificar que `addedBy` está correctamente incluido en el objeto
    console.log('Request payload to send:', requestPayload);  // Imprimir el objeto antes de enviarlo

    const response = await axios.post<FavoriteAuthorResponse>(
      API_BASE_URL,
      requestPayload, // Asegúrate de que addedBy esté correctamente agregado
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
      }
    )

    // Verificar la respuesta de la API
    console.log('API Response:', response.data);

    return response.data
  },

  // Obtener favoritos usando el email del usuario autenticado
  async getFavorites(userEmail: string): Promise<FavoriteAuthorResponse[]> {
    const token = localStorage.getItem('accessToken')

    if (!userEmail) {
      throw new Error('User email not found.')
    }

    const response = await axios.get<{ data: FavoriteAuthorResponse[] }>(
      `${API_BASE_URL}/${userEmail}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    )

    // Log para ver la respuesta completa de la API
    console.log('API Response:', response.data)

    // Validamos que "data" sea un array
    if (!Array.isArray(response.data.data)) {
      console.warn('API returned invalid favorites data structure:', response.data)
      return [] // Evita romper la UI
    }

    return response.data.data
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
