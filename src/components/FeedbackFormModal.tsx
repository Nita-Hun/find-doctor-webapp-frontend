'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import { FeedbackFormModalProps } from '@/types/Feedback';
import { Star } from 'lucide-react';

export default function FeedbackFormModal({
  feedback,
  appointments,
  onClose,
  onSuccess,
}: FeedbackFormModalProps) {
  const [formData, setFormData] = useState({
    rating: feedback?.rating || 5,
    comment: feedback?.comment || '',
    appointmentId: feedback?.appointmentId || (appointments[0]?.id || 0),
  });

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [appointmentOptions, setAppointmentOptions] = useState<
    { id: number; label: string }[]
  >([]);

  useEffect(() => {
    const options = appointments.map((appt) => {
      const doctor = appt.doctorName || 'Unknown Doctor';
      const type = appt.appointmentTypeName || 'Appointment';
      const dateObj = new Date(appt.dateTime);
      const date = dateObj.toLocaleDateString();
      const time = dateObj.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      return {
        id: appt.id,
        label: `${doctor} — ${type} on ${date} at ${time}`,
      };
    });
    setAppointmentOptions(options);
  }, [appointments]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === 'rating' || field === 'appointmentId'
          ? Number(value)
          : value,
    }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.rating || formData.rating < 1 || formData.rating > 5)
      newErrors.rating = 'Rating must be between 1–5';
    if (!formData.comment.trim()) newErrors.comment = 'Comment is required';
    if (!formData.appointmentId)
      newErrors.appointmentId = 'Appointment selection is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (feedback?.id) {
        await apiClient.put(`/api/feedbacks/${feedback.id}`, formData);
        toast.success('Feedback updated!');
      } else {
        await apiClient.post('/api/feedbacks', formData);
        toast.success('Feedback submitted!');
      }
      onSuccess();
    } catch (error: any) {
      console.error(error);
      if (
        error?.response?.data?.message?.includes(
          'Feedback already exists'
        )
      ) {
        toast.error(
          'You have already submitted feedback for this appointment.'
        );
      } else {
        toast.error('You have already submitted feedback for this appointment.');
      }
    } finally {
      setLoading(false);
    }
  };

  const StarRating = () => (
    <div className="flex space-x-1 mb-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => handleInputChange('rating', star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(null)}
          className="text-yellow-400 hover:scale-110 transition-transform"
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            fill={
              hoverRating !== null
                ? star <= hoverRating
                  ? '#facc15'
                  : 'none'
                : star <= formData.rating
                ? '#facc15'
                : 'none'
            }
            stroke="#facc15"
            className="w-6 h-6"
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6 animate-fadeIn relative">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-semibold">
            {feedback?.id ? 'Edit Feedback' : 'Leave Your Feedback'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            disabled={loading}
            aria-label="Close feedback form"
          >
            <FiX size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block font-medium text-sm mb-1">
              Rating <span className="text-red-500">*</span>
            </label>
            <StarRating />
            {errors.rating && (
              <p className="text-red-500 text-xs">{errors.rating}</p>
            )}
          </div>

          {/* Appointment */}
          <div>
            <label
              htmlFor="appointmentId"
              className="block font-medium text-sm mb-1"
            >
              Appointment <span className="text-red-500">*</span>
            </label>
            <select
              id="appointmentId"
              value={formData.appointmentId}
              onChange={(e) => handleInputChange('appointmentId', e.target.value)}
              disabled={appointmentOptions.length === 1}
              className={`w-full border rounded-md px-3 py-2 text-sm ${
                errors.appointmentId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {appointmentOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.appointmentId && (
              <p className="text-red-500 text-xs">{errors.appointmentId}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label
              htmlFor="comment"
              className="block font-medium text-sm mb-1"
            >
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              rows={4}
              placeholder="Share your thoughts..."
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm ${
                errors.comment ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.comment && (
              <p className="text-red-500 text-xs">{errors.comment}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-3 border-t mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
              {loading
                ? feedback?.id
                  ? 'Updating...'
                  : 'Submitting...'
                : feedback?.id
                ? 'Update'
                : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
