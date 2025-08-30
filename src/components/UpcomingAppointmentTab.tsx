'use client';

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import toast from "react-hot-toast";
import { PagedResponse } from "@/types/PagedResponse";
import { CalendarCheckIcon, CalendarDaysIcon, CalendarIcon, ClipboardListIcon } from "lucide-react";
import HistoryAppointments from "./HistoryAppointmentTab";
import { formatDate } from "@/utils/formatDate";
import { AppointmentStatus, statusColors } from "@/types/Status";
import { AppointmentDto } from "@/dto/appointmentDto";

export default function UpcomingAppointmentTabs() {
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-3 text-sm font-medium transition-colors duration-200 relative ${
            tab === "upcoming"
              ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setTab("upcoming")}
        >
          Upcoming Appointments
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium transition-colors duration-200 relative ${
            tab === "history"
              ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setTab("history")}
        >
          Appointment History
        </button>
      </div>

      <div className="mt-6">
        {tab === "upcoming" ? (
          <UpcomingAppointments />
        ) : (
          <HistoryAppointments />
        )}
              </div>
            </div>
          );
        }

function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, pageSize]);

  async function fetchAppointments() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<PagedResponse<AppointmentDto>>(
        "/api/appointments/my",
        {
          params: {
            page: currentPage - 1,
            size: pageSize,
          },
        }
      );
      const upcoming = res.data.content.filter(a => a.status === "PENDING" || a.status === "CONFIRMED");
      setAppointments(upcoming);
      setTotalPages(res.data.page.totalPages);
      if (res.data.content.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      setError("Failed to load your appointments");
      toast.error("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  }

  async function cancelAppointment(id: number) {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await apiClient.patch(`/api/appointments/${id}/cancel`);
      toast.success("Appointment canceled successfully");
      fetchAppointments();
    } catch {
      toast.error("Failed to cancel appointment");
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-5 border rounded-xl animate-pulse bg-white">
            <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-5"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded-full w-full"></div>
              <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
            </div>
            <div className="mt-5 pt-4 border-t">
              <div className="h-8 bg-gray-200 rounded-full w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg border border-red-200 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-gray-50 rounded-lg">
        <CalendarCheckIcon className="w-12 h-12 text-gray-400" />
        <p className="text-gray-500 text-lg">You have no upcoming appointments</p>
        <p className="text-gray-400 text-sm">Schedule an appointment to get started</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <div className="p-5">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {appointment.doctorName || "N/A"}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${
                    statusColors[appointment.status] || "bg-gray-100 text-gray-800 border-gray-200"
                  } whitespace-nowrap`}
                >
                  {appointment.status}
                </span>
              </div>
              
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-start text-gray-600">
                  <CalendarDaysIcon className="w-4 h-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
                  <span>{formatDate(appointment.dateTime)}</span>
                </div>
                <div className="flex items-start text-gray-600">
                  <ClipboardListIcon className="w-4 h-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
                  <span>{appointment.appointmentTypeName || "General Checkup"}</span>
                </div>
                
                {appointment.doctorHospitalName && (
                  <div className="flex items-start text-gray-600">
                    <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{appointment.doctorHospitalName}</span>
                  </div>
                )}

                {appointment.doctorHospitalPhone && (
                  <div className="flex items-start text-gray-600">
                    <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{appointment.doctorHospitalPhone}</span>
                  </div>
                )}
              </div>
              
              {["PENDING", "CONFIRMED"].includes(appointment.status) && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => cancelAppointment(appointment.id)}
                    className="w-full py-2 px-4 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}