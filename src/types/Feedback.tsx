import { AppointmentDto } from "@/dto/appointmentDto";

export interface Feedback {
  id?: number;
  rating: number;
  comment: string;
  appointmentId: number;
  createdAt?: string;
  updatedAt?: string;
  doctorName?: string;
  doctorId?: number;
}

export interface Appointment {
  appointmentTypeName: string;
  dateTime: string | number | Date;
  id: number;
  doctor?: {
    id: number;
    name: string;
  };
  doctorName?: string;
  doctorId?: number;
}

export interface FeedbackFormModalProps {
  feedback: Feedback | null;
  appointments: (AppointmentDto | Appointment)[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ratingOptions = [
    { value: '', label: 'All Ratings' },
    { value: '1', label: '★☆☆☆☆' },
    { value: '2', label: '★★☆☆☆' },
    { value: '3', label: '★★★☆☆' },
    { value: '4', label: '★★★★☆' },
    { value: '5', label: '★★★★★' },
  ];

export const ratingColors: Record<number, string> = {
    1: 'bg-red-100 text-red-800',
    2: 'bg-orange-100 text-orange-800',
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-blue-100 text-blue-800',
    5: 'bg-green-100 text-green-800',
  };