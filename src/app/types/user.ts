// types/user.ts
export type User = {
    userId: string;
    email: string;
    name?: string; // Opcional
    role: 'admin' | 'professor' | 'aluno';
    exp?: number; // Timestamp de expiração
    iat?: number; // Timestamp de emissão
    avatarUrl?: string; // 👈 Adicione isso
  };