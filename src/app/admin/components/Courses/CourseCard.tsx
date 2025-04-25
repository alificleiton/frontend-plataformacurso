import { Course } from '../../../types/course';
import { FiUser, FiTrash2 } from 'react-icons/fi';
import styles from './styles.module.css';

interface CourseCardProps {
  course: Course;
  onClick: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

export const CourseCard = ({ course, onClick, onDelete }: CourseCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(course._id);
  };

  return (
    <div 
      className={styles.courseCard}
      onClick={() => onClick(course)}
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
            onClick={handleDelete}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};