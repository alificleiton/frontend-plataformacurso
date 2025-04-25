import { FiBook, FiUser, FiTrash2 } from 'react-icons/fi';
import styles from './styles.module.css';
import { Course } from '../../../types/course';

interface CoursesGridProps {
  courses: Course[];
  isLoading: boolean;
  error: string;
  onCourseClick: (course: Course) => void;
  onDeleteClick: (courseId: string) => void;
}

export const CoursesGrid = ({
  courses,
  isLoading,
  error,
  onCourseClick,
  onDeleteClick
}: CoursesGridProps) => {
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Carregando cursos...</p>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (courses.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FiBook size={48} />
        <h3>Nenhum curso encontrado</h3>
        <p>Parece que não há cursos disponíveis no momento.</p>
      </div>
    );
  }

  return (
    <div className={styles.courseGrid}>
      {courses.map(course => (
        <div 
          key={course._id} 
          className={styles.courseCard}
          onClick={() => onCourseClick(course)}
        >
          <div className={styles.courseImage}>
            <img 
              src={course.thumbnailUrl || '/default-course.png'} 
              alt={course.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-course.png';
              }}
            />
            <div className={styles.coursePrice}>
              {course.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </div>
          </div>
          
          <div className={styles.courseContent}>
            <h3>{course.title}</h3>
            <p className={styles.courseDescription}>
              {course.description.length > 100 
                ? `${course.description.substring(0, 100)}...` 
                : course.description}
            </p>
            
            <div className={styles.courseFooter}>
              <span className={styles.courseProfessor}>
                <FiUser size={14} /> {course.professorId?.name}
              </span>
              <button 
                className={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(course._id);
                }}
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};