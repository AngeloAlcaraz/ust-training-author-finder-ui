export interface SignUpRequest {
  name: string
  email: string
  password: string
  gender?: string
}

export interface SignUpResponse {
  message: string
  data: {
    userId: string
    name: string
    email: string
    gender: string
    accessToken: string
    refreshToken: string
  }
}