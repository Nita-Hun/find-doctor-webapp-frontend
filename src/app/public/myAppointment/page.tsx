'use client';

import CommonFooter from "@/components/CommonFooter";
import UpcomingAppointmentTabs from "@/components/UpcomingAppointmentTab";

export default function PatientAppointmentsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your <span className="text-blue-600">Appointments</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your upcoming visits and view your appointment history all in one place.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <UpcomingAppointmentTabs />
          </div>
        </div>
      </div>
      {/* SOCIAL MEDIA SECTION */}
      <CommonFooter/>
    </main>
  );
}