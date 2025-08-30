'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { apiClient } from '@/lib/api-client';
import { PagedResponse } from '@/types/PagedResponse';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';
import { DoctorDto } from '@/dto/doctorDto';

// StarRating component
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-400" aria-label="Full star" />
      ))}
      {halfStar && <FaStar key="half" className="text-yellow-400 opacity-50" aria-label="Half star" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaStar key={`empty-${i}`} className="text-yellow-400 opacity-30" aria-label="Empty star" />
      ))}
    </>
  );
}

export default function DoctorPublicPage() {
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const doctorsPerRow = 4;
  const initialRows = 1;
  const initialShowCount = doctorsPerRow * initialRows;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await apiClient.get<PagedResponse<DoctorDto>>('/api/doctors', {
          params: { page: 0, size: 100, status: 'ACTIVE' },
        });
        setDoctors(response.data.content);
        setFilteredDoctors(response.data.content);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDoctors(doctors);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();

    const filtered = doctors.filter((doctor) => {
      const fullName = `${doctor.firstname} ${doctor.lastname}`.toLowerCase();
      const specialization = doctor.specializationName?.toLowerCase() ?? '';
      const hospital = doctor.hospitalName?.toLowerCase() ?? '';

      return (
        fullName.includes(lowerSearch) ||
        specialization.includes(lowerSearch) ||
        hospital.includes(lowerSearch)
      );
    });

    setFilteredDoctors(filtered);
    setShowAll(false);
  }, [searchTerm, doctors]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="mt-2 text-gray-600">Loading doctors...</span>
      </div>
    );
  }

  if (filteredDoctors.length === 0) {
    return (
      <div className="px-20">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <p className="text-center text-gray-500 mt-10">No doctors found.</p>
      </div>
    );
  }

  const handleBookClick = () => {
    if (!isLoggedIn) {
      alert("Please login or register first to book an appointment.");
    } else {
      router.push("/public/booking"); 
    }
  };

  const doctorsToShow = showAll ? filteredDoctors : filteredDoctors.slice(0, initialShowCount);
  return (
    <div className="px-20">
      {/* Search Bar */}
      <div className="w-full flex justify-center mb-15">
        <div className="w-full max-w-2xl relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search doctors by name, specialization, or hospital..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search doctors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-5 mt-6 px-8">
        {doctorsToShow.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white p-8 rounded-lg shadow hover:shadow-xl transition-shadow text-center flex flex-col"
          >
            <div className="w-30 h-30 mx-auto rounded-full overflow-hidden mb-4 relative border border-gray-200">
              {doctor.user?.profilePhotoUrl ? (
                <Image
                    src={doctor.user.profilePhotoUrl}
                    alt={`Dr. ${doctor.firstname} ${doctor.lastname}`}
                    fill
                    sizes="128px"
                    className="object-cover"
                />
                ) : (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center text-4xl font-bold text-gray-700 select-none">
                    {doctor.firstname?.charAt(0).toUpperCase() ?? ''}
                    {doctor.lastname?.charAt(0).toUpperCase() ?? ''}
                </div>
                )}

            </div>
            <h3 className="text-lg font-semibold">{`Dr. ${doctor.firstname} ${doctor.lastname}`}</h3>
            <p className="text-sm text-gray-500">{doctor.specializationName ?? 'Specialization not specified'}</p>
            <p className="text-sm text-gray-500 mt-2">{doctor.hospitalName ?? 'Hospital not specified'}</p>
            <button
              onClick={() => handleBookClick()}
              className=" bg-blue-600 text-white py-2 px-3 w-fit rounded-md hover:bg-blue-700 transition-colors mt-6 mx-auto"
            >
              Booking
            </button>
          </div>
        ))}
      </div>

      {/* Show More / Show Less Button */}
      {filteredDoctors.length > initialShowCount && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="inline-block bg-gray-200 hover:bg-gray-300 text-blue-400 font-normal py-2 px-6 rounded-lg transition"
          >
            {showAll ? 'View Less' : 'View More'}
          </button>
        </div>
      )}
    </div>
  );
}

// Search input component
function SearchBar({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  return (
    <div className="max-w-md mx-auto">
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search doctors by name, specialization, or hospital..."
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-label="Search doctors"
        autoComplete="off"
      />
    </div>
  );
}
