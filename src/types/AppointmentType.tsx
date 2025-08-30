export interface AppointmentType {
  id?: number; 
  name: string;
  price: number;
  duration: number;
  createdAt?: string;
  updatedAt?: string;
}

export type AppointmentTypeOption = {
  id: number;
  name: string;
  price: number;
  duration: number;
};

