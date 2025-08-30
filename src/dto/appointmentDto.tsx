import { AppointmentStatus } from "@/types/Status";

export interface AppointmentDto {
  id: number;
  doctorId: number;
  doctorName?: string;
  doctorImage?: string;
  patientId: number;
  patientName?: string;
  patientImage?: string;
  appointmentTypeId: number;
  appointmentTypeName?: string;
  doctorHospitalName?: string;
  doctorHospitalPhone?: string;
  dateTime: string;
  note?: string;
  status: AppointmentStatus;
  paymentStatus?: string | null;
  feedbackGiven: boolean; 
}