export const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' }
];

export const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
};

export const doctorStatusOptions = [
  { value: '', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'ON_LEAVE', label: 'On Leave' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

export const doctorStatusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    ON_LEAVE: 'bg-yellow-100 text-yellow-800',
    SUSPENDED: 'bg-red-100 text-red-800'
};

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED';

export const paymentStatusOptions = [
  { value: "", label: "All Statuses" },
  { value: "PAID", label: "Paid" },
  { value: "REFUNDED", label: "Refunded" },
  { value: "PENDING", label: "Pending" },
];

export const paymentStatusColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-800",
  REFUNDED: "bg-yellow-100 text-yellow-800",
  PENDING: "bg-blue-100 text-blue-800",
};

export const appointmentStatusOptions = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELED', label: 'Canceled' },
];

export const appointmentStatusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
};

export const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];