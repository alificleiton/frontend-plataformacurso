import { FiX, FiUser, FiCalendar, FiBook, FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from './styles.module.css';
import { Course } from '../../../types/course';

interface CourseModalProps {
  course: Course;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (courseId: string) => void;
}

export const CourseModal = ({
  course,
  onClose,
  onEdit,
  onDelete
}: CourseModalProps) => {
  return (
    <div className={styles.courseModal}>
      <div className={styles.modalContent}>
        <button 
          className={styles.closeModal}
          onClick={onClose}
        >
          <FiX size={24} />
        </button>
        
        <div className={styles.modalHeader}>
          <div className={styles.modalImageContainer}>
            <img 
              src={course.thumbnailUrl || '/default-course.png'} 
              alt={course.title}
              className={styles.modalImage}
            />
          </div>
          <div className={styles.modalTitleSection}>
            <h2>{course.title}</h2>
            <div className={styles.courseMeta}>
              <span className={styles.coursePrice}>
                {course.price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </span>
              <span className={styles.courseProfessor}>
                <FiUser size={16} /> {course.professorId?.name}
              </span>
              <span className={styles.courseDate}>
                <FiCalendar size={16} /> Criado em: {new Date(course.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <FiBook size={20} /> Descrição do Curso
            </h3>
            <p className={styles.sectionContent}>{course.description}</p>
          </div>
          
          <div className={styles.actionButtons}>
            <button className={styles.editButton} onClick={onEdit}>
              <FiEdit2 size={18} /> Editar Curso
            </button>
            <button 
              className={styles.deleteButton}
              onClick={() => {
                onClose();
                onDelete(course._id);
              }}
            >
              <FiTrash2 size={18} /> Excluir Curso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};