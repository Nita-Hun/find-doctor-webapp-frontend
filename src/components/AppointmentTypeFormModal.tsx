'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AppointmentType } from '@/types/AppointmentType';
import { apiClient } from '@/lib/api-client';
import { FiX } from 'react-icons/fi';

export default function AppointmentTypeFormModal({
  appointmentType,
  onClose,
  onSuccess
}: {
  appointmentType: AppointmentType | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<AppointmentType>({
    name: '',
    price: 0,
    duration: 0
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    price: '',
    duration: ''
  });

  useEffect(() => {
    if (appointmentType) {
      setFormData({
        name: appointmentType.name,
        price: appointmentType.price,
        duration: appointmentType.duration
      });
    }
  }, [appointmentType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name.endsWith('Id') ? parseInt(value, 10) || 0 : value 
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', price: '', duration: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (formData.price < 0) {
      newErrors.price = 'Price must be positive';
      isValid = false;
    }

    if(formData.duration < 0) {
      newErrors.duration = 'Duration must be positive';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      if (appointmentType?.id) {
        await apiClient.put(`/api/appointment-types/${appointmentType.id}`, formData);
        toast.success('Appointment type updated successfully');
      } else {
        await apiClient.post('/api/appointment-types', formData);
        toast.success('Appointment type created successfully');
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Submission error:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to save appointment type';
      
      toast.error(errorMessage);
      
      if (error.response?.data?.error?.includes('unique')) {
        setErrors(prev => ({ ...prev, name: 'This name already exists' }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold">
            {appointmentType ? 'Edit Appointment Type' : 'Add New Appointment Type'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm" noValidate>
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Price Field */}
          <div>
            <label htmlFor="price" className="block font-medium mb-1">
              Price <span className="text-red-600">*</span>
            </label>
            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              required
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>
          {/* Duration Field */}
          <div>
            <label htmlFor="duration" className="block font-medium mb-1">
              Duration <span className="text-red-600">*</span>
            </label>
            <input
              id="duration"
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full border ${errors.duration ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              required
            />
            {errors.duration && (
              <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
            )}
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
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {appointmentType ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                appointmentType ? 'Update' : 'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}