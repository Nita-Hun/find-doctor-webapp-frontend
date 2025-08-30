'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import SpecializationFormModal from '@/components/SpecializationFormModal';
import ErrorState from '@/components/ErrorState';
import { Pencil, Trash2 } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { Specialization } from '@/types/Specialization';
import { PagedResponse } from '@/types/PagedResponse';
import { FiSearch } from 'react-icons/fi';
import { formatDate } from '@/utils/formatDate';

export default function SpecializationsPage() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchSpecializations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<PagedResponse<Specialization>>('/api/specializations', {
        params: {
          page: currentPage - 1,
          size: pageSize,
          search: searchTerm || undefined,
        },
      });

      const pagedData = response.data;

      if (pagedData.content.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        return;
      }
      const data = response.data;
      setSpecializations(pagedData.content);
      setTotalPages(data.page.totalPages);
      setTotalItems(data.page.totalElements);
    } catch (err: any) {
      console.error('Error fetching specializations:', err);
      setError('Failed to load specializations. Please try again.');
      toast.error('Failed to fetch specializations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, [refreshKey, currentPage, searchTerm, pageSize]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this specialization?')) {
      try {
        await apiClient.delete(`/api/specializations/${id}`);
        toast.success('Specialization deleted successfully');
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error('Error deleting specialization:', error);
        toast.error('Failed to delete specialization');
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setShowModal(false);
    setSelectedSpecialization(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Specializations Management</h1>
        <button
          onClick={() => {
            setSelectedSpecialization(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
        >
          + Add New Specialization
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
              placeholder="Search specializations..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="p-2 border border-gray-300 rounded-md text-sm"
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
      {!isLoading && !error && specializations.length === 0 && (
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {searchTerm ? 'No matching specializations found' : 'No specializations available'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search' : 'Get started by adding a new specialization'}
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization(null);
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
              Add Specialization
            </button>
          </div>
        </div>
      )}

      {/* Specializations table */}
      {!isLoading && !error && specializations.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 hidden md:table-header-group">
                <tr className="transition-colors duration-150">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Icon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {specializations.map((spec) => (
                  <tr
                    key={spec.id}
                    className={`flex flex-col md:table-row md:flex-row bg-white md:bg-transparent mb-4 md:mb-0 rounded-lg md:rounded-none shadow md:shadow-none border border-gray-100 md:border-0 even:bg-blue-100`}
                  >
                    {/* ID */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">ID</span>
                      <span className="text-gray-800">#{spec.id}</span>
                    </td>

                    {/* Icon */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Icon</span>
                      {spec.iconUrl ? (
                        <img
                          src={spec.iconUrl}
                          alt={`${spec.name} icon`}
                          className="h-10 w-10 rounded-full object-cover border border-gray-300"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/default-icon.png';
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {spec.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Name</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-800 font-medium">{spec.name}</span>
                      </div>
                    </td>

                    {/* Created At */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Created At</span>
                      <span>{formatDate(spec.createdAt)}</span>
                    </td>

                    {/* Last Updated */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Last Updated</span>
                      <span>{formatDate(spec.updatedAt)}</span>
                    </td>

                    {/* Actions */}
                    <td className="flex space-x-2 justify-end gap-2 md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <button
                        onClick={() => {
                          setSelectedSpecialization(spec);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(spec.id)}
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
        <SpecializationFormModal
          specialization={selectedSpecialization}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
