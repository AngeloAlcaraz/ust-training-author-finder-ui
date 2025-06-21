import { toast } from 'react-toastify'

const API_BASE = 'http://13.221.227.133:4000/api/v1'

export const fetchWithAuth = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
  const accessToken = localStorage.getItem('accessToken')

  const authInit: RequestInit = {
    ...init,
    headers: {
      ...(init?.headers || {}),
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }

  let response = await fetch(input, authInit)

  // Si está expirado el token, intenta hacer refresh
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken')

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            'Content-Type': 'application/json',
          },
        })

        if (!refreshResponse.ok) throw new Error('Refresh failed')

        const result = await refreshResponse.json()
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result.data

        localStorage.setItem('accessToken', newAccessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Retry original request con el nuevo token
        const retryInit: RequestInit = {
          ...init,
          headers: {
            ...(init?.headers || {}),
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json',
          },
        }

        response = await fetch(input, retryInit)
      } catch (error) {
        toast.error('Session expired. Please log in again.')
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(error instanceof Error ? error : new Error(String(error)))
      }
    }
  }

  return response
}
