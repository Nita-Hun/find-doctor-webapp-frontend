'use client';

import { useState, useEffect } from 'react';
import CommonFooter from '@/components/CommonFooter';
import Image from 'next/image';
import { FaUserMd, FaCalendarCheck, FaHeadset, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { Feedback } from '@/types/Feedback';

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} aria-label="Full star" />
      ))}
      {halfStar && <FaStar key="half" className="opacity-50" aria-label="Half star" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaStar key={`empty-${i}`} className="opacity-30" aria-label="Empty star" />
      ))}
    </>
  );
}

export default function AboutPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedbackRes, summaryRes] = await Promise.all([
          apiClient.get('/api/feedbacks', { params: { page: 0, size: 5 } }),
          apiClient.get('/api/feedbacks/summary'),
        ]);

        setFeedbacks(feedbackRes.data.content);

        const { averageRating, ratingCount } = summaryRes.data;
        setAverageRating(averageRating ?? 0);
        setRatingCount(ratingCount ?? 0);
      } catch (error) {
        toast.error('Failed to load patient feedback');
      } finally {
        setLoadingFeedback(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section className="bg-blue-600 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">About FindDoctor</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Empowering patients with seamless access to trusted doctors and modern healthcare.
        </p>
      </section>

      {/* Intro */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Who We Are</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            FindDoctor is a smart healthcare platform designed to simplify how patients discover,
            schedule, and manage doctor appointments — all in one place.
          </p>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="text-center p-6 border rounded-xl hover:shadow-lg transition">
            <FaUserMd className="mx-auto text-blue-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold">Verified Doctors</h3>
            <p className="text-gray-600 mt-2">Only qualified and approved doctors are listed on our platform.</p>
          </div>
          <div className="text-center p-6 border rounded-xl hover:shadow-lg transition">
            <FaCalendarCheck className="mx-auto text-blue-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold">Smart Booking</h3>
            <p className="text-gray-600 mt-2">Book appointments in seconds, anytime, anywhere.</p>
          </div>
          <div className="text-center p-6 border rounded-xl hover:shadow-lg transition">
            <FaHeadset className="mx-auto text-blue-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold">24/7 Support</h3>
            <p className="text-gray-600 mt-2">Our support team is here to assist you anytime you need help.</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <Image
            src="/assets/images/image1.jpg"
            alt="Team Working"
            width={600}
            height={400}
            className="rounded-lg shadow"
          />
          <div>
            <h3 className="text-2xl font-bold mb-4">Our Mission & Vision</h3>
            <p className="text-gray-700 mb-4">
              Our mission is to democratize access to healthcare by connecting patients with trusted doctors using modern technology. We envision a world where healthcare is timely, transparent, and accessible to all.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Improve patient-doctor relationships</li>
              <li>Provide real-time appointment availability</li>
              <li>Ensure secure and easy communication</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Patient Ratings - Average & Count */}
      <section className="py-16 bg-white text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Patient Feedback Summary</h2>
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="bg-yellow-50 rounded-2xl p-6 shadow border border-yellow-200">
            <div className="flex items-center justify-center text-yellow-500 text-6xl mb-2">
              <FaStar aria-hidden="true" />
              <span className="ml-2">{averageRating.toFixed(1)}</span>
            </div>
            <p className="text-yellow-600 font-semibold">Average Rating</p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 shadow border border-blue-200">
            <div className="text-blue-600 text-6xl font-bold mb-2">{ratingCount}</div>
            <p className="text-blue-600 font-semibold">Total Reviews</p>
          </div>
        </div>
      </section>

      {/* Doctor List Preview */}
      <section className="bg-gray-100 py-16 text-center">
        <h2 className="text-3xl font-bold mb-10">Top Rated Doctors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
          {[
            {
              name: 'Dr. Sopheak Seng',
              specialty: 'Cardiologist',
              rating: 4.9,
              img: '/assets/images/doctor1.png',
            },
            {
              name: 'Dr. Lina Chenda',
              specialty: 'Dermatologist',
              rating: 4.8,
              img: '/assets/images/2.png',
            },
            {
              name: 'Dr. Vuth Dara',
              specialty: 'Pediatrician',
              rating: 4.7,
              img: '/assets/images/3.png',
            },
            {
              name: 'Dr. Sok Roth',
              specialty: 'Orthopedic Surgeon',
              rating: 4.9,
              img: '/assets/images/1.png',
            },
          ].map((doc, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow">
              <Image
                src={doc.img}
                alt={doc.name}
                width={160}
                height={160}
                className="rounded-full mx-auto mb-4 object-cover"
              />
              <h4 className="text-lg font-semibold">{doc.name}</h4>
              <p className="text-sm text-gray-500">{doc.specialty}</p>
              <div className="flex justify-center mt-2 text-yellow-400" aria-label={`${doc.rating} stars`}>
                <StarRating rating={doc.rating} />
              </div>
              <p className="text-sm text-gray-600 mt-1">{doc.rating.toFixed(1)} rating</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {/* Step 1 */}
          <div className="p-6 border rounded-lg hover:shadow-md transition">
            <div className="text-blue-600 text-4xl mb-4">🩺</div>
            <h3 className="text-xl font-semibold mb-2">Find Your Doctor</h3>
            <p className="text-gray-600">
              Search by specialization, location, or hospital to discover verified and trusted doctors.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 border rounded-lg hover:shadow-md transition">
            <div className="text-blue-600 text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Book Appointment</h3>
            <p className="text-gray-600">
              Select your preferred time slot and confirm your booking in just a few clicks.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 border rounded-lg hover:shadow-md transition">
            <div className="text-blue-600 text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Get Treated</h3>
            <p className="text-gray-600">
              Visit the doctor in person or join an online consultation — it’s your choice.
            </p>
          </div>
        </div>
      </section>

      <CommonFooter />
    </div>
  );
}
