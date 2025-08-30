'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import UserFormModal from '@/components/UserFormModal';
import ErrorState from '@/components/ErrorState';
import { Pencil, Trash2 } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { PagedResponse } from '@/types/PagedResponse';
import { FiSearch } from 'react-icons/fi';
import UserThumbnail from '@/components/UserThumbnail';
import { formatDate } from '@/utils/formatDate';
import { UserDto } from '@/dto/userDto';

export default function UsersPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [allRoles, setAllRoles] = useState<{ id: number; name: string }[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const roleColors = useMemo(
    () => ({
      ADMIN: 'bg-purple-100 text-purple-800',
      PATIENT: 'bg-blue-100 text-blue-800',
      DOCTOR: 'bg-green-100 text-green-800',
    }),
    []
  );

  function getRoleColor(roleName?: string) {
    if (!roleName) return 'bg-gray-100 text-gray-800';
    return roleColors[roleName as keyof typeof roleColors] || 'bg-gray-100 text-gray-800';
  }

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<PagedResponse<UserDto>>('/api/users', {
        params: {
          page: currentPage - 1,
          size: pageSize,
          search: searchTerm || undefined,
          role: roleFilter || undefined,
        },
      });

      const pagedData = response.data;

      if (pagedData.content.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        return;
      }

      setUsers(pagedData.content);
      setTotalPages(pagedData.page.totalPages);
      setTotalItems(pagedData.page.totalElements);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, roleFilter]);

  const fetchRoles = useCallback(async () => {
    setLoadingRoles(true);
    try {
      const response = await apiClient.get('/api/roles');
      setAllRoles(response.data.content || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
      toast.error('Failed to fetch roles');
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshKey]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await apiClient.delete(`/api/users/${id}`);
        toast.success('User deleted successfully');
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => {
            setSelectedUser(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
        >
          + Add New User
        </button>
      </div>

      {/* Search and filter bar */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow text-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search users..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-gray-600 text-sm whitespace-nowrap">Role:</span>
              <select
                value={roleFilter}
                onChange={handleRoleFilterChange}
                disabled={loadingRoles}
                className="p-2 border border-gray-300 rounded-md text-sm w-full md:w-auto"
              >
                <option value="">All Roles</option>
                {allRoles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name.charAt(0).toUpperCase() + role.name.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-gray-600 text-sm whitespace-nowrap">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-2 border border-gray-300 rounded-md text-sm w-full md:w-auto"
              >
                {[5, 10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <ErrorState
          error={error}
          onRetry={() => setRefreshKey((prev) => prev + 1)}
        />
      )}

      {/* Empty state */}
      {!isLoading && !error && users.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {searchTerm || roleFilter ? 'No matching users found' : 'No users available'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || roleFilter ? 'Try adjusting your search/filters' : 'Get started by adding a new user'}
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('');
                setSelectedUser(null);
                setShowModal(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-400 focus:outline-none"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add User
            </button>
          </div>
        </div>
      )}

      {/* Users table */}
      {!isLoading && !error && users.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 hidden md:table-header-group">
                <tr className="transition-colors duration-150">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`flex flex-col md:table-row md:flex-row bg-white md:bg-transparent mb-4 md:mb-0 rounded-lg md:rounded-none shadow md:shadow-none border border-gray-100 md:border-0 even:bg-blue-50`}
                  >
                    {/* ID */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">ID</span>
                      <span className="text-gray-800">#{user.id}</span>
                    </td>
                    
                    {/* User */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      {UserThumbnail({ user })}
                    </td>

                    {/* Email */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Email</span>
                      <span className="text-gray-800">{user.email}</span>
                    </td>

                    {/* Role */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Role</span>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role ?? '')}`}
                      >
                        {user.role ?? 'N/A'}
                      </span>
                    </td>

                    {/* Created At */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Created At</span>
                      <span>{formatDate(user.createdAt)}</span>
                    </td>

                    {/* Actions */}
                    <td className="flex space-x-2 justify-end gap-2 md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <UserFormModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}