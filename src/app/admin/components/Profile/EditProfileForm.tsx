import styles from './styles.module.css';
import { useProfile } from '../../hooks/useProfile';
import { useState } from 'react';

interface EditProfileFormProps {
  user: any;
  onClose: () => void; // Mudei de onCancel para onClose para ser mais claro
  onSuccess?: (updatedUser: any) => void;
}

export const EditProfileForm = ({
  user,
  onClose,
  onSuccess
}: EditProfileFormProps) => {
  const {
    profileForm,
    selectedImage,
    error,
    setSelectedImage,
    handleProfileFormChange,
    handleProfileUpdate,
    setError
  } = useProfile(user, onSuccess);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await handleProfileUpdate(e);
    } catch (err) {
      console.error('Erro no formulário:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const preview = document.querySelector(`.${styles.editProfileAvatar}`) as HTMLImageElement;
      if (preview) preview.src = imageUrl;
      setSelectedImage(file);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Botão X no canto superior direito da modal */}
        <button 
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Fechar formulário"
        >
          &times;
        </button>

        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.editProfileForm}>
          <div className={styles.profileImageSection}>
            <label htmlFor="avatarUpload">
              <img
                src={profileForm.imagem?.trim() || '/default-avatar.png'}
                alt="Avatar"
                className={styles.editProfileAvatar}
              />
              <span className={styles.changePhotoText}>Alterar foto</span>
            </label>
            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
          </div>

          <div className={styles.editProfileFields}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nome:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileForm.name}
                onChange={handleProfileFormChange}
                className={styles.editInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileFormChange}
                className={styles.editInput}
                required
                readOnly
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};