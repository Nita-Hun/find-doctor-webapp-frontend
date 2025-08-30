export interface PatientDto {
  id: number;
  firstname: string;
  lastname: string;
  status: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  createdAt: string;
  updatedAt: string;

  userId?: number;    
  userEmail?: string;
}