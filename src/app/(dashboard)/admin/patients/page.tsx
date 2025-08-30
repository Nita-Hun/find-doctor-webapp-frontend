'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import PatientFormModal from '@/components/PatientFormModal';
import ErrorState from '@/components/ErrorState';
import { Pencil, Trash2 } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { PagedResponse } from '@/types/PagedResponse';
import { FiSearch } from 'react-icons/fi';
import { UserSimple } from '@/types/User';
import { formatDate } from '@/utils/formatDate';
import { statusColors, statusOptions } from '@/types/Status';
import { PatientDto } from '@/dto/patientDto';

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientDto | null>(null);
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
  const [users, setUsers] = useState<UserSimple[]>([]);

  // Fetch patients data
  const fetchPatients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<PagedResponse<PatientDto>>('/api/patients', {
        params: {
          page: currentPage - 1,
          size: pageSize,
          search: searchTerm || undefined,
          status: statusFilter || undefined,
        },
      });

      const pagedData = response.data;

      // If no results and not first page, go back a page
      if (pagedData.content.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        return;
      }

      setPatients(pagedData.content);
      setTotalPages(pagedData.page.totalPages);
      setTotalItems(pagedData.page.totalElements);
    } catch (err: any) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients. Please try again.');
      toast.error('Failed to fetch patients');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users data (for PatientFormModal user dropdown)
  const fetchUsers = async () => {
    try {
      const res = await apiClient.get<UserSimple[]>('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast.error('Failed to load user list');
    }
  };

  // Load users once when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Reload patients when dependencies change
  useEffect(() => {
    fetchPatients();
  }, [refreshKey, currentPage, searchTerm, pageSize, statusFilter]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      try {
        await apiClient.delete(`/api/patients/${id}`);
        toast.success('Patient deleted successfully');
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting patient:', error);
        toast.error('Failed to delete patient');
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
    setRefreshKey(prev => prev + 1);
    setShowModal(false);
    setSelectedPatient(null);
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 'N/A';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Patient Management</h1>
        <button
          onClick={() => {
            setSelectedPatient(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
        >
          + Add New Patient
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
                {statusOptions.map(option => (
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
      {!isLoading && !error && patients.length === 0 && (
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
                  setSelectedPatient(null);
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

      {/* Patients table */}
      {!isLoading && !error && patients.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 hidden md:table-header-group">
                <tr className="transition-colors duration-150">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Patient Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className={`flex flex-col md:table-row md:flex-row bg-white md:bg-transparent mb-4 md:mb-0 rounded-lg md:rounded-none shadow md:shadow-none border border-gray-100 md:border-0 even:bg-blue-100`}
                  >
                    {/* ID */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">ID</span>
                      <span className="text-gray-800">#{patient.id}</span>
                    </td>
                    
                    {/* Patient Details (Name, Gender, Email) */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Patient Details</span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                            <span className="text-blue-600 font-semibold">
                              {patient.firstname.charAt(0)}{patient.lastname.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-gray-800 font-medium">{patient.firstname} {patient.lastname}</div>
                            <div className="text-gray-500 text-xs">
                              <span className="capitalize">{patient.gender.toLowerCase()}</span>
                              {patient.userEmail && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span>{patient.userEmail}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Age */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Age</span>
                      <span>{calculateAge(patient.dateOfBirth)} years</span>
                    </td>

                    {/* Address */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Address</span>
                      <div className="text-gray-900">{patient.address}</div>
                    </td>

                    {/* Status */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Status</span>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[patient.status.toUpperCase()] || 'bg-gray-100 text-gray-800'}`}>
                        {patient.status.toUpperCase().replace('_', ' ')}
                      </span>
                    </td>

                    {/* Last Updated */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Last Updated</span>
                      <span>{formatDate(patient.updatedAt)}</span>
                    </td>

                    {/* Actions */}
                    <td className="flex space-x-2 justify-end gap-2 md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <button
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(patient.id)}
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
        <PatientFormModal
          patient={selectedPatient}
          users={users}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}