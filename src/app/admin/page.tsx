'use client'
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import { FiMoon, FiSun, FiMenu, FiX, FiHome, FiUsers, FiBook } from 'react-icons/fi';
import styles from './admin.module.css';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Configura responsividade e tema
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Verifica tema salvo
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    document.documentElement.classList.toggle('dark', savedMode);
    
    // Configura listener de resize
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Alternador de tema
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (!user || user.role !== 'admin') return <div className={styles.unauthorized}>Acesso não autorizado</div>;

  return (
    <div className={`${styles.adminContainer} ${darkMode ? styles.dark : ''}`}>
      {/* Cabeçalho */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.toggleButton}
            onClick={() => isMobile ? setIsMobileOpen(!isMobileOpen) : setIsCollapsed(!isCollapsed)}
          >
            {isMobile ? (isMobileOpen ? <FiX /> : <FiMenu />) : (isCollapsed ? '→' : '←')}
          </button>
          <span className={styles.logo}>ADMIN</span>
        </div>
        
        <div className={styles.headerRight}>
          <button 
            onClick={toggleDarkMode}
            className={styles.themeToggle}
            aria-label={darkMode ? 'Modo claro' : 'Modo escuro'}
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          
          <span className={styles.userInfo}>
            Bem-vindo, <strong>{user.name}</strong>
          </span>
        </div>
      </header>

      {/* Overlay para mobile */}
      {isMobile && (
        <div 
          className={`${styles.sidebarOverlay} ${isMobileOpen ? styles.open : ''}`}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Menu Lateral */}
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isMobileOpen ? styles.open : ''}`}>
        <nav>
          <ul>
            <li>
              <button 
                onClick={() => {
                  setSelectedPage('dashboard');
                  if (isMobile) setIsMobileOpen(false);
                }}
                className={selectedPage === 'dashboard' ? styles.active : ''}
              >
                <FiHome size={20} />
                {(!isCollapsed || isMobile) && <span>Dashboard</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setSelectedPage('users');
                  if (isMobile) setIsMobileOpen(false);
                }}
                className={selectedPage === 'users' ? styles.active : ''}
              >
                <FiUsers size={20} />
                {(!isCollapsed || isMobile) && <span>Usuários</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setSelectedPage('courses');
                  if (isMobile) setIsMobileOpen(false);
                }}
                className={selectedPage === 'courses' ? styles.active : ''}
              >
                <FiBook size={20} />
                {(!isCollapsed || isMobile) && <span>Cursos</span>}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className={`${styles.mainContent} ${isCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.contentBox}>
          <h1>
            {selectedPage === 'dashboard' && '📊 Dashboard'}
            {selectedPage === 'users' && '👤 Gestão de Usuários'}
            {selectedPage === 'courses' && '📚 Gestão de Cursos'}
          </h1>
          {/* Seu conteúdo aqui */}
        </div>
      </main>
    </div>
  );
}