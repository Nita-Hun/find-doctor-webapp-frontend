'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import FeedbackFormModal from '@/components/FeedbackFormModal';
import ErrorState from '@/components/ErrorState';
import { Pencil, Trash2 } from 'lucide-react';
import { PagedResponse, PlainPagedResponse } from '@/types/PagedResponse';
import { FiSearch } from 'react-icons/fi';
import Pagination from '@/components/Pagination';
import { Appointment, Feedback, ratingColors, ratingOptions } from '@/types/Feedback';
import { formatDate } from '@/utils/formatDate';


export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);


  const fetchData = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const [feedbacksResponse, appointmentsResponse] = await Promise.all([
      apiClient.get<PagedResponse<Feedback>>('/api/feedbacks', {
        params: {
          page: currentPage - 1,
          size: pageSize,
          search: searchTerm || undefined,
          rating: ratingFilter || undefined,
        },
      }),
      apiClient.get('/api/appointments?includeDoctors=true'),
    ]);

    const appointmentsData = Array.isArray(appointmentsResponse.data)
      ? appointmentsResponse.data
      : appointmentsResponse.data?.content || [];

    setAppointments(appointmentsData);

    const pagedData = feedbacksResponse.data;
    const feedbacksData = pagedData.content;

    const enrichedFeedbacks = feedbacksData.map((feedback: Feedback) => {
      const appointment = appointmentsData.find((a: any) => a.id === feedback.appointmentId);
      const doctorName =
        appointment?.doctor?.name ||
        appointment?.doctorName ||
        appointment?.doctor?.fullName ||
        'Unknown Doctor';
      const doctorId =
        appointment?.doctor?.id ||
        appointment?.doctorId ||
        appointment?.doctor?.doctorId;

      return {
        ...feedback,
        doctorName,
        doctorId,
      };
    });

    if (enrichedFeedbacks.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      return;
    }

    setFeedbacks(enrichedFeedbacks);
    setTotalPages(pagedData.page.totalPages);
    setTotalItems(pagedData.page.totalElements);
  } catch (error) {
    console.error('Error fetching data:', error);
    setError('Failed to load data. Please try again.');
    toast.error('Failed to fetch data');
    setFeedbacks([]);
    setAppointments([]);
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    fetchData();
  }, [refreshKey, currentPage, searchTerm, pageSize, ratingFilter]);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this feedback?')) {
      try {
        await apiClient.delete(`/api/feedbacks/${id}`);
        toast.success('Feedback deleted successfully');
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error('Error deleting feedback:', error);
        toast.error('Failed to delete feedback');
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRatingFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRatingFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setShowModal(false);
    setSelectedFeedback(null);
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Feedback Management</h1>
        {/* <button
          onClick={() => {
            setSelectedFeedback(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
        >
          + Add New Feedback
        </button> */}
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
              placeholder="Search feedbacks..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-gray-600 text-sm whitespace-nowrap">Rating:</span>
              <select
                value={ratingFilter}
                onChange={handleRatingFilterChange}
                className="p-2 border border-gray-300 rounded-md text-sm w-full md:w-auto"
              >
                {ratingOptions.map(option => (
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
      {!isLoading && !error && feedbacks.length === 0 && (
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {searchTerm || ratingFilter ? 'No matching feedback found' : 'No feedback available'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || ratingFilter ? 'Try adjusting your search/filters' : 'Get started by adding new feedback'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRatingFilter('');
                  setSelectedFeedback(null);
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
                Add Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedbacks table */}
      {!isLoading && !error && feedbacks.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 hidden md:table-header-group">
                <tr className="transition-colors duration-150">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Comment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Appointment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {feedbacks.map((feedback) => (
                  <tr
                    key={feedback.id}
                    className={`flex flex-col md:table-row md:flex-row bg-white md:bg-transparent mb-4 md:mb-0 rounded-lg md:rounded-none shadow md:shadow-none border border-gray-100 md:border-0 even:bg-blue-100`}
                  >
                    {/* ID */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">ID</span>
                      <span className="text-gray-800">#{feedback.id}</span>
                    </td>

                    {/* Rating */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Rating</span>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${ratingColors[feedback.rating]}`}>
                        {renderStars(feedback.rating)} ({feedback.rating}/5)
                      </span>
                    </td>

                    {/* Comment */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Comment</span>
                      <div className="line-clamp-2">
                        {feedback.comment || 'N/A'}
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Doctor</span>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                          <span className="text-blue-600 font-semibold">
                            {feedback.doctorName?.charAt(0) || 'D'}
                          </span>
                        </div>
                        <span>{feedback.doctorName || 'N/A'}</span>
                      </div>
                    </td>

                    {/* Appointment */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Appointment</span>
                      <span>#{feedback.appointmentId}</span>
                    </td>

                    {/* Created */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Created</span>
                      <span>{formatDate(feedback.createdAt)}</span>
                    </td>

                    {/* Actions */}
                    <td className="flex space-x-2 justify-end gap-2 md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <button
                        onClick={() => handleDelete(feedback.id)}
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
        <FeedbackFormModal
          feedback={selectedFeedback}
          appointments={appointments}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}