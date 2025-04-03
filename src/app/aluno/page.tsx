'use client'
import { useAuth } from '../hooks/useAuth';
//import StudentCourses from '@/components/courses/StudentCourses';

export default function AlunoPage() {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user || user.role !== 'aluno') return <div>Acesso não autorizado</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Meus Cursos</h1>
      
    </div>
  );
}