export interface DoctorDto {
  user: any;
  id: number;
  firstname: string;
  lastname: string;
  status: string;
  hospitalId: number;
  hospitalName?: string;
  specializationId: number;
  specializationName?: string;
  createdAt: string;
  updatedAt: string;

  userId?: number;    
  userEmail?: string; 
}