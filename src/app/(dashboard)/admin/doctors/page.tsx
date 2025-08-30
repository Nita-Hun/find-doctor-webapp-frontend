'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import DoctorFormModal from '@/components/DoctorFormModal';
import ErrorState from '@/components/ErrorState';
import { Pencil, Trash2 } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { PagedResponse } from '@/types/PagedResponse';
import { FiSearch } from 'react-icons/fi';
import { formatDate } from '@/utils/formatDate';
import { UserSimple } from '@/types/User';
import { doctorStatusColors, doctorStatusOptions } from '@/types/Status';
import { DoctorDto } from '@/dto/doctorDto';


export default function DoctorPage() {
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [users, setUsers] = useState<UserSimple[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);


  const fetchDoctors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<PagedResponse<DoctorDto>>('/api/doctors', {
        params: {
          page: currentPage - 1,
          size: pageSize,
          search: searchTerm || undefined,
          status: statusFilter || undefined,
        },
      });

      const pagedData = response.data;

      if (pagedData.content.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        return;
      }
      setDoctors(pagedData.content);
      setTotalPages(pagedData.page.totalPages);
      setTotalItems(pagedData.page.totalElements);
    } catch (err: any) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again.');
      toast.error('Failed to fetch doctors');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get<UserSimple[]>('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast.error('Failed to load user list');
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [refreshKey, currentPage, searchTerm, pageSize, statusFilter]);

  // Fetch users only once on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      try {
        await apiClient.delete(`/api/doctors/${id}`);
        toast.success('Doctor deleted successfully');
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error('Error deleting doctor:', error);
        toast.error('Failed to delete doctor');
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setShowModal(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Doctor Management</h1>
        <button
          onClick={() => {
            setSelectedDoctor(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
        >
          + Add New Doctor
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
              placeholder="Search patients..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-gray-600 text-sm whitespace-nowrap">Status:</span>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="p-2 border border-gray-300 rounded-md text-sm w-full md:w-auto"
              >
                {doctorStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
      {!isLoading && !error && doctors.length === 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-20">
          <div className="max-w-md w-full p-8 rounded-lg shadow text-center">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {searchTerm || statusFilter ? 'No matching patients found' : 'No patients available'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter ? 'Try adjusting your search/filters' : 'Get started by adding a new patient'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setSelectedDoctor(null);
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
                Add Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctors table */}
      {!isLoading && !error && doctors.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 hidden md:table-header-group">
                <tr className="transition-colors duration-150">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Specialization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Hospital</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {doctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className={`flex flex-col md:table-row md:flex-row bg-white md:bg-transparent mb-4 md:mb-0 rounded-lg md:rounded-none shadow md:shadow-none border border-gray-100 md:border-0 even:bg-blue-100`}
                  >
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">ID</span>
                      <span className="text-gray-800">#{doctor.id}</span>
                    </td>
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Doctor</span>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                          <span className="text-blue-600 font-semibold">
                            {doctor.firstname.charAt(0)}{doctor.lastname.charAt(0)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-800 font-medium">{doctor.firstname} {doctor.lastname}</span>
                          <span className="text-gray-500 text-xs">{doctor.userEmail || '—'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Specialization</span>
                      <span>{doctor.specializationName || 'N/A'}</span>
                    </td>

                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Hospital</span>
                      <span>{doctor.hospitalName || 'N/A'}</span>
                    </td>

                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Status</span>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${doctorStatusColors[doctor.status] || 'bg-gray-100 text-gray-800'}`}>
                        {doctor.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Last Updated</span>
                      <span>{formatDate(doctor.updatedAt)}</span>
                    </td>

                    <td className="flex space-x-2 justify-end gap-2 md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <button
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.id)}
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

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && !isLoading && (
        <ErrorState error={error} onRetry={() => setRefreshKey((prev) => prev + 1)} />
      )}

      {doctors.length === 0 && !isLoading && !error && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-20">
          <div className="max-w-md w-full p-8 rounded-lg shadow text-center">
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
              {searchTerm || statusFilter ? 'No matching doctors found' : 'No doctors available'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter ? 'Try adjusting your search/filters' : 'Get started by adding a new doctor'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setSelectedDoctor(null);
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
                Add Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <DoctorFormModal
          doctor={selectedDoctor}
          users={users}           // pass user list here
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}