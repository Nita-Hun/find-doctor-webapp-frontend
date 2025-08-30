'use client';

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";
import CommonFooter from "@/components/CommonFooter";

if (typeof window !== "undefined") {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

type SpecializationDto = {
  id: number;
  name: string;
  iconUrl?: string;
  createdAt: string;
  updatedAt: string;
};

type Page<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
};

export default function SpecializationsPage() {
  const [specializations, setSpecializations] = useState<SpecializationDto[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  async function fetchSpecializations() {
    if (isNaN(page)) {
      console.warn("Invalid page value:", page);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get<Page<SpecializationDto>>("/api/specializations", {
        params: {
          page,
          size: 30,
          search: search.trim() || undefined,
        },
      });

      setSpecializations(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch:", error);
      toast.error("Failed to load specializations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSpecializations();
  }, [page, search]);

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">Specializations</h1>

      {/* Search Input */}
      <div className="mb-8 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search specializations..."
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Display loading or results */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : specializations.length === 0 ? (
        <p className="text-center text-gray-500">No specializations found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {specializations.map((spec) => (
            <div
              key={spec.id}
              className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition cursor-pointer"
            >
              {spec.iconUrl ? (
                  spec.iconUrl.startsWith("http") ? (
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full">
                      <img
                        src={spec.iconUrl}
                        alt={spec.name}
                        className="w-10 h-10 object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 text-3xl">
                      <i className="material-icons">{spec.iconUrl}</i>
                    </div>
                  )
                ) : (
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 font-bold text-xl">
                    {spec.name.charAt(0)}
                  </div>
                )}

              <h2 className="text-xl font-semibold text-center text-blue-700 mb-2">{spec.name}</h2>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center space-x-4">
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            className={`px-4 py-2 rounded-lg border ${
              page === 0
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-blue-600 border-blue-600 hover:bg-blue-100"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {page + 1} of {totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            className={`px-4 py-2 rounded-lg border ${
              page + 1 >= totalPages
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-blue-600 border-blue-600 hover:bg-blue-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
      
    </div>
    <CommonFooter/>
    </>
  );
}
