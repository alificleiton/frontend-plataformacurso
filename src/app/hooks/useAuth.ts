'use client'
import { useEffect, useState } from 'react';
import { decodeJWT, getStoredToken } from '../lib/auth';

export function useAuth() {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    
    if (!token) {
      setLoading(false);
      return;
    }

    const decoded = decodeJWT(token);
    if (decoded) {
      setUser(decoded);
    } else {
      // Token inválido - limpa o storage
      localStorage.removeItem('authToken');
    }
    
    setLoading(false);
  }, []);

  return { user, loading };
}

// Adicione a interface se não estiver em outro arquivo
interface DecodedToken {
  name: string;
  email: string;
  role: string;
  sub: string;
  iat: number;
  exp: number;
}