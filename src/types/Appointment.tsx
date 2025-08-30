import { AppointmentTypeOption } from "./AppointmentType";
import { DoctorOption } from "./Doctor";

export interface Appointment {
  id?: number;
  doctorId: number;
  patientId: number;
  appointmentTypeId: number;
  dateTime: string;
  note?: string;
}
export interface AppointmentFormModalProps {
  appointment?: Appointment;
  onClose: () => void;
  onSuccess: () => void;
}

export interface AppointmentPageProps {
  userRole: 'ADMIN' | 'DOCTOR' | 'PATIENT';
}

//For public appointment details
export interface AppointmentDetailsProps {
  doctorId: number;
  setDoctorId: (v: number) => void;
  appointmentTypeId: number;
  setAppointmentTypeId: (v: number) => void;
  dateTime: string;
  setDateTime: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  doctors: DoctorOption[];
  appointmentTypes: AppointmentTypeOption[];
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
}

export type SelectOption = {
  id: number;
  name: string;
};







