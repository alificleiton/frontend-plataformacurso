'use client'
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { CoursesPage } from './pages/CoursesPage';
import styles from './admin.module.css';
import { SidebarLogo } from './components/Sidebar/SidebarLogo';
import { EditProfileForm } from './components/Profile/EditProfileForm';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(user);

  const handleSaveProfile = async (formData: { name: string; email: string; avatar?: string }) => {
    try {
      // 1. Criar FormData para enviar a imagem se necessário
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('email', formData.email);
      if (formData.avatar && typeof formData.avatar !== 'string') {
        formPayload.append('avatar', formData.avatar);
      }
  
      // 2. Fazer a requisição
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formPayload
      });
  
      if (!response.ok) throw new Error(await response.text());
  
      // 3. Atualizar a UI
      setSelectedPage('dashboard');
      // Atualize também o usuário no contexto/auth se necessário
      
      return true; // Indica sucesso
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      throw error; // Propaga o erro para o formulário
    }
  };
  
  // No seu EditProfileForm:
  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    document.documentElement.classList.toggle('dark', savedMode);
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Atualize o useEffect para usar currentUser
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (!user || user.role !== 'admin') return <div className={styles.unauthorized}>Acesso não autorizado</div>;

  const renderPage = () => {
    switch (selectedPage) {
      case 'dashboard':
        return <DashboardPage user={user} />;
      case 'users':
        return <UsersPage />;
      case 'courses':
        return <CoursesPage />;
      case 'edit-profile':
        return (
          <EditProfileForm
            user={currentUser}
            onClose={() => setSelectedPage('dashboard')}
            onSuccess={(updatedUser) => {
              setCurrentUser(updatedUser); // Atualiza o usuário no estado
              // Se você estiver usando um contexto de autenticação, atualize-o também
              // authContext.updateUser(updatedUser);
            }}
          />
        );
      default:
        return <DashboardPage user={user} />;
    }
  };

  return (
    <div className={`${styles.adminContainer} ${darkMode ? styles.dark : ''}`}>
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        isMobile={isMobile}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        user={user}
        onEditProfile={() => {
          setSelectedPage('edit-profile');
          if (isMobile) setIsMobileOpen(false);
        }}
      />

      {isMobile && (
        <div 
          className={`${styles.sidebarOverlay} ${isMobileOpen ? styles.open : ''}`}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <Sidebar
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <main className={`${styles.mainContent} ${isCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.contentBox}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}