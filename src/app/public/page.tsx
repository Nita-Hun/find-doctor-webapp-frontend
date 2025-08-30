'use client';

import CommonFooter from "@/components/CommonFooter";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image';
import DoctorPublicPage from "./doctorList/page";


export default function PublicHome() {

  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleBookClick = () => {
    if (!isLoggedIn) {
      alert("Please login or register first to book an appointment.");
    } else {
      router.push("/public/booking"); 
    }
  };
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Health <span className="text-blue-600">Matters</span> to Us
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                Compassionate care, advanced medicine, and your well-being at the heart of everything we do.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleBookClick}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Book Appointment
                  </button>
                <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="relative">
                <Image
                  src="/assets/images/doctor.webp"
                  alt="Doctor"
                  width={500}
                  height={500}
                  priority
                  className="w-full max-w-md mx-auto rounded-xl shadow-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr />
      {/* SPECIALITY SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-lg">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
              Specialized <span className="text-blue-600">Healthcare</span> Excellence
            </h2>
            <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive medical services tailored to meet your individual health needs.
            </p>
          </div>
        </div>
        {/* Doctor list */}
        <DoctorPublicPage />
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-lg">Our Partners</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
              Trusted <span className="text-blue-600">Healthcare</span> Collaborations
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We partner with leading healthcare organizations to provide the best care possible.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Partner 1 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
              <div className="h-32 flex items-center justify-center p-4">
                <img 
                  src="./assets/images/khema.webp" 
                  alt="Khema International Hospital" 
                  className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 p-2"
                />
              </div>
            </div>
            
            {/* Partner 2 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
              <div className="h-32 flex items-center justify-center p-4">
                <img 
                  src="./assets/images/orienda.webp" 
                  alt="Orienta Medical Center" 
                  className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 p-2"
                />
              </div>
            </div>
            
            {/* Partner 3 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
              <div className="h-32 flex items-center justify-center p-4">
                <img 
                  src="./assets/images/prestige.webp" 
                  alt="Prestige Medical Center" 
                  className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 p-2"
                />
              </div>
            </div>
            
            {/* Partner 4 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
              <div className="h-32 flex items-center justify-center p-4">
                <img 
                  src="./assets/images/royalpp.webp" 
                  alt="Royal Phnom Penh Hospital" 
                  className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 p-2"
                />
              </div>
            </div>
            
            {/* Partner 5 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
              <div className="h-32 flex items-center justify-center p-4">
                <img 
                  src="./assets/images/skmh.webp" 
                  alt="Sen Sok International University Hospital" 
                  className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 p-2"
                />
              </div>
            </div>
            
            {/* Partner 6 */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
              <div className="h-32 flex items-center justify-center p-4">
                <img 
                  src="./assets/images/calmette.webp" 
                  alt="Calmette Hospital" 
                  className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 p-2"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center">
              View all partners
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      
      <CommonFooter/>

    </main>
  );
}