'use client';

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import toast from "react-hot-toast";
import Pagination from "@/components/Pagination";
import { PagedResponse } from "@/types/PagedResponse";
import { FiSearch, FiDollarSign, FiClock } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";
import ErrorState from "@/components/ErrorState";
import { formatDate } from "@/utils/formatDate";
import { paymentStatusColors, paymentStatusOptions } from "@/types/Status";
import { PaymentDto } from "@/dto/paymentDto";

export default function PaymentsListPage() {
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingRefundId, setProcessingRefundId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchPayments();
  }, [currentPage, pageSize, searchTerm, statusFilter, refreshKey]);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<PagedResponse<PaymentDto>>("/api/payments", {
        params: {
          page: currentPage - 1,
          size: pageSize,
          search: searchTerm || undefined,
          status: statusFilter || undefined,
        },
      });

      const pagedData = res.data;

      if (pagedData.content.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        return;
      }

      setPayments(pagedData.content);
      setTotalPages(pagedData.page.totalPages);
      setTotalItems(pagedData.page.totalElements);
    } catch {
      setError("Failed to load payments. Please try again.");
      toast.error("Failed to load payments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefund = async (paymentId: number) => {
    if (!confirm("Are you sure you want to refund this payment?")) return;
    setProcessingRefundId(paymentId);
    try {
      await apiClient.post(`/api/payments/${paymentId}/refund`);
      toast.success("Refund successful");
      setRefreshKey((prev) => prev + 1);
    } catch {
      toast.error("Refund failed");
    } finally {
      setProcessingRefundId(null);
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-xs border border-gray-100">
          <FiClock className="text-gray-400" />
          <span className="text-sm font-medium text-gray-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
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
              placeholder="Search by doctor/patient..."
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
                {paymentStatusOptions.map((option) => (
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
      {!isLoading && !error && payments.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FiDollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            {searchTerm || statusFilter ? 'No matching payments found' : 'No payments available'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter ? 'Try adjusting your search/filters' : 'Payments will appear here once created'}
          </p>
        </div>
      )}

      {/* Payments table */}
      {!isLoading && !error && payments.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 hidden md:table-header-group">
                <tr className="transition-colors duration-150">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Appointment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Paid At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="flex flex-col md:table-row md:flex-row bg-white md:bg-transparent mb-4 md:mb-0 rounded-lg md:rounded-none shadow md:shadow-none border border-gray-100 md:border-0 even:bg-blue-100"
                  >
                    {/* ID */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">ID</span>
                      <span className="text-gray-800">#{payment.id}</span>
                    </td>

                    {/* Appointment */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Appointment</span>
                      <span>{payment.appointmentId}</span>
                    </td>

                    {/* Doctor */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Doctor</span>
                      <span>{payment.patientName}</span>
                    </td>

                    {/* Amount */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Amount</span>
                      <span className="font-medium">${payment.amount.toFixed(2)}</span>
                    </td>

                    {/* Status */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Status</span>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          paymentStatusColors[payment.paymentStatus] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {payment.paymentStatus}
                      </span>
                    </td>

                    {/* Method */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Method</span>
                      <span>{payment.paymentMethod || "N/A"}</span>
                    </td>

                    {/* Paid At */}
                    <td className="flex justify-between md:table-cell px-4 py-2 md:px-6 md:py-4">
                      <span className="font-medium text-gray-500 md:hidden">Paid At</span>
                      <span>{formatDate(payment.paidAt)}</span>
                    </td>

                    {/* Action */}
                    <td className="flex justify-end md:table-cell px-4 py-2 md:px-6 md:py-4">
                      {payment.paymentStatus !== "REFUNDED" ? (
                        <button
                          onClick={() => handleRefund(payment.id)}
                          disabled={processingRefundId === payment.id}
                          className={`text-blue-600 hover:text-blue-800 text-sm font-medium ${
                            processingRefundId === payment.id ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {processingRefundId === payment.id ? "Processing..." : "Refund"}
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
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
    </div>
  );
}