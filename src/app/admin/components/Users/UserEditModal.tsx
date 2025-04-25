import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.css';
import { User } from '../../../types/user';

interface UserEditModalProps {
  user: User;
  onClose: () => void;
  onSave: () => void;
}

export const UserEditModal = ({ user, onClose, onSave }: UserEditModalProps) => {
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'admin' as 'admin' | 'professor' | 'aluno',
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === 'role' ? value as 'admin' | 'professor' | 'aluno' : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/auth/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar usuário');
      }

      onSave();
      onClose();
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
    }
  };

  if (!user) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Editar Usuário</h2>
          <span className={styles.userId}>ID: {user._id}</span>
          <button 
            className={styles.closeModal}
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.editForm}>
          <div className={styles.formSection}>
            <h3>Informações Básicas</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="name">Nome Completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editForm.name}
                onChange={handleFormChange}
                required
                className={styles.formInput}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Endereço de Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editForm.email}
                onChange={handleFormChange}
                required
                className={styles.formInput}
              />
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Configurações de Perfil</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="role">Tipo de Usuário</label>
              <select
                id="role"
                name="role"
                value={editForm.role}
                onChange={handleFormChange}
                required
                className={styles.formInput}
              >
                <option value="admin">Administrador</option>
                <option value="professor">Professor</option>
                <option value="aluno">Aluno</option>
              </select>
            </div>
          </div>
          
          <div className={styles.formFooter}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.saveButton}
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};