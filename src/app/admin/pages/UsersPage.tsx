import { UsersTable } from '../components/Users/UsersTable';
import { UserEditModal } from '../components/Users/UserEditModal';
import { useUsers } from '../hooks/useUsers';
import { User } from '../../types/user'; // Ajuste o caminho

export const UsersPage = () => {
  const {
    users,
    isLoading,
    error,
    pagination,
    filters,
    editingUser,
    setPagination,
    setFilters,
    setEditingUser,
    handleDeleteUser,
    debouncedSearch,
    fetchUsers
  } = useUsers();

  // Função adaptadora para o onEditClick
  const handleEditClick = (user: User) => {
    setEditingUser(user);
  };

  const handlePageChange = (page: number) => {
    setPagination({...pagination, page});
  };

  const handleSearchChange = (value: string) => {
    debouncedSearch(value);
    setFilters({...filters, search: value});
  };

  const handleRoleChange = (role: string) => {
    setFilters({...filters, role});
  };

  return (
    <div className="users-container">
      {error && <div className="error">{error}</div>}
      
      <UsersTable 
        users={users}
        isLoading={isLoading}
        pagination={{
          page: pagination.page,
          pages: pagination.pages
        }}
        filters={filters}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteUser}
      />
      
      {editingUser && (
        <UserEditModal 
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={fetchUsers}
        />
      )}
    </div>
  );
};