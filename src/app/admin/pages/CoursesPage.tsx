import { useState } from 'react';
import { CoursesGrid } from '../components/Courses/CoursesGrid';
import { CourseModal } from '../components/Courses/CourseModal';
import { useCourses } from '../hooks/useCourses';
import styles from './styles.module.css';
import { FiSearch } from 'react-icons/fi';

export const CoursesPage = () => {
  const {
    courses,
    isLoading,
    error,
    selectedCourse,
    filters,
    setSelectedCourse,
    handleDeleteCourse,
    debouncedSearch,
    fetchCourses
  } = useCourses();

  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className={styles.coursesContainer}>
      <div className={styles.courseFilters}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={filters.search}
            onChange={(e) => debouncedSearch(e.target.value)}
            className={styles.searchInput}
          />
          <FiSearch className={styles.searchIcon} />
        </div>
        <button 
          className={styles.createButton}
          onClick={() => setShowCreateModal(true)}
        >
          Criar Novo Curso
        </button>
      </div>

      <CoursesGrid
        courses={courses}
        isLoading={isLoading}
        error={error}
        onCourseClick={setSelectedCourse}
        onDeleteClick={handleDeleteCourse}
      />

      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onEdit={() => {
            // Implementar edição
            console.log('Editar curso:', selectedCourse);
          }}
          onDelete={handleDeleteCourse}
        />
      )}

      {/* Modal de criação seria implementado aqui */}
    </div>
  );
};