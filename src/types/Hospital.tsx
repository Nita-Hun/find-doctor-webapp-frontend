 export interface Hospital {
  id?: number;
  name: string;
  phone: string;
  address: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface HospitalFormModalProps {
  hospital: Hospital | null;
  onClose: () => void;
  onSuccess: () => void;
}