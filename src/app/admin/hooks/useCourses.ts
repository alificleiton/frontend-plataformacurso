import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  professorId: {
    _id: string;
    name: string;
    email: string;
  };
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filters, setFilters] = useState({
    search: '',
  });

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Token de autenticação não encontrado');
  
      const { search = '' } = filters;
      
      const url = new URL('http://localhost:3000/courses');
      if (search) {
        url.searchParams.append('search', search);
      }
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      if (!response.ok) {
        throw new Error('Erro ao buscar cursos');
      }
  
      const data = await response.json();
      const receivedCourses = Array.isArray(data.data) ? data.data : data;
      setCourses(receivedCourses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar cursos:', err);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.search]);

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir curso');
      }
      
      fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao excluir curso');
      console.error('Erro ao excluir curso:', err);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters(prev => ({ ...prev, search: value }));
    }, 300),
    []
  );

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    isLoading,
    error,
    selectedCourse,
    filters,
    setSelectedCourse,
    handleDeleteCourse,
    debouncedSearch,
    fetchCourses
  };
};