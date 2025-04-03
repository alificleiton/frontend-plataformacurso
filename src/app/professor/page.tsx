'use client'
import { useAuth } from '../hooks/useAuth';
//import ProfessorCourses from '@/components/courses/ProfessorCourses';

export default function ProfessorPage() {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user || user.role !== 'professor') return <div>Acesso não autorizado</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bem-vindo, Professor {user.name}</h1>
      
    </div>
  );
}