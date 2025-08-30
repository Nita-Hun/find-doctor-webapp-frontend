import { UserSimple } from "./User";

export interface Doctor {
  id?: number;
  firstname: string;
  lastname: string;
  status: string;
  hospitalId: number;
  specializationId: number;
  createdAt?: string;
  updatedAt?: string;

  userId?: number;    
  userEmail?: string;
}

export interface DoctorFormModalProps {
  doctor?: Doctor | null;
  users?: UserSimple[]; 
  onClose: () => void;
  onSuccess: () => void;
}

export type DoctorOption = {
  id: number;
  name: string;
  hospitalName?: string;
  hospitalPhone?: string;
};






