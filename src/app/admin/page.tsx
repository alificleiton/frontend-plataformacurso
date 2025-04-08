'use client'
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState, useCallback } from 'react';
import { FiMoon, FiSun, FiMenu, FiX, FiHome, FiUsers, FiBook, FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from './admin.module.css';
import debounce from 'lodash/debounce';


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

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'admin' as 'admin' | 'professor' | 'aluno',
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
  }, [selectedPage, pagination.page, filters.search, filters.role]);

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

  // Após a função handleDeleteUser
  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === 'role' ? value as 'admin' | 'professor' | 'aluno' : value,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/auth/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar usuário');
      }

      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao atualizar usuário');
      console.error('Erro ao atualizar usuário:', err);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters((prev) => ({ ...prev, search: value }));
    }, 100),
    []
  );

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
                  onChange={(e) => debouncedSearch(e.target.value)}
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
                                <button className={styles.editBtn}  onClick={() => handleEditClick(user)}>
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

          {editingUser && (
            <div className={styles.modalOverlay}>
              {editingUser && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                      <h2>Editar Usuário</h2>
                      <span className={styles.userId}>ID: {editingUser._id}</span>
                      <button 
                        className={styles.closeModal}
                        onClick={() => setEditingUser(null)}
                        aria-label="Fechar modal"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                    
                    <form onSubmit={handleEditSubmit} className={styles.editForm}>
                      <div className={styles.formSection}>
                        <h3>Informações Básicas</h3>
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="name">Nome Completo</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={editForm.name}
                            onChange={handleEditFormChange}
                            required
                            className={styles.formInput}
                          />
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="email">Endereço de Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={editForm.email}
                            onChange={handleEditFormChange}
                            required
                            className={styles.formInput}
                          />
                        </div>
                      </div>
                      
                      <div className={styles.formSection}>
                        <h3>Configurações de Perfil</h3>
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="role">Tipo de Usuário</label>
                          <select
                            id="role"
                            name="role"
                            value={editForm.role}
                            onChange={handleEditFormChange}
                            required
                            className={styles.formInput}
                          >
                            <option value="admin">Administrador</option>
                            <option value="professor">Professor</option>
                            <option value="aluno">Aluno</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className={styles.formFooter}>
                        <button 
                          type="button" 
                          className={styles.cancelButton}
                          onClick={() => setEditingUser(null)}
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit" 
                          className={styles.saveButton}
                        >
                          Salvar Alterações
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}