import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  name: string;
  email: string;
  role: string;
  sub: string;
  iat: number;
  exp: number;
  avatarUrl?: string; // 👈 Adicione isso
}

// Adicione esta função se não existir
export function decodeJWT(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

// Exporte outras funções úteis
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export function clearAuthToken(): void {
  localStorage.removeItem('authToken');
}