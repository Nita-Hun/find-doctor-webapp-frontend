export interface Payment {
  id?: number;
  paymentStatus: string;
  paymentMethod: string;
  amount: number;

}
export interface Appointment {
  id: number;
  patientName: string;
  dateTime: string;
  amount: number;
  doctorSpecialty?: string;
}

