import type { SignUpRequest, SignUpResponse } from '../types/authTypes'
import { toast } from 'react-toastify'

const API_URL = 'http://13.221.227.133:4000/api/v1/auth'  // URL directa al backend

/**
 * Función para registrar un nuevo usuario
 */
export const signup = async (userData: SignUpRequest): Promise<SignUpResponse> => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    let result: SignUpResponse

    try {
      result = await response.json()
    } catch {
      throw new Error('Invalid JSON response from server.')
    }

    if (!response.ok) {
      const errorMessage = result.message || 'Registration failed'
      toast.error(`❌ ${errorMessage}`)
      throw new Error(errorMessage)
    }

    toast.success('✅ Registration successful!')

    const { accessToken, refreshToken, email } = result.data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    if (email) {
      localStorage.setItem('userEmail', email)
    } else {
      localStorage.setItem('userEmail', 'unknown_user')
    }

    return result

  } catch (error: any) {
    const errorMessage = error.message ?? 'Something went wrong. Please try again.'
    toast.error(`❌ ${errorMessage}`)
    throw new Error(errorMessage)
  }
}


/**
 * Función para cerrar sesión del usuario
 */
export const logout = async (): Promise<void> => {
  const token = localStorage.getItem('accessToken')

  if (!token) {
    throw new Error('No access token found.')
  }

  const response = await fetch(`${API_URL}/logout`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const result = await response.json()
    throw new Error(result.message ?? 'Logout failed')
  }

  toast.info('👋 You have been logged out.')
}
