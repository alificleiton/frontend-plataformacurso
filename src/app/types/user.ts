// types/user.ts
export interface User {
  _id: string;
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'professor' | 'aluno';
  createdAt: string;
  avatarUrl?: string;
  exp?: number;
  iat?: number;
}