import { PatientDto } from "@/dto/patientDto";
import { UserSimple } from "./User";

export interface Patient {
  id?: number;
  firstname: string;
  lastname: string;
  status: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;

  userId?: number;    
  userEmail?: string;
}

//For patient form modal
export interface PatientFormModalProps {
  patient?: PatientDto | null;
  users?: UserSimple[]; 
  onClose: () => void;
  onSuccess: () => void;
}

//For patient info public page
export interface PatientInfoFormProps {
  firstname: string;
  setFirstname: (v: string) => void;
  lastname: string;
  setLastname: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  dateOfBirth: string;
  setDateOfBirth: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  onNext: () => void;
}



