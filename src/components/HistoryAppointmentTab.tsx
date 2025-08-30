'use client';

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";
import { format } from "date-fns";
import FeedbackFormModal from "./FeedbackFormModal";
import { AppointmentDto } from "@/dto/appointmentDto";

export default function HistoryAppointments() {
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchAppointments(page: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/api/appointments/my/history", {
        params: {
          page: page - 1,
          size: pageSize,
        },
      });

      const fetched: AppointmentDto[] = res.data.content;
      setAppointments(fetched);
      setTotalPages(res.data.page.totalPages);

      const completedWithFeedback = fetched.filter(
        (a) => a.status === "COMPLETED" && a.feedbackGiven
      );
      if (completedWithFeedback.length > 0) {
        toast.success(`${completedWithFeedback.length} feedback(s) already submitted`);
      }
    } catch {
      setError("Failed to load appointments");
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  const handleGiveFeedback = (appointment: AppointmentDto) => {
    setSelectedAppointment(appointment);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Appointment History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg border border-red-200">{error}</div>
      ) : appointments.filter((a) => a.status === "COMPLETED").length === 0 ? (
        <p>No completed appointments found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {appointments
              .filter((appointment) => appointment.status === "COMPLETED")
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className="border rounded-xl overflow-hidden shadow-sm bg-white"
                >
                  <div className="p-5">
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      {appointment.appointmentTypeName}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Doctor: {appointment.doctorName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Date & Time: {format(new Date(appointment.dateTime), "PPpp")}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Status:{" "}
                      <span className="text-green-600 font-medium">{appointment.status}</span>
                    </p>

                    {appointment.feedbackGiven ? (
                      <p className="text-sm text-green-600 mt-3">Feedback submitted</p>
                    ) : (
                      <button
                        onClick={() => handleGiveFeedback(appointment)}
                        className="mt-4 inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        Give Feedback
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between max-w-md mx-auto">
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
        </>
      )}

      {selectedAppointment && (
        <FeedbackFormModal
          feedback={null}
          appointments={[selectedAppointment]}
          onClose={() => setSelectedAppointment(null)}
          onSuccess={() => {
            setSelectedAppointment(null);
            fetchAppointments(currentPage);
          }}
        />
      )}
    </div>
  );
}
