// services/LoginService.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  userId: string;
  name: string;
  email: string;
  gender: string;
}

export interface LoginResponse {
  message: string;
  data: LoginResponseData;
}

const API_URL = 'http://13.221.227.133:4000/api/v1/auth';

export class LoginService {
  static async signin(userData: LoginRequest): Promise<LoginResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errData = await response.json();
          errorMessage = errData.message ?? errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
