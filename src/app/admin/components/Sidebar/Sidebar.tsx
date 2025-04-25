import { FiHome, FiUsers, FiBook } from 'react-icons/fi';
import styles from './styles.module.css';

interface SidebarProps {
  selectedPage: string;
  setSelectedPage: (page: string) => void;
  isCollapsed: boolean;
  isMobile: boolean;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar = ({
  selectedPage,
  setSelectedPage,
  isCollapsed,
  isMobile,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) => {
  const handlePageChange = (page: string) => {
    setSelectedPage(page);
    if (isMobile) setIsMobileOpen(false);
  };

  // Itens do menu
  const menuItems = [
    { id: 'dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
    { id: 'users', icon: <FiUsers size={20} />, label: 'Usuários' },
    { id: 'courses', icon: <FiBook size={20} />, label: 'Cursos' },
  ];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isMobileOpen ? styles.open : ''}`}>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handlePageChange(item.id)}
                className={selectedPage === item.id ? styles.active : ''}
                aria-label={item.label}
              >
                {item.icon}
                {(!isCollapsed || isMobile) && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};