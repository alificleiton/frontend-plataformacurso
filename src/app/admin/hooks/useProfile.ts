import { useState } from 'react';
import { User } from '../../types/user';

export const useProfile = (initialUser: User, onSuccess?: (updatedUser: User) => void) => {
  const [profileForm, setProfileForm] = useState({
    name: initialUser.name || '',
    email: initialUser.email || '',
    imagem: initialUser.avatarUrl || '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value,
    });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const formData = new FormData();
      formData.append('name', profileForm.name);
      formData.append('email', profileForm.email);
      
      if (selectedImage) {
        formData.append('avatar', selectedImage);
      }
  
      const response = await fetch(`http://localhost:3000/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar perfil');
      }

      const updatedUser = await response.json();
      
      // Chama a função de sucesso se existir
      if (onSuccess) {
        onSuccess(updatedUser);
      }
      
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao atualizar perfil');
      console.error('Erro ao atualizar perfil:', err);
      throw err;
    }
  };

  return {
    profileForm,
    selectedImage,
    error,
    setSelectedImage,
    handleProfileFormChange,
    handleProfileUpdate,
    setError
  };
};