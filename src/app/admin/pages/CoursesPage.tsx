import { useState } from 'react';
import { CoursesGrid } from '../components/Courses/CoursesGrid';
import { CourseModal } from '../components/Courses/CourseModal';
import { CreateCourseModal } from '../components/Courses/CreateCourseModal';
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

  const handleSuccess = () => {
    fetchCourses();
    setSelectedCourse(null);
  };

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
          onSuccess={handleSuccess}
          onDelete={fetchCourses} // ← Aqui ele atualiza os cursos após exclusão
        />
      )}

      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchCourses();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};