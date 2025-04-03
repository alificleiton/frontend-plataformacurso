'use client'
import { useAuth } from '../hooks/useAuth';
//import AdminDashboard from '@/components/dashboard/AdminDashboard';

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user || user.role !== 'admin') return <div>Acesso não autorizado</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Painel Administrativo</h1>
      
    </div>
  );
}