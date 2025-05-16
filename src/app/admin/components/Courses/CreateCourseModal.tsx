import { useEffect, useState } from 'react';
import styles from './CreateCourseModal.module.css';
import { decodeJWT } from '../../../lib/auth';

interface DecodedToken {
  name: string;
  email: string;
  role: string;
  sub: string;
  iat: number;
  exp: number;
  avatarUrl?: string; // 👈 Adicione isso
}

// Exporte outras funções úteis
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export function clearAuthToken(): void {
  localStorage.removeItem('authToken');
}

interface CreateCourseModalProps {
  onClose: () => void;
  onSuccess: () => void;
}


export const CreateCourseModal = ({ onClose, onSuccess }: CreateCourseModalProps) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    modules: [], // se quiser selecionar múltiplos módulos
    professorId: '', // vamos pegar esse do login
    image: null as File | null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('http://localhost:3000/categories'); // adapte conforme necessário
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
        const decoded = decodeJWT(token);
        if (decoded?.role === 'professor' || decoded?.role === 'admin') {
        setFormData(prev => ({
            ...prev,
            professorId: decoded.sub, // 👈 sub = ID do professor
        }));
        }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    


    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('price', formData.price);
    payload.append('categoryId', formData.categoryId);
    payload.append('professorId', formData.professorId);
    if (formData.image) payload.append('thumbnail', formData.image);
    payload.append('modules', '');

    

    const token = localStorage.getItem('authToken');
    const res = await fetch(`http://localhost:3000/courses/with-thumbnail`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`
      },
      body: payload,
    });

    if (res.ok) {
      onSuccess();
      onClose();
    } else {
      alert('Erro ao criar curso');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Criar Novo Curso</h2>
        <form onSubmit={handleSubmit}>
          
          <input name="title" placeholder="Nome do curso" onChange={handleChange} required />
          <textarea name="description" placeholder="Descrição" onChange={handleChange} required />
          <input name="price" type="number" placeholder="Preço" onChange={handleChange} required />

          <select name="categoryId" onChange={handleChange} required>
            <option value="">Selecione a categoria</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input type="file" accept="image/*" onChange={handleImageChange} required />

          <div className={styles.buttons}>
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};