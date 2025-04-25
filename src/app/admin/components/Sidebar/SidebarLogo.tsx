import { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

interface SidebarLogoProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onEditProfile: () => void;
}

export const SidebarLogo = ({ user, onEditProfile }: SidebarLogoProps) => {
  const [imgSrc, setImgSrc] = useState(user.avatarUrl?.trim() || '/default-avatar.png');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <img
        src={imgSrc}
        alt={`Avatar de ${user.name}`}
        onError={() => setImgSrc('/default-avatar.png')}
        onClick={() => setOpen(!open)}
        className={styles.avatar}
      />

      {open && (
        <div className={styles.dropdown}>
          <ul>
            <li onClick={onEditProfile}>Editar perfil</li>
            <li onClick={handleLogout}>Sair</li>
          </ul>
        </div>
      )}
    </div>
  );
};