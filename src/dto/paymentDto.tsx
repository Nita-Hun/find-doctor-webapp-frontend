export interface PaymentDto {
  id: number;
  appointmentId: number;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  paidAt: string | null;
  patientName: string;
}