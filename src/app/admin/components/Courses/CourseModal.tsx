import { useState } from 'react';
import { FiX, FiUser, FiCalendar, FiBook, FiEdit2, FiTrash2, FiSave } from 'react-icons/fi';
import styles from './styles.module.css';
import { Course } from '../../../types/course';

interface CourseModalProps {
  course: Course;
  onClose: () => void;
  onSuccess: () => void;
  onDelete?: () => void; // ← Adicionado aqui
}

export const CourseModal = ({
  course,
  onClose,
  onSuccess
}: CourseModalProps) => {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [price, setPrice] = useState(course.price);
  const [isSaving, setIsSaving] = useState(false);

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const handleUpdate = async () => {
    setIsSaving(true);
    const token = localStorage.getItem('authToken');
    const payload = new FormData();
    payload.append('title', title);
    payload.append('description', description);
    payload.append('price', price.toString());
    if (thumbnail) {
      payload.append('thumbnail', thumbnail); // nome tem que bater com o FileInterceptor
    }

    try {
      const res = await fetch(`http://localhost:3000/courses/${course._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Não defina o Content-Type aqui!
        },
        body: payload,
      });

      if (res.ok) {
        alert('Curso atualizado com sucesso!');
        onSuccess();
        onClose();
      } else {
        const errData = await res.json();
        console.error('Erro na resposta da API:', errData);
        alert(`Erro ao atualizar curso: ${errData.message || 'Erro desconhecido'}`);
      }
    } catch (error: any) {
      console.error('Erro inesperado ao atualizar:', error.message || error);
      alert('Erro inesperado ao atualizar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('authToken');

    try {
      const res = await fetch(`http://localhost:3000/courses/${course._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (res.ok) {
        alert('Curso excluído com sucesso!');
        onSuccess();
        onClose();
      } else {
        alert('Erro ao excluir curso');
      }
    } catch (error) {
      console.error(error);
      alert('Erro inesperado ao excluir');
    }
  };

  return (
    <div className={styles.courseModal}>
      <div className={styles.modalContent}>
        <button className={styles.closeModal} onClick={onClose}>
          <FiX size={24} />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.modalImageWrapper}>
            <img
              src={thumbnail ? URL.createObjectURL(thumbnail) : course.thumbnailUrl || '/default.png'}
              alt="Imagem do curso"
              className={styles.modalImage}
            />

            <label htmlFor="upload" className={styles.imageUploadButton}>
              Trocar imagem
            </label>

            <input
              type="file"
              id="upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setThumbnail(file);
                }
              }}
            />
          </div>
          <div className={styles.modalTitleSection}>
            <input
              type="text"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              className={styles.input}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <span className={styles.courseProfessor}>
              <FiUser size={16} /> {course.professorId?.name}
            </span>
            <span className={styles.courseDate}>
              <FiCalendar size={16} /> Criado em: {new Date(course.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <FiBook size={20} /> Descrição do Curso
            </h3>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.actionButtons}>
            <button
              className={styles.editButton}
              onClick={handleUpdate}
              disabled={isSaving}
            >
              <FiSave size={18} /> {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button className={styles.deleteButton} onClick={handleDelete}>
              <FiTrash2 size={18} /> Excluir Curso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};