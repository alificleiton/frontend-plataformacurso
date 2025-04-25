import { User } from '../../../types/user';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from './styles.module.css';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  pagination: {
    page: number;
    pages: number;
  };
  filters: {
    search: string;
    role: string;
  };
  onPageChange: (page: number) => void;
  onSearchChange: (value: string) => void;
  onRoleChange: (role: string) => void;
  onEditClick: (user: User) => void;
  onDeleteClick: (userId: string) => void;
}


export const UsersTable = ({
  users,
  isLoading,
  pagination,
  filters,
  onPageChange,
  onSearchChange,
  onRoleChange,
  onEditClick,
  onDeleteClick,
}: UsersTableProps) => {
  if (isLoading) {
    return <div className={styles.loading}>Carregando usuários...</div>;
  }

  return (
    <div className={styles.usersContainer}>
      {/* Filtros */}
      <div className={styles.tableFilters}>
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          className={styles.filterInput}
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        
        <select
          className={styles.filterSelect}
          value={filters.role}
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <option value="">Todos os perfis</option>
          <option value="admin">Administrador</option>
          <option value="professor">Professor</option>
          <option value="aluno">Aluno</option>
        </select>
      </div>
      
      {/* Tabela */}
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
                      <button 
                        className={styles.editBtn} 
                        onClick={() => onEditClick(user)}
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => onDeleteClick(user._id)}
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
        {pagination.pages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Anterior
            </button>
            
            <span>
              Página {pagination.page} de {pagination.pages}
            </span>
            
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
};