'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { decodeJWT } from "@/app/lib/auth";

export default function GoogleCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const authenticateWithBackend = async () => {
      if (status === "authenticated" && session?.user?.email && session?.user?.name) {
        try {
          const response = await fetch('http://localhost:3000/auth/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            localStorage.setItem('authToken', data.accessToken);

            const decoded = decodeJWT(data.accessToken);

            if (decoded?.role === 'admin') {
              router.push('/admin');
            } else if (decoded?.role === 'professor') {
              router.push('/professor');
            } else {
              router.push('/aluno');
            }
          } else {
            alert(data.message || 'Erro ao logar com Google');
            router.push('/login');
          }
        } catch (err) {
          console.error(err);
          router.push('/login');
        }
      }
    };

    authenticateWithBackend();
  }, [session, status, router]);

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>Carregando...</h2>
      <p>Verificando login com Google</p>
    </div>
  );
}