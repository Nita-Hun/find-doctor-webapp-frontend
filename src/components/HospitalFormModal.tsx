'use client';

import { FiX } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { HospitalFormModalProps } from '@/types/Hospital';
import { formatDate } from '@/utils/formatDate';

export default function HospitalFormModal({ 
  hospital, 
  onClose, 
  onSuccess 
}: HospitalFormModalProps) {
  const [formData, setFormData] = useState({
    name: hospital?.name || '',
    phone: hospital?.phone || '',
    address: hospital?.address || ''
  });
  const [isNameUnique, setIsNameUnique] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hospital) {
      setFormData({
        name: hospital.name,
        phone: hospital.phone,
        address: hospital.address,
      });
    }
  }, [hospital]);

  const checkNameUniqueness = async () => {
    if (!formData.name.trim()) {
      setIsNameUnique(true);
      return;
    }

    setIsChecking(true);
    try {
      const response = await apiClient.get('/api/hospitals/check-name', {
        params: {
          name: formData.name.trim(),
          excludeId: hospital?.id
        }
      });
      setIsNameUnique(response.data.isUnique);
      if (!response.data.isUnique) {
        setErrors(prev => ({ ...prev, name: 'Hospital name already exists' }));
      } else {
        setErrors(prev => ({ ...prev, name: '' }));
      }
    } catch (error) {
      console.error('Error checking name uniqueness:', error);
      toast.error('Error checking name uniqueness');
    } finally {
      setIsChecking(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'name') {
      setIsNameUnique(true);
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[\d\s+\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!isNameUnique && !isChecking) {
      await checkNameUniqueness();
      return;
    }
    if (!isNameUnique) return;

    setLoading(true);
    try {
      if (hospital) {
        await apiClient.put(`/api/hospitals/${hospital.id}`, formData);
        toast.success('Hospital updated successfully');
      } else {
        await apiClient.post('/api/hospitals', formData);
        toast.success('Hospital created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving hospital:', error);
      toast.error('Failed to save hospital');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold">
            {hospital ? 'Edit Hospital' : 'Add New Hospital'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Hospital Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={checkNameUniqueness}
              className={`w-full border ${
                errors.name || !isNameUnique ? 'border-red-500' : 'border-gray-300'
              } rounded px-3 py-2`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
            {!isNameUnique && !errors.name && (
              <p className="text-red-500 text-xs mt-1">This hospital name already exists</p>
            )}
            {isChecking && (
              <p className="text-gray-500 text-xs mt-1">Checking name availability...</p>
            )}
          </div>
          
          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block font-medium mb-1">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } rounded px-3 py-2`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
          
          {/* Address Field */}
          <div>
            <label htmlFor="address" className="block font-medium mb-1">
              Address <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full border ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              } rounded px-3 py-2`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          {/* Created At and Updated At Fields */}
          {hospital && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Created At</label>
                <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50">
                  {formatDate(hospital.createdAt)}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Updated At</label>
                <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50">
                  {formatDate(hospital.updatedAt)}
                </div>
              </div>
            </div>
          )}

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
              disabled={loading || isChecking}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {hospital ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                hospital ? 'Update' : 'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}