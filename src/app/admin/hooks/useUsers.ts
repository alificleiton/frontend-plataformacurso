import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { User } from '../../types/user';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
      page: 1,
      pages: 1,
      limit: 10,
      total: 0
    });
    const [filters, setFilters] = useState({
      search: '',
      role: ''
    });
    const [editingUser, setEditingUser] = useState<User | null>(null);
  

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Token não encontrado');
  
      const { page, limit } = pagination;
      const { search, role } = filters;
      
      const response = await fetch(
        `http://localhost:3000/auth/users?page=${page}&limit=${limit}&search=${search}&role=${role}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar usuários');
      }
      
      const data = await response.json();
      
      setUsers(data.data);
      setPagination({
        ...pagination,
        total: data.total,
        pages: data.pages,
      });
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar usuários');
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, filters.search, filters.role]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir usuário');
      }
      
      fetchUsers();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao excluir usuário');
      console.error('Erro ao excluir usuário:', err);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters((prev) => ({ ...prev, search: value }));
    }, 300),
    []
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    pagination,
    filters,
    editingUser,
    setPagination,
    setFilters,
    setEditingUser,
    handleDeleteUser,
    debouncedSearch,
    fetchUsers
  };
};