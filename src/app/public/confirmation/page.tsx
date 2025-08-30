'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function ConfirmationPage() {
  const router = useRouter();

  useEffect(() => {
    // Optional: redirect after 10 seconds
    const timer = setTimeout(() => {
      router.push("/public");
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Appointment Booked Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for booking. We've received your appointment and payment successfully. Please check My Appointments page for more details.
        </p>
        <button
        onClick={() => window.location.href = "/public"}
        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
        Back to Home
        </button>

      </div>
    </main>
  );
}
