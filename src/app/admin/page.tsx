'use client'
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import { FiMoon, FiSun, FiMenu, FiX, FiHome, FiUsers, FiBook, FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from './admin.module.css';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'professor' | 'aluno';
  createdAt: string;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Estado para a tabela de usuários
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [filters, setFilters] = useState({
    search: '',
    role: '',
  });

  // Configura responsividade e tema
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

  // Busca usuários quando a página ou filtros mudam
  useEffect(() => {
    if (selectedPage === 'users') {
      fetchUsers();
    }
  }, [selectedPage, pagination.page, filters]);

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      setError('');
      
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Token não encontrado');
  
      const { page, limit } = pagination;
      const { search, role } = filters;
      
      const response = await fetch(`http://localhost:3000/auth/users?page=${page}&limit=${limit}&search=${search}&role=${role}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar usuários');
      }
      
      const data = await response.json();
      
      setUsers(data.data);
      setPagination({
        ...pagination,
        total: data.total,
        pages: data.pages,
      });
    } catch (err: any) { // Adicione a tipagem 'any' temporariamente
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar usuários');
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };
  

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir usuário');
      }
      
      fetchUsers();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao excluir usuário');
      console.error('Erro ao excluir usuário:', err);
    }
  };

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
          
          {/* Conteúdo da página de usuários */}
          {selectedPage === 'users' && (
            <div className={styles.usersContainer}>
              {error && <div className={styles.error}>{error}</div>}
              
              {/* Filtros */}
              <div className={styles.tableFilters}>
                <input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  className={styles.filterInput}
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
                
                <select
                  className={styles.filterSelect}
                  value={filters.role}
                  onChange={(e) => setFilters({...filters, role: e.target.value})}
                >
                  <option value="">Todos os perfis</option>
                  <option value="admin">Administrador</option>
                  <option value="professor">Professor</option>
                  <option value="aluno">Aluno</option>
                </select>
              </div>
              
              {/* Tabela */}
              {isLoadingUsers ? (
                <div className={styles.loading}>Carregando usuários...</div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.usersTable}>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Perfil</th>
                        <th>Data de Cadastro</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              {user.role === 'admin' && 'Administrador'}
                              {user.role === 'professor' && 'Professor'}
                              {user.role === 'aluno' && 'Aluno'}
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                              <div className={styles.actions}>
                                <button className={styles.editBtn}>
                                  <FiEdit2 size={16} />
                                </button>
                                <button 
                                  className={styles.deleteBtn}
                                  onClick={() => handleDeleteUser(user._id)}
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className={styles.noResults}>
                            Nenhum usuário encontrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  
                  {/* Paginação */}
                  {pagination.total > 0 && (
                    <div className={styles.pagination}>
                      <button
                        onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                        disabled={pagination.page === 1}
                      >
                        Anterior
                      </button>
                      
                      <span>
                        Página {pagination.page} de {pagination.pages}
                      </span>
                      
                      <button
                        onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                        disabled={pagination.page === pagination.pages}
                      >
                        Próxima
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}