import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  role?: string;
  exp?: number;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;

  // Páginas públicas que não requerem autenticação
  const publicPaths = ['/login', '/register', '/api/auth'];
  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Verifica se o token existe
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Decodifica o token
    const decoded = jwtDecode<JWTPayload>(token);

    // Verifica se o token está expirado
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      throw new Error('Token expirado');
    }

    // Proteção baseada em roles
    const { pathname } = request.nextUrl;

    // Rotas de admin
    if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Rotas de professor
    if (pathname.startsWith('/professor') && decoded.role !== 'professor') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Rotas de aluno
    if (pathname.startsWith('/aluno') && decoded.role !== 'aluno') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    // Remove cookie inválido e redireciona
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('authToken');
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/professor/:path*', '/aluno/:path*'],
};