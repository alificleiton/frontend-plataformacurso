import { FiMoon, FiSun, FiMenu, FiX } from 'react-icons/fi';
import { SidebarLogo } from '../Sidebar/SidebarLogo';
import styles from './styles.module.css';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isMobile: boolean;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  user: any;
  onEditProfile: () => void;
}

export const Header = ({
  darkMode,
  toggleDarkMode,
  isMobile,
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
  user,
  onEditProfile
}: HeaderProps) => {
  return (
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
        
        <SidebarLogo 
          user={user} 
          onEditProfile={onEditProfile}
        />
      </div>
    </header>
  );
};