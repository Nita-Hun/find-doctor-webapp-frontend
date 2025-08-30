'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import { Patient, PatientFormModalProps } from '@/types/Patient';
import { genderOptions, statusOptions } from '@/types/Status';

export default function PatientFormModal({
  patient,
  users = [],
  onClose,
  onSuccess,
}: PatientFormModalProps) {
  const [formData, setFormData] = useState<Patient>({
    firstname: '',
    lastname: '',
    status: 'ACTIVE',
    gender: 'MALE',
    dateOfBirth: '',
    address: '',
    userId: 0,
  });

  const [userOptions, setUserOptions] = useState<{ id: number; email: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await apiClient.get('/api/users', { params: { page: 0, size: 1000 } });
        const data = res.data;
        if (Array.isArray(data)) {
          setUserOptions(data);
        } else if (Array.isArray(data.content)) {
          setUserOptions(data.content);
        } else {
          setUserOptions([]);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        toast.error('Failed to load users');
      }
    }

    if (users.length > 0) {
      setUserOptions(users);
    } else {
      fetchUsers();
    }
  }, [users]);

  useEffect(() => {
    if (patient) {
      setFormData({
        firstname: patient.firstname,
        lastname: patient.lastname,
        status: patient.status,
        gender: patient.gender,
        dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
        address: patient.address,
        userId: patient.userId ?? 0,
      });
    } else {
      setFormData({
        firstname: '',
        lastname: '',
        status: 'ACTIVE',
        gender: 'MALE',
        dateOfBirth: '',
        address: '',
        userId: 0,
      });
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'userId' ? (value ? parseInt(value, 10) : 0) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.dateOfBirth ||
      !formData.address ||
      !formData.userId
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        dateOfBirth: `${formData.dateOfBirth}T00:00:00`,
      };

      if (patient) {
        await apiClient.put(`/api/patients/${patient.id}`, payload);
        toast.success('Patient updated successfully');
      } else {
        await apiClient.post('/api/patients', payload);
        toast.success('Patient created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving patient:', error);
      toast.error('Failed to save patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold">{patient ? 'Edit Patient' : 'Add New Patient'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm" noValidate>
          {/* First Name */}
          <div>
            <label htmlFor="firstname" className="block font-medium mb-1">
              First Name <span className="text-red-600">*</span>
            </label>
            <input
              id="firstname"
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastname" className="block font-medium mb-1">
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              id="lastname"
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* User Email */}
          <div>
            <label htmlFor="userId" className="block font-medium mb-1">
              User Email <span className="text-red-600">*</span>
            </label>
            <select
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value={0} disabled>
                Select user
              </option>
              {userOptions.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block font-medium mb-1">
              Status <span className="text-red-600">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block font-medium mb-1">
              Gender <span className="text-red-600">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block font-medium mb-1">
              Date of Birth <span className="text-red-600">*</span>
            </label>
            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block font-medium mb-1">
              Address <span className="text-red-600">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {patient ? 'Updating...' : 'Creating...'}
                </span>
              ) : patient ? 'Update Patient' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
